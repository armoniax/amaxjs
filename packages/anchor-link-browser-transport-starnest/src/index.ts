import {
    APIError,
    Base64u,
    Bytes,
    isInstanceOf,
    Link,
    LinkChannelSession,
    LinkSession,
    LinkStorage,
    LinkTransport,
    SessionError,
    SigningRequest,
} from '@amax/anchor-link'

import styleText from './styles'
import generateQr from './qrcode'
import Intl from './i18n'

import {fuel, compareVersion as fuelVersion} from './fuel'

const AbortPrepare = Symbol()
const SkipFee = Symbol()
const SkipToManual = Symbol()

export interface BrowserTransportOptions {
    /** CSS class prefix, defaults to `anchor-link` */
    classPrefix?: string
    /** Whether to inject CSS styles in the page header, defaults to true. */
    injectStyles?: boolean
    /** Whether to display request success and error messages, defaults to true */
    requestStatus?: boolean
    /** Local storage prefix, defaults to `anchor-link`. */
    storagePrefix?: string
    /**
     * Whether to use Greymass Fuel for low resource accounts, defaults to false.
     * Note that this service is not available on all networks.
     * Visit https://greymass.com/en/fuel for more information.
     */
    disableGreymassFuel?: boolean
    /**
     * The referring account to pass along to the Greymass Fuel API endpoint.
     * Specifying an account name will indicate to the API which account is eligible
     * to potentially receive a share of the fees generated by their application.
     */
    fuelReferrer?: string
    /**
     * Override of the supported resource provider chains.
     */
    supportedChains?: Record<string, string>

    /**
     * Set to false to not use !important styles, defaults to true.
     */
    importantStyles?: boolean
    /**
     * en-us | zh-cn
     */
    currentLocale?: string
}

const defaultSupportedChains = {
    '2403d6f602a87977f898aa3c62c79a760f458745904a15b3cd63a106f62adc16':
        'https://expnode.amaxscan.io',
    '208dacab3cd2e181c86841613cf05d9c60786c677e4ce86b266d0a58884968f7':
        'https://test-chain.ambt.art',
}

interface DialogArgs {
    title: string | HTMLElement
    subtitle: string | HTMLElement
    type?: string
    content?: HTMLElement
    action?: {text: string; callback: () => void}
    footnote?: string | HTMLElement
}

class Storage implements LinkStorage {
    constructor(readonly keyPrefix: string) {}
    async write(key: string, data: string): Promise<void> {
        localStorage.setItem(this.storageKey(key), data)
    }
    async read(key: string): Promise<string | null> {
        return localStorage.getItem(this.storageKey(key))
    }
    async remove(key: string): Promise<void> {
        localStorage.removeItem(this.storageKey(key))
    }
    storageKey(key: string) {
        return `${this.keyPrefix}-${key}`
    }
}

export default class BrowserTransport implements LinkTransport {
    /** Package version. */
    static version = '__ver' // replaced by build script

    storage: LinkStorage

    constructor(public readonly options: BrowserTransportOptions = {}) {
        this.classPrefix = options.classPrefix || 'aplink-link'
        this.injectStyles = !(options.injectStyles === false)
        this.importantStyles = !(options.importantStyles === false)
        this.requestStatus = !(options.requestStatus === false)
        this.fuelEnabled = false // options.disableGreymassFuel !== true
        this.fuelReferrer = options.fuelReferrer || 'teamgreymass'
        this.storage = new Storage(options.storagePrefix || 'aplink-link')
        this.supportedChains = options.supportedChains || defaultSupportedChains
        this.showingManual = false
        this.intl = new Intl(options.currentLocale || 'en-us')
    }

    private classPrefix: string
    private injectStyles: boolean
    private importantStyles: boolean
    private requestStatus: boolean
    private fuelEnabled: boolean
    private fuelReferrer: string
    private supportedChains: Record<string, string>
    private activeRequest?: SigningRequest
    private activeCancel?: (reason: string | Error) => void
    private containerEl!: HTMLElement
    private requestEl!: HTMLElement
    private styleEl?: HTMLStyleElement
    private countdownTimer?: NodeJS.Timeout
    private closeTimer?: NodeJS.Timeout
    private prepareStatusEl?: HTMLElement
    private showingManual: boolean
    private intl: Intl

    private closeModal() {
        this.hide()
        if (this.activeCancel) {
            this.activeRequest = undefined
            this.activeCancel(this.intl.get('modalClosed'))
            this.activeCancel = undefined
        }
    }

    private setupElements() {
        this.showingManual = false
        if (this.injectStyles && !this.styleEl) {
            this.styleEl = document.createElement('style')

            this.styleEl.type = 'text/css'
            let css = styleText.replace(/%prefix%/g, this.classPrefix)
            if (this.importantStyles) {
                css = css
                    .split('\n')
                    .map((line) => line.replace(/;$/i, ' !important;'))
                    .join('\n')
            }
            this.styleEl.appendChild(document.createTextNode(css))
            document.head.appendChild(this.styleEl)
        }
        if (!this.containerEl) {
            this.containerEl = this.createEl()
            this.containerEl.className = this.classPrefix
            this.containerEl.onclick = (event) => {
                if (event.target === this.containerEl) {
                    event.stopPropagation()
                    this.closeModal()
                }
            }
            document.body.appendChild(this.containerEl)
        }
        if (!this.requestEl) {
            const wrapper = this.createEl({class: 'inner'})
            const closeButton = this.createEl({class: 'close'})
            closeButton.onclick = (event) => {
                event.stopPropagation()
                this.closeModal()
            }
            this.requestEl = this.createEl({class: 'request'})
            wrapper.appendChild(this.requestEl)
            wrapper.appendChild(closeButton)
            const version = this.createEl({
                class: 'version',
                text: `${BrowserTransport.version} (${Link.version})`,
            })
            version.onclick = (event) => {
                event.stopPropagation()
                window.open(
                    'https://github.com/armoniax/amaxjs/tree/main/packages/anchor-link',
                    '_blank'
                )
            }
            wrapper.appendChild(version)
            this.containerEl.appendChild(wrapper)
        }
    }

    private createEl(attrs?: {[key: string]: any}): HTMLElement {
        if (!attrs) attrs = {}
        const el = document.createElement(attrs.tag || 'div')
        for (const attr of Object.keys(attrs)) {
            const value = attrs[attr]
            switch (attr) {
                case 'src':
                    el.setAttribute(attr, value)
                    break
                case 'tag':
                    break
                case 'content':
                    if (typeof value === 'string') {
                        el.appendChild(document.createTextNode(value))
                    } else {
                        el.appendChild(value)
                    }
                    break
                case 'text':
                    el.appendChild(document.createTextNode(value))
                    break
                case 'class':
                    el.className = `${this.classPrefix}-${value}`
                    break
                default:
                    el.setAttribute(attr, value)
            }
        }
        return el
    }

    private hide() {
        if (this.containerEl) {
            this.containerEl.classList.remove(`${this.classPrefix}-active`)
        }
        this.clearTimers()
    }

    private show() {
        if (this.containerEl) {
            this.containerEl.classList.add(`${this.classPrefix}-active`)
        }
    }

    private showDialog(args: DialogArgs) {
        this.setupElements()
        const infoEl = this.createEl({class: 'info'})

        const infoSubtitle = this.createEl({
            class: 'subtitle',
            tag: 'span',
            content: args.subtitle,
        })
        if (args.type !== 'login') {
            const infoTitle = this.createEl({class: 'title', tag: 'span', content: args.title})
            infoEl.appendChild(infoTitle)
        }
        infoEl.appendChild(infoSubtitle)
        const logoEl = this.createEl({class: 'logo'})
        if (args.type) {
            logoEl.classList.add(args.type)
            this.requestEl.classList.add(args.type)
        }
        emptyElement(this.requestEl)
        this.requestEl.appendChild(logoEl)
        this.requestEl.appendChild(infoEl)
        if (args.content) {
            this.requestEl.appendChild(args.content)
        }
        if (args.action) {
            const buttonEl = this.createEl({tag: 'a', class: 'button', text: args.action.text})
            buttonEl.addEventListener('click', (event) => {
                event.preventDefault()
                args.action!.callback()
            })
            this.requestEl.appendChild(buttonEl)
        }
        if (args.footnote) {
            const footnoteEl = this.createEl({class: 'footnote', content: args.footnote})
            this.requestEl.appendChild(footnoteEl)
        }
        this.show()
    }

    private async displayRequest(
        request: SigningRequest,
        title: string,
        subtitle: string,
        showFooter = true
    ) {
        const sameDeviceRequest = request.clone()
        const returnUrl = generateReturnUrl()
        sameDeviceRequest.setInfoKey('same_device', true)
        sameDeviceRequest.setInfoKey('return_path', returnUrl)

        // const sameDeviceUri = sameDeviceRequest.encode(true, false)
        const crossDeviceUri = request.encode(true, false)

        const qrEl = this.createEl({class: 'qr'})
        try {
            qrEl.innerHTML = generateQr(crossDeviceUri)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Unable to generate QR code', error)
        }

        const copyEl = this.createEl({class: 'copy'})
        const copyA = this.createEl({tag: 'a', text: this.intl.get('copyRequestLink')}) // 'Copy request link'
        const copySpan = this.createEl({tag: 'span', text: this.intl.get('linkCopied')}) // 'Link copied - Paste in APLink'
        copyEl.appendChild(copyA)
        copyEl.appendChild(copySpan)
        // qrEl.appendChild(copyEl)

        copyA.addEventListener('click', (event) => {
            event.preventDefault()
            copyToClipboard(crossDeviceUri)
            copyEl.classList.add('copied')
            setTimeout(() => {
                copyEl.classList.remove('copied')
            }, 2000)
        })

        const svg = qrEl.querySelector('svg')
        if (svg) {
            svg.addEventListener('click', (event) => {
                event.preventDefault()
                qrEl.classList.toggle('zoom')
            })
        }

        const linkEl = this.createEl({class: 'download', text: this.intl.get('haveAPLink')})
        const linkA = this.createEl({
            tag: 'a',
            class: 'button',
            href: crossDeviceUri,
            text: this.intl.get('launchAPLink'), // 'Launch APLink',
        })

        const footnoteLink = this.createEl({
            tag: 'a',
            target: '_blank',
            href: 'https://www.starnest.app',
            text: this.intl.get('downloadNow'), // 'Download now',
        })
        linkEl.appendChild(footnoteLink)

        // if (isFirefox() || isBrave()) {
        //     // this prevents firefox/brave from killing the websocket connection once the link is clicked
        //     const iframe = this.createEl({
        //         class: 'wskeepalive',
        //         src: 'about:blank',
        //         tag: 'iframe',
        //     })
        //     linkEl.appendChild(iframe)
        //     linkA.addEventListener('click', (event) => {
        //         event.preventDefault()
        //         iframe.setAttribute('src', sameDeviceUri)
        //     })
        // } else {
        //     linkA.addEventListener('click', (event) => {
        //         event.preventDefault()
        //         window.location.href = sameDeviceUri
        //     })
        // }

        const content = this.createEl({class: 'info'})
        content.appendChild(qrEl)
        content.appendChild(copyEl)
        content.appendChild(linkEl.cloneNode(true))
        content.appendChild(linkA)

        let footnote: HTMLElement | undefined
        if (showFooter) {
            footnote = linkEl
        }
        this.showDialog({
            title,
            subtitle,
            footnote,
            content,
            type: 'login',
        })
    }

    public async showLoading() {
        const status = this.createEl({
            tag: 'span',
            text: this.intl.get('preparingRequest'), // 'Preparing request...',
        })
        this.prepareStatusEl = status
        this.showDialog({
            title: this.intl.get('loading'), // 'Loading',
            subtitle: status,
            type: 'loading',
        })
    }

    // login
    public onRequest(request: SigningRequest, cancel: (reason: string | Error) => void) {
        this.clearTimers()
        this.activeRequest = request
        this.activeCancel = cancel
        const title = this.intl.get(request.isIdentity() ? 'login' : 'sign')
        const subtitle = this.intl.get('scan')
        this.displayRequest(request, title, subtitle).catch(cancel)
    }

    public onSessionRequest(
        session: LinkSession,
        request: SigningRequest,
        cancel: (reason: string | Error) => void
    ) {
        if (session.metadata.sameDevice) {
            request.setInfoKey('return_path', generateReturnUrl())
        }

        if (session.type === 'fallback') {
            this.onRequest(request, cancel)
            if (session.metadata.sameDevice) {
                // trigger directly on a fallback same-device session
                window.location.href = request.encode()
            }
            return
        }

        this.clearTimers()
        this.activeRequest = request
        this.activeCancel = cancel

        const timeout = session.metadata.timeout || 60 * 1000 * 2
        const deviceName = session.metadata.name

        let subtitle: string
        if (deviceName && deviceName.length > 0) {
            // `Please open APLink Wallet on “${deviceName}” to review and sign the transaction.`
            subtitle = this.intl.get('openAPLink')
        } else {
            // 'Please review and sign the transaction in the linked wallet.'
            subtitle = this.intl.get('review')
        }

        const title = this.createEl({tag: 'span', text: this.intl.get('sign')})
        const expires = new Date(Date.now() + timeout)
        const updateCountdown = () => {
            title.textContent = `${this.intl.get('sign')} & ${this.intl.get(
                'submit'
            )} - ${countdownFormat(expires)}`
        }
        this.countdownTimer = setInterval(updateCountdown, 200)
        updateCountdown()

        const content = this.createEl({class: 'info'})
        // const manualHr = this.createEl({tag: 'hr'})
        // const manualA = this.createEl({
        //     tag: 'a',
        //     text: this.intl.get('signManually'), // 'Sign manually or with another device',
        //     class: 'manual',
        // })
        // manualA.addEventListener('click', (event) => {
        //     event.preventDefault()
        //     const error = new SessionError('Manual', 'E_TIMEOUT', session)
        //     error[SkipToManual] = true
        //     cancel(error)
        // })
        // content.appendChild(manualHr)
        // content.appendChild(manualA)

        this.showDialog({
            title,
            subtitle,
            content,
        })

        if (session.metadata.sameDevice) {
            if (session.metadata.launchUrl) {
                window.location.href = session.metadata.launchUrl
            } else if (isAppleHandheld()) {
                window.location.href = 'anchor://link'
            }
        }
    }

    public sendSessionPayload(payload: Bytes, session: LinkSession): boolean {
        if (!session.metadata.triggerUrl || !session.metadata.sameDevice) {
            // not same device or no trigger url supported
            return false
        }
        if (payload.array.length > 700) {
            // url could be clipped by iOS
            return false
        }
        window.location.href = session.metadata.triggerUrl.replace(
            '%s',
            Base64u.encode(payload.array)
        )
        return true
    }

    private clearTimers() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer)
            this.closeTimer = undefined
        }
        if (this.countdownTimer) {
            clearTimeout(this.countdownTimer)
            this.countdownTimer = undefined
        }
    }

    private async showFee(request: SigningRequest, fee: string) {
        this.activeRequest = request
        const cancelPromise = new Promise((resolve, reject) => {
            this.activeCancel = (reason) => {
                let error: Error
                if (typeof reason === 'string') {
                    error = new Error(reason)
                } else {
                    error = reason
                }
                error[AbortPrepare] = true
                reject(error)
            }
        })

        const content = this.createEl({class: 'info'})
        const feePart1 = this.createEl({
            tag: 'span',
            text: this.intl.get('youCanTryTo'), // 'You can try to ',
        })
        const feeBypass = this.createEl({
            tag: 'a',
            text: this.intl.get('proceed'), // 'proceed without the fee',
        })
        const feePart2 = this.createEl({
            tag: 'span',
            text: this.intl.get('accept'), // ' or accept the fee shown below to pay for these costs.',
        })

        const feeDescription = this.createEl({
            class: 'subtitle',
            tag: 'span',
        })
        feeDescription.appendChild(feePart1)
        feeDescription.appendChild(feeBypass)
        feeDescription.appendChild(feePart2)
        content.appendChild(feeDescription)

        const expireEl = this.createEl({
            tag: 'span',
            class: 'subtitle',
            text: this.intl.get('offerExpires', {expires: '--:--'}), // 'Offer expires in --:--',
        })
        content.appendChild(expireEl)

        const expires = request.getRawTransaction().expiration.toDate()
        const expireTimer = setInterval(() => {
            expireEl.textContent = this.intl.get('offerExpires', {
                expires: countdownFormat(expires),
            }) // `Offer expires in ${countdownFormat(expires)}`
            if (expires.getTime() < Date.now()) {
                this.activeCancel!(this.intl.get('offerExpired'))
            }
        }, 200)

        const footnote = this.createEl({
            tag: 'span',
            text: this.intl.get('resourcesOffered'), // 'Resources offered by ',
        })
        const footnoteLink = this.createEl({
            tag: 'a',
            target: '_blank',
            href: 'https://greymass.com/en/fuel',
            text: 'Greymass Fuel',
        })
        footnote.appendChild(footnoteLink)

        const skipPromise = waitForEvent(feeBypass, 'click').then(() => {
            const error = new Error('Skipped fee')
            error[SkipFee] = true
            throw error
        })
        const confirmPromise = new Promise<void>((resolve) => {
            this.showDialog({
                title: this.intl.get('transactionFee'), // 'Transaction Fee',
                // 'Your account lacks the network resources for this transaction and it cannot be covered for free.',
                subtitle: this.intl.get('account'),
                type: 'fuel',
                content,
                action: {
                    text: this.intl.get('acceptFee', {fee}), // `Accept Fee of ${fee}`,
                    callback: resolve,
                },
                footnote,
            })
        })

        await Promise.race([confirmPromise, skipPromise, cancelPromise]).finally(() => {
            clearInterval(expireTimer)
        })
    }

    private showRecovery(request: SigningRequest, session: LinkSession) {
        request.data.info = request.data.info.filter((pair) => pair.key !== 'return_path')
        if (session.type === 'channel') {
            const channelSession = session as Partial<LinkChannelSession>
            if (channelSession.addLinkInfo) {
                channelSession.addLinkInfo(request)
            }
        }
        this.displayRequest(
            request,
            this.intl.get('manually'), // 'Sign manually',
            this.intl.get('wantToSign'), // 'Want to sign with another device or didn’t get the signing request in your wallet, scan this QR or copy request and paste in app.',
            false
        )
        this.showingManual = true
    }

    public async prepare(request: SigningRequest, session?: LinkSession) {
        this.showLoading()
        if (!this.fuelEnabled || !session || request.isIdentity()) {
            // don't attempt to cosign id request or if we don't have a session attached
            return request
        }
        if (
            typeof session.metadata.cosignerVersion === 'string' &&
            fuelVersion(session.metadata.cosignerVersion)
        ) {
            // if signer has cosigner, only attempt to cosign here if we have a newer version
            return request
        }
        try {
            const result = fuel(
                request,
                session,
                (message: string) => {
                    if (this.prepareStatusEl) {
                        this.prepareStatusEl.textContent = message
                    }
                },
                this.supportedChains,
                this.fuelReferrer
            )
            const timeout = new Promise((r) => setTimeout(r, 5000)).then(() => {
                throw new Error('API timeout after 5000ms')
            })
            const modified = await Promise.race([result, timeout])
            const fee = modified.getInfoKey('txfee')
            if (fee) {
                await this.showFee(modified, String(fee))
            }
            return modified
        } catch (error) {
            if (error[AbortPrepare]) {
                this.hide()
                throw error
            } else {
                // eslint-disable-next-line no-console
                console.info(`Skipping resource provider: ${error.message || error}`)
                if (error[SkipFee]) {
                    const modified = request.clone()
                    modified.setInfoKey('no_fee', true, 'bool')
                    return modified
                }
            }
        }
        return request
    }

    public recoverError(error: Error, request: SigningRequest) {
        if (
            request === this.activeRequest &&
            (error['code'] === 'E_DELIVERY' || error['code'] === 'E_TIMEOUT') &&
            error['session']
        ) {
            // recover from session errors by displaying a manual sign dialog
            if (this.showingManual) {
                // already showing recovery sign
                return true
            }
            const session: LinkSession = error['session']
            if (error[SkipToManual]) {
                this.showRecovery(request, session)
                return true
            }
            const deviceName = session.metadata.name

            const subtitle = this.createEl({
                tag: 'div',
                content:
                    deviceName && deviceName.length > 0
                        ? this.intl.get('unableDeliver', {deviceName})
                        : this.intl.get('unableDeliverLinkWallet'),
            })
            const errorMsg = this.createEl({
                tag: 'div',
                text: error.message,
                class: 'error',
            })
            subtitle.appendChild(errorMsg)

            this.showDialog({
                title: this.intl.get('UnableReachDevice'), // 'Unable to reach device',
                subtitle,
                type: 'warning',
                action: {
                    text: this.intl.get('manually'), // 'Sign manually',
                    callback: () => {
                        this.showRecovery(request, session)
                    },
                },
            })
            return true
        }
        return false
    }

    public onSuccess(request: SigningRequest) {
        if (request === this.activeRequest) {
            this.clearTimers()
            if (this.requestStatus) {
                this.showDialog({
                    title: this.intl.get('success'),
                    subtitle: this.intl.get(
                        request.isIdentity() ? 'loginCompleted' : 'transactionSigned'
                    ),
                    type: 'success',
                })
                this.closeTimer = setTimeout(() => {
                    this.hide()
                }, 1.5 * 1000)
            } else {
                this.hide()
            }
        }
    }

    public onFailure(request: SigningRequest, error: Error) {
        if (request === this.activeRequest && error['code'] !== 'E_CANCEL') {
            this.clearTimers()
            if (this.requestStatus) {
                let errorMessage: string
                if (isInstanceOf(error, APIError)) {
                    if (error.name === 'eosio_assert_message_exception') {
                        errorMessage = error.details[0].message
                    } else if (error.details.length > 0) {
                        errorMessage = error.details.map((d) => d.message).join('\n')
                    } else {
                        errorMessage = error.message
                    }
                } else {
                    errorMessage = error.message || String(error)
                }
                this.showDialog({
                    title: this.intl.get('transactionError'), // 'Transaction Error',
                    subtitle: this.createEl({
                        tag: 'div',
                        text: errorMessage,
                        class: 'error',
                    }),
                    type: 'error',
                })
            } else {
                this.hide()
            }
        } else {
            this.hide()
        }
    }

    public userAgent() {
        return `BrowserTransport/${BrowserTransport.version} ${navigator.userAgent}`
    }
}

function waitForEvent<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    eventName: K,
    timeout?: number
): Promise<HTMLElementEventMap[K]> {
    return new Promise((resolve, reject) => {
        const listener = (event: HTMLElementEventMap[K]) => {
            element.removeEventListener(eventName, listener)
            resolve(event)
        }
        element.addEventListener(eventName, listener)
        if (timeout) {
            setTimeout(() => {
                element.removeEventListener(eventName, listener)
                reject(new Error(`Timed out waiting for ${eventName}`))
            }, timeout)
        }
    })
}

function countdownFormat(date: Date) {
    const timeLeft = date.getTime() - Date.now()
    if (timeLeft > 0) {
        return new Date(timeLeft).toISOString().substr(14, 5)
    }
    return '00:00'
}

function emptyElement(el: HTMLElement) {
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }
}

/** Generate a return url that Anchor will redirect back to w/o reload. */
function generateReturnUrl() {
    if (isChromeiOS()) {
        // google chrome on iOS will always open new tab so we just ask it to open again as a workaround
        return 'googlechrome://'
    }
    if (isFirefoxiOS()) {
        // same for firefox
        return 'firefox:://'
    }
    if (isAppleHandheld() && isBrave()) {
        // and brave ios
        return 'brave://'
    }
    if (isAppleHandheld()) {
        // return url with unique fragment required for iOS safari to trigger the return url
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let rv = window.location.href.split('#')[0] + '#'
        for (let i = 0; i < 8; i++) {
            rv += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        }
        return rv
    }

    if (isAndroid() && isFirefox()) {
        return 'android-intent://org.mozilla.firefox'
    }

    if (isAndroid() && isEdge()) {
        return 'android-intent://com.microsoft.emmx'
    }

    if (isAndroid() && isOpera()) {
        return 'android-intent://com.opera.browser'
    }

    if (isAndroid() && isBrave()) {
        return 'android-intent://com.brave.browser'
    }

    if (isAndroid() && isAndroidWebView()) {
        return 'android-intent://webview'
    }

    if (isAndroid() && isChromeMobile()) {
        return 'android-intent://com.android.chrome'
    }

    return window.location.href
}

function isAppleHandheld() {
    return /iP(ad|od|hone)/i.test(navigator.userAgent)
}

function isChromeiOS() {
    return /CriOS/.test(navigator.userAgent)
}

function isChromeMobile() {
    return /Chrome\/[.0-9]* Mobile/i.test(navigator.userAgent)
}

function isFirefox() {
    return /Firefox/i.test(navigator.userAgent)
}

function isFirefoxiOS() {
    return /FxiOS/.test(navigator.userAgent)
}

function isOpera() {
    return /OPR/.test(navigator.userAgent) || /Opera/.test(navigator.userAgent)
}

function isEdge() {
    return /Edg/.test(navigator.userAgent)
}

function isBrave() {
    return navigator['brave'] && typeof navigator['brave'].isBrave === 'function'
}

function isAndroid() {
    return /Android/.test(navigator.userAgent)
}

function isAndroidWebView() {
    return /wv/.test(navigator.userAgent) || /Android.*AppleWebKit/.test(navigator.userAgent)
}

function copyToClipboard(text: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
    } else {
        const el = document.createElement('textarea')
        try {
            el.setAttribute('contentEditable', '')
            el.value = text
            document.body.appendChild(el)
            el.select()
            const range = document.createRange()
            range.selectNodeContents(el)
            const sel = window.getSelection()
            sel!.removeAllRanges()
            sel!.addRange(range)
            el.setSelectionRange(0, el.value.length)
            document.execCommand('copy')
        } finally {
            document.body.removeChild(el)
        }
    }
}
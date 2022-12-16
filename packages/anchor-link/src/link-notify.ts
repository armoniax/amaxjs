import {Serializer} from '@greymass/eosio'
import WebSocket from 'isomorphic-ws'
import {LinkChannelSession} from './index-module'

import {fetch, logWarn} from './utils'

export const msgType = {
    app2web: 'APPREMOVESESSION',
    web2app: 'REMOVESESSION',
}

export class Notify {
    private socket: WebSocket | undefined
    private session: LinkChannelSession

    constructor(session: LinkChannelSession) {
        this.session = session
    }

    connect(onAppRemoveSession?) {
        const {channelUrl, channelKey} = this.session
        const url = new URL(channelUrl)
        const socket = new WebSocket(`wss://${url.host}/${channelKey.toLegacyString('AM')}`)
        const buf2hex = (buffer) =>
            Array.prototype.map
                .call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
                .join('')

        const handleResponse = (response: any) => {
            const msg = Serializer.decode({
                data: buf2hex(response),
                type: 'string',
            })

            if (msg === msgType.app2web) {
                if (onAppRemoveSession) {
                    onAppRemoveSession()
                }
            }
        }
        socket.onmessage = (event) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close()
            }
            if (typeof Blob !== 'undefined' && event.data instanceof Blob) {
                const reader = new FileReader()
                reader.onload = () => {
                    handleResponse(reader.result as string)
                }
                reader.onerror = (error) => {}
                reader.readAsArrayBuffer(event.data)
            } else {
                if (typeof event.data === 'string') {
                    handleResponse(event.data)
                } else {
                    handleResponse(event.data.toString())
                }
            }
        }

        this.socket = socket
    }

    async send(msg = msgType.web2app) {
        if (this.session) {
            const {channelUrl, channelKey} = this.session
            const url = new URL(channelUrl || '')
            const payload = Serializer.encode({
                object: msg,
            })

            try {
                const response = await fetch(
                    `https://${url.host}/${channelKey.toLegacyString('AM')}`,
                    {
                        method: 'POST',
                        headers: {
                            'X-Buoy-Soft-Wait': '10',
                        },
                        body: payload.array,
                    }
                )
                if (Math.floor(response.status / 100) !== 2) {
                    if (response.status === 202) {
                        logWarn('Missing delivery ack from session channel')
                    }
                }
            } catch (error) {
                logWarn(error.message)
            }
        }
    }
}

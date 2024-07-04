import type { Account, Action } from '@amax/abstract-adapter';
import {
    Adapter,
    AdapterState,
    WalletReadyState,
    WalletDisconnectedError,
    WalletSignMessageError,
    LocalStorageKey,
    WalletNotFoundError,
    isSelectedAdapter,
    WalletSignTransactionError,
} from '@amax/abstract-adapter';
import type { UnisatAdapterConfig } from './utils.js';
import { unisatIcon, unisatUrl, unisatAdapterName, openUnisatWallet, supportUnisatWallet } from './utils.js';
import {
    generateAmaxKeyPairs,
    getBtcPublickey,
    getL2amcOwnerByBtcPubkey,
    l2amcActive,
    serializePublicKey,
    signMessage,
    transact,
} from './unisat.js';

export class UnisatAdapter extends Adapter {
    name = unisatAdapterName;
    url = unisatUrl;
    icon = unisatIcon;

    config: Required<UnisatAdapterConfig>;
    _readyState: WalletReadyState = WalletReadyState.Found;
    _state: AdapterState = AdapterState.Loading;
    _account: Account | null = null;
    _connecting = false;
    _wallet: any;
    _amaxKeyPair?: AmaxKeyPair;

    get readyState() {
        return this._readyState;
    }
    get state() {
        return this._state;
    }
    get account() {
        return this._account;
    }
    get connecting() {
        return this._connecting;
    }
    get wallet() {
        return this._wallet;
    }

    get isSelected() {
        return isSelectedAdapter(unisatAdapterName, this.config.walletProviderLocalStorageKey);
    }

    constructor(config?: UnisatAdapterConfig) {
        super();
        this.config = Object.assign(
            {
                rpc: 'https://expnode.amaxscan.io',
                walletProviderLocalStorageKey: LocalStorageKey.SelectedAdapterName,
                btcOwnerContract: 'btc.owner',
                btcProxy: 'amaxup.proxy',
                checkTimeout: 2 * 1000,
            },
            config
        );

        if (supportUnisatWallet()) {
            this._wallet = window.unisat;

            if (this.isSelected) {
                this.connect();
            }
        } else {
            this._checkWallet().then((isSupport: boolean) => {
                if (isSupport) {
                    this._wallet = window.unisat;
                    if (this.isSelected && this._state !== AdapterState.Connected) {
                        this.connect();
                    }
                } else {
                    if (openUnisatWallet()) {
                        throw new WalletNotFoundError();
                    }
                }
            });
        }
    }

    async connect(): Promise<void> {
        this._checkWallet();
        if (this.connecting) return;
        this._connecting = true;
        try {
            const btcPublickey = await getBtcPublickey();
            this._amaxKeyPair = generateAmaxKeyPairs();
            const l2amcOwnerItem = await getL2amcOwnerByBtcPubkey(this.config);
            if (!l2amcOwnerItem) {
                throw new Error('Please activate your account at https://amaxup.xyz');
            }
            const accountName = l2amcOwnerItem?.account.slice(0, -4);
            await l2amcActive({
                account: accountName,
                btcPubKey: btcPublickey,
                signature: await signMessage(serializePublicKey(this._amaxKeyPair.publicKey)),
                amcPubKey: this._amaxKeyPair.publicKey,
            });
            this._account = {
                actor: l2amcOwnerItem.account,
                permission: 'submitperm',
                publicKey: this._amaxKeyPair.publicKey,
            };
            this._state = AdapterState.Connected;
            this.emit('connect', this._account as any);
        } catch (e) {
            console.error(e);
        } finally {
            this._connecting = false;
        }
    }
    async signMessage(message: string): Promise<any> {
        this.checkAndGetWallet();
        try {
            return signMessage(message);
        } catch (error: any) {
            throw new WalletSignMessageError(error.message, error);
        }
    }
    async transact(actions: Action[]): Promise<any> {
        this.checkAndGetWallet();
        try {
            if (!this._amaxKeyPair || !this._account) {
                throw new Error('Amax KeyPair not found');
            }
            return transact(actions, this._amaxKeyPair, this._account, this.config);
        } catch (error: any) {
            throw new WalletSignTransactionError(error.message, error);
        }
    }
    async disconnect(): Promise<void> {
        if (this._state !== AdapterState.Connected) {
            return;
        }
        this._state = AdapterState.Disconnect;
        this._account = null;
    }

    private checkAndGetWallet(): any {
        if (this._state !== AdapterState.Connected) throw new WalletDisconnectedError();
        const wallet = this._wallet;
        if (!wallet) throw new WalletDisconnectedError();
        return wallet;
    }

    private _checkPromise: Promise<boolean> | null = null;

    private _checkWallet(): Promise<boolean> {
        if (this.readyState === WalletReadyState.Found) {
            return Promise.resolve(true);
        }
        if (this._checkPromise) {
            return this._checkPromise;
        }
        const interval = 100;
        const maxTimes = Math.floor(this.config.checkTimeout / interval);
        let times = 0,
            timer: ReturnType<typeof setInterval>;
        this._checkPromise = new Promise((resolve) => {
            const check = () => {
                times++;
                const isSupport = supportUnisatWallet();
                if (isSupport || times > maxTimes) {
                    timer && clearInterval(timer);
                    this._readyState = isSupport ? WalletReadyState.Found : WalletReadyState.NotFound;
                    this.emit('readyStateChanged', this.readyState);
                    resolve(isSupport);
                }
            };
            timer = setInterval(check, interval);
            check();
        });
        return this._checkPromise;
    }
}

import type { Account, Action, AdapterName } from '@amax/abstract-adapter';
import {
    Adapter,
    AdapterState,
    WalletReadyState,
    isInBrowser,
    WalletNotFoundError,
    WalletDisconnectedError,
    WalletSignMessageError,
    LocalStorageKey,
    isSelectedAdapter,
} from '@amax/abstract-adapter';
import {
    armadilloAdapterName,
    armadilloIcon,
    openArmadilloWallet,
    supportArmadilloWallet,
    armadilloUrl,
} from './utils.js';

export interface ArmadilloAdapterConfig {
    permission?: string;
    walletProviderLocalStorageKey?: string;
    checkTimeout?: number;
}

export class ArmadilloAdapter extends Adapter {
    name = armadilloAdapterName;
    url = armadilloUrl;
    icon = armadilloIcon;

    config: Required<ArmadilloAdapterConfig>;
    _readyState: WalletReadyState = supportArmadilloWallet() ? WalletReadyState.Found : WalletReadyState.NotFound;
    _state: AdapterState = AdapterState.Loading;
    _account: Account | null = null;
    _connecting = false;
    _wallet: any = null;

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
        return isSelectedAdapter(armadilloAdapterName, this.config.walletProviderLocalStorageKey);
    }

    constructor(config?: ArmadilloAdapterConfig) {
        super();
        this.config = Object.assign(
            {
                permission: 'active',
                walletProviderLocalStorageKey: LocalStorageKey.SelectedAdapterName,
                checkTimeout: 2 * 1000,
            },
            config
        );

        if (!isInBrowser()) {
            this._readyState = WalletReadyState.NotFound;
            this._state = AdapterState.NotFound;
            return;
        }
        if (supportArmadilloWallet()) {
            this._wallet = window.armadillo;
            this._listenEvent();

            if (this.isSelected) {
                this.connect();
            }
        } else {
            this._checkWallet().then((isSupport: boolean) => {
                if (isSupport) {
                    this._wallet = window.armadillo;
                    if (this.isSelected && this._state !== AdapterState.Connected) {
                        this.connect();
                    }
                } else {
                    if (openArmadilloWallet()) {
                        throw new WalletNotFoundError();
                    }
                }
            });
        }
    }

    async connect(): Promise<void> {
        this._checkWallet();
        if (this.connecting) return;
        try {
            this._connecting = true;
            this._account = await this._getAccount();
            if (this._account) {
                this._state = AdapterState.Connected;
                this.emit('connect', this._account);
            }
        } catch (e) {
            console.error(e);
        } finally {
            this._connecting = false;
        }
    }
    async signMessage(message: string): Promise<string> {
        const wallet = this.checkAndGetWallet();
        try {
            return wallet.signMessage(message);
        } catch (error: any) {
            throw new WalletSignMessageError(error.message, error);
        }
    }
    async transact(actions: Action[]): Promise<any> {
        const wallet = this.checkAndGetWallet();
        try {
            return wallet.transact({
                transaction: {
                    actions,
                },
            });
        } catch (error: any) {
            throw new WalletSignMessageError(error.message, error);
        }
    }
    async disconnect(): Promise<void> {
        if (this._state !== AdapterState.Connected) {
            return;
        }
    }

    private checkAndGetWallet(): any {
        if (this._state !== AdapterState.Connected) throw new WalletDisconnectedError();
        const wallet = this._wallet;
        if (!wallet) throw new WalletDisconnectedError();
        return wallet;
    }

    private _listenEvent() {
        document.addEventListener('armoniaxLoaded', () => {
            this._readyState = WalletReadyState.Found;
            if (this.isSelected && this._state !== AdapterState.Connected) {
                this.connect();
            }
        });
        this._wallet.on('accountsChanged', async (accounts: any) => {
            if (accounts.length) {
                const account = accounts[0];
                const preAccount = { ...this._account } as Account;
                this._account = {
                    actor: account.account,
                    permission: this.config.permission || 'active',
                    publicKey: account.publicKey,
                };
                this.emit('accountsChanged', this._account, preAccount);
            } else {
                this.disconnect();
            }
        });
    }

    private async _getAccount(): Promise<Account | null> {
        const accounts = await window.armadillo.getAccounts();
        if (accounts && accounts.length) {
            return {
                actor: accounts[0].account,
                permission: this.config.permission || 'active',
                publicKey: accounts[0].publicKey,
            };
        }
        return null;
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
                const isSupport = supportArmadilloWallet();
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

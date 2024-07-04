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
} from '@amax/abstract-adapter';
import { metaMaskIcon, metaMaskUrl, metaMaskAdapterName, openMetaMaskWallet, supportMetaMaskWallet } from './utils.js';

import { connectSnap, getPublickey, getRPC, getSnap, snapSignMessage, snapTransact } from './snap.js';

export interface MetaMaskAdapterConfig {
    rpc?: string;
    walletProviderLocalStorageKey?: string;
}

export class MetaMaskAdapter extends Adapter {
    name = metaMaskAdapterName;
    url = metaMaskUrl;
    icon = metaMaskIcon;

    config: Required<MetaMaskAdapterConfig>;
    _readyState: WalletReadyState = WalletReadyState.Found;
    _state: AdapterState = AdapterState.Loading;
    _account: Account | null = null;
    _connecting = false;
    _wallet: any;

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
        return isSelectedAdapter(metaMaskAdapterName, this.config.walletProviderLocalStorageKey);
    }

    constructor(config?: MetaMaskAdapterConfig) {
        super();
        this.config = Object.assign(
            {
                rpc: 'https://expnode.amaxscan.io',
                walletProviderLocalStorageKey: LocalStorageKey.SelectedAdapterName,
            },
            config
        );

        if (supportMetaMaskWallet()) {
            this._wallet = window.ethereum;

            // if (this.isSelected) {
            //     this.connect();
            // }
        }
    }

    async connect(): Promise<void> {
        this._checkWallet();
        if (this.connecting) return;
        this._connecting = true;
        try {
            await connectSnap();
            await getSnap();
            const publickey = await getPublickey();
            const rpc = getRPC(this.config.rpc);
            const { accounts } = await rpc.get_accounts_by_authorizers([], [publickey]);
            const account = accounts[0];
            if (account) {
                this._account = {
                    actor: account.account_name,
                    permission: account.permission_name || 'active',
                    publicKey: publickey,
                };
                this._state = AdapterState.Connected;
                this.emit('connect', this._account as any);
            }
        } catch (e) {
            console.error(e);
        } finally {
            this._connecting = false;
        }
    }
    async signMessage(message: string): Promise<string> {
        this.checkAndGetWallet();
        try {
            return snapSignMessage(message);
        } catch (error: any) {
            throw new WalletSignMessageError(error.message, error);
        }
    }
    async transact(actions: Action[]): Promise<any> {
        this.checkAndGetWallet();
        try {
            return snapTransact(actions, this.config.rpc);
        } catch (error: any) {
            throw new WalletSignMessageError(error.message, error);
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

    private _checkWallet(): any {
        if (openMetaMaskWallet()) {
            throw new WalletNotFoundError();
        }
    }
}

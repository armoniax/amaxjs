import type { Account, Action } from '@amax/abstract-adapter';
import {
    Adapter,
    AdapterState,
    WalletReadyState,
    WalletDisconnectedError,
    WalletSignMessageError,
    LocalStorageKey,
    isSelectedAdapter,
} from '@amax/abstract-adapter';
import { aplinkAdapterName, aplinkIcon, aplinkUrl, verifyProof } from './utils.js';

import AnchorLink, { APIClient } from '@amax/anchor-link';
import AnchorLinkBrowserTransport from '@amax/anchor-link-browser-transport';

export interface AplinkAdapterConfig {
    rpc?: string;
    ws?: string;
    scope?: string;
    lang?: string;
    walletProviderLocalStorageKey?: string;
}

export class AplinkAdapter extends Adapter {
    name = aplinkAdapterName;
    url = aplinkUrl;
    icon = aplinkIcon;

    config: Required<AplinkAdapterConfig>;
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
        return isSelectedAdapter(aplinkAdapterName, this.config.walletProviderLocalStorageKey);
    }

    constructor(config?: AplinkAdapterConfig) {
        super();
        this.config = Object.assign(
            {
                rpc: 'https://expnode.amaxscan.io',
                ws: 'https://fwd.aplink.app',
                scope: 'AplinkAdapter',
                lang: 'zh-cn',
                walletProviderLocalStorageKey: LocalStorageKey.SelectedAdapterName,
            },
            config
        );
    }

    async connect(): Promise<void> {
        if (this.connecting) return;
        this._connecting = true;
        try {
            const link = await this.getLink();
            const identity = await link.login(this.config.scope);
            const { account, proof } = await verifyProof(link, identity);
            if (account) {
                this._account = {
                    actor: proof.signer.actor.toString(),
                    permission: proof.signer.permission.toString() || 'active',
                    publicKey: proof.recover().toLegacyString(),
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
        this._state = AdapterState.Disconnect;
        this._account = null;
    }

    private checkAndGetWallet(): any {
        if (this._state !== AdapterState.Connected) throw new WalletDisconnectedError();
        const wallet = this._wallet;
        if (!wallet) throw new WalletDisconnectedError();
        return wallet;
    }
    private async getLink(): Promise<AnchorLink> {
        const transport = new AnchorLinkBrowserTransport({
            currentLocale: this.config.lang,
        });
        const api = new APIClient({ url: this.config.rpc });
        const info = await api.v1.chain.get_info();
        const link = new AnchorLink({
            transport,
            service: this.config.ws,
            chains: [
                {
                    chainId: info.chain_id.toString(),
                    nodeUrl: this.config.rpc,
                },
            ],
        });

        link.restoreSession(this.config.scope).then((session) => {
            console.log('session', session);
        });
        return link;
    }
}

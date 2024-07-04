import type { Account, Adapter, AdapterName, AdapterState } from '@amax/abstract-adapter';
import type { ComputedRef, Ref } from 'vue';
import { computed, inject, readonly, ref } from 'vue';

export interface Wallet {
    adapter: Adapter;
    state: AdapterState;
}
export interface WalletContextState {
    disableAutoConnectOnLoad: ComputedRef<boolean>;
    autoConnect: ComputedRef<boolean>;
    wallets: Readonly<Ref<Wallet[]>>;
    wallet: ComputedRef<Wallet | null>;
    account: ComputedRef<Account | null>;
    connecting: Readonly<Ref<boolean>>;
    connected: ComputedRef<boolean>;
    disconnecting: Readonly<Ref<boolean>>;

    select(adapterName: AdapterName): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    transact: Adapter['transact'];
    signMessage: Adapter['signMessage'];
}
function printError() {
    console.error(`
You are using WalletContext without provide the WalletContext.
Please wrap your sub-components with a WalletProvider and provide required values.
`);
}
const DEFAULT_CONTEXT = {
    disableAutoConnectOnLoad: computed(() => false),
    autoConnect: computed(() => false),
    wallets: readonly(ref<Wallet[]>([])) as any,
    wallet: computed(() => null as unknown as Wallet),
    account: computed(() => null),
    connecting: readonly(ref(false)),
    connected: computed(() => false),
    disconnecting: readonly(ref(false)),
    /* eslint-disable */
    select(_name: AdapterName) {
        printError();
    },
    connect() {
        printError();
        return Promise.reject();
    },
    disconnect() {
        printError();
        return Promise.reject();
    },
    transact(_transaction: any[]) {
        printError();
        return Promise.reject();
    },
    signMessage(_message: string) {
        printError();
        return Promise.reject();
    },
    /* eslint-enable */
} as WalletContextState;

export function useWallet(): Readonly<WalletContextState> {
    const TronWalletContext = inject('TronWalletContext', DEFAULT_CONTEXT);
    return TronWalletContext;
}

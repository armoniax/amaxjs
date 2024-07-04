/* eslint-disable react-hooks/rules-of-hooks */
import { WalletNotSelectedError } from '@amax/abstract-adapter';
import type { Adapter, AdapterName, WalletError, WalletReadyState, Action, Account } from '@amax/abstract-adapter';
import { computed, defineComponent, markRaw, provide, reactive, readonly, ref, shallowReadonly, watch } from 'vue';
import type { Ref, PropType, UnwrapRef } from 'vue';
import { useLocalStorage } from './useLocalStorage.js';
import type { Wallet } from './useWallet.js';

export interface WalletProviderProps {
    adapters?: Adapter[];
    localStorageKey?: string;
    autoConnect?: boolean;
    disableAutoConnectOnLoad?: boolean;
}

interface State {
    wallet: Wallet | null;
    account: Account | null;
    connected: boolean;
    adapter?: Adapter;
}
const initialState: State = {
    wallet: null,
    account: null,
    connected: false,
    adapter: undefined,
};
function useRef<T>(initialValue: T | (() => T)): [Ref<T>, (v: T) => void] {
    const v = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    const state = ref<T>(v);
    const setState = (v: T) => {
        state.value = v as UnwrapRef<T>;
    };
    return [state as Ref<T>, setState];
}

export const WalletProvider = defineComponent({
    props: {
        adapters: {
            type: Array as PropType<Adapter[]>,
            default: () => [],
        },
        localStorageKey: {
            type: String,
            default: 'tronAdapterName',
        },
        autoConnect: {
            type: Boolean,
            default: true,
        },
        disableAutoConnectOnLoad: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['error', 'connect', 'disconnect', 'accountsChanged', 'readyStateChanged', 'chainChanged', 'adapterChanged'],
    setup(props, { emit, slots }) {
        const localStorageKey = computed(() => props.localStorageKey);
        const [name, setName] = useLocalStorage<AdapterName | null>(localStorageKey, null);
        const state = reactive({ ...initialState });
        const setState = (v: Partial<State>) => {
            Object.assign(state, v);
        };

        const [connecting, setConnecting] = useRef<boolean>(() => false);
        const [disconnecting, setDisconnecting] = useRef(false);
        let isConnecting = false;
        let isDisconnecting = false;

        const [wallets, setWallets] = useRef(
            props.adapters.map((adapter) => ({
                adapter,
                state: adapter.state,
            }))
        );

        function handleStateChange(this: Adapter) {
            const index = props.adapters.findIndex((adapter) => adapter === this);
            if (index === -1) {
                return;
            }
            setWallets(
                props.adapters.map((adapter) => ({
                    adapter,
                    state: adapter.state,
                }))
            );
        }

        watch(
            () => props.adapters,
            (adapters, preAdapters) => {
                preAdapters?.forEach((adapter) => adapter.off('stateChanged', handleStateChange, adapter));
                adapters.forEach((adapter) => adapter.on('stateChanged', handleStateChange, adapter));
                setWallets(
                    props.adapters.map((adapter) => ({
                        adapter,
                        state: adapter.state,
                    }))
                );
            },
            {
                immediate: true,
            }
        );

        watch(
            name,
            (name) => {
                const adapter = name && props.adapters.find((adapter) => adapter.name === name);
                if (adapter) {
                    setState({
                        wallet: {
                            adapter,
                            state: adapter.state,
                        },
                        adapter,
                        connected: adapter.connected,
                        account: adapter.account,
                    });
                } else {
                    setState(initialState);
                }
            },
            {
                immediate: true,
            }
        );

        const handleConnect = (account: Account) => {
            if (!state.adapter) {
                return setName(null);
            }
            setState({ connected: state.adapter.connected, account: state.adapter.account });
            emit('connect', account);
        };
        const handleError = (error: WalletError) => {
            emit('error', error);
            return error;
        };
        const handleAccountChange = (account: Account | null, preAccount: Account | null) => {
            setState({ account });
            emit('accountsChanged', account, preAccount);
        };
        const handleDisconnect = () => {
            emit('disconnect');
        };
        const handleReadyStateChanged = (readyState: WalletReadyState) => {
            emit('readyStateChanged', readyState);
        };
        const handleChainChanged = (chainData: unknown) => {
            emit('chainChanged', chainData);
        };

        watch(
            () => state.adapter,
            (adapter, preAdapter) => {
                if (preAdapter) {
                    preAdapter.off('connect', handleConnect);
                    preAdapter.off('error', handleError);
                    preAdapter.off('accountsChanged', handleAccountChange);
                    preAdapter.off('chainChanged', handleChainChanged);
                    preAdapter.off('readyStateChanged', handleReadyStateChanged);
                    preAdapter.off('disconnect', handleDisconnect);
                    preAdapter.disconnect();
                }
                if (adapter) {
                    adapter.on('connect', handleConnect);
                    adapter.on('error', handleError);
                    adapter.on('accountsChanged', handleAccountChange);
                    adapter.on('chainChanged', handleChainChanged);
                    adapter.on('readyStateChanged', handleReadyStateChanged);
                    adapter.on('disconnect', handleDisconnect);
                }
                if (adapter !== preAdapter) {
                    emit('adapterChanged', adapter);
                }
            },
            {
                immediate: true,
            }
        );

        const hasManuallySetName = ref(false);
        watch(
            [() => props.autoConnect, () => props.disableAutoConnectOnLoad, () => state.adapter],
            () => {
                const canAutoConnect =
                    props.autoConnect && (!props.disableAutoConnectOnLoad || hasManuallySetName.value);
                if (isConnecting || !canAutoConnect || !state.adapter) {
                    return;
                }
                (async function connect() {
                    isConnecting = true;
                    setConnecting(true);
                    try {
                        await state.adapter?.connect();
                    } catch (error) {
                        // setName(null);
                    } finally {
                        setConnecting(false);
                        isConnecting = false;
                    }
                })();
            },
            {
                immediate: true,
            }
        );
        watch(wallets, (wallets) => {
            const wallet = wallets.find((item) => item.adapter.name === name.value);
            if (wallet) {
                const { adapter } = wallet;
                setState({
                    wallet: {
                        adapter: adapter,
                        state: adapter.state,
                    },
                    connected: adapter.connected,
                    account: adapter.account,
                    adapter: adapter,
                });
            }
        });

        const select = markRaw((name: AdapterName) => {
            hasManuallySetName.value = true;
            setName(name);
            setConnecting(false);
            setDisconnecting(false);
            isConnecting = false;
            isDisconnecting = false;
        });
        const connect = markRaw(async () => {
            if (isConnecting || isDisconnecting || state.connected) {
                return;
            }
            if (!state.adapter) throw handleError(new WalletNotSelectedError());
            isConnecting = true;
            setConnecting(true);
            try {
                await state.adapter.connect();
            } catch (error: unknown) {
                setName(null);
                throw error;
            } finally {
                setConnecting(false);
                isConnecting = false;
            }
        });

        const disconnect = markRaw(async () => {
            if (disconnecting.value) {
                return;
            }
            if (!state.adapter) {
                return setName(null);
            }
            isDisconnecting = true;
            setDisconnecting(true);
            try {
                await state.adapter.disconnect();
            } finally {
                setName(null);
                setDisconnecting(false);
                isDisconnecting = false;
            }
        });

        const transact = markRaw(async (actions: Action[]) => {
            if (!state.adapter) throw handleError(new WalletNotSelectedError());
            return await state.adapter.transact(actions);
        });

        const signMessage = markRaw(async (message: string) => {
            if (!state.adapter) throw handleError(new WalletNotSelectedError());
            return await state.adapter.signMessage(message);
        });

        const disableAutoConnectOnLoad = computed(() => props.disableAutoConnectOnLoad);
        const autoConnect = computed(() => props.autoConnect);
        const wallet = computed(() => state.wallet);
        const provided = shallowReadonly({
            disableAutoConnectOnLoad,
            autoConnect,
            wallets: readonly(wallets),
            wallet,
            account: computed(() => state.account),
            connecting: readonly(connecting),
            connected: computed(() => state.connected),
            disconnecting: readonly(disconnecting),

            select,
            connect,
            disconnect,
            transact,
            signMessage,
        });
        provide('TronWalletContext', provided);

        return () => (slots.default ? slots.default() : '');
    },
});

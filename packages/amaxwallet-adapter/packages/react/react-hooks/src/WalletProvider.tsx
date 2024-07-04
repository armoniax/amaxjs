import { WalletNotSelectedError, AdapterState } from '@amax/abstract-adapter';
import type { Adapter, WalletError, AdapterName, WalletReadyState, Action, Account } from '@amax/abstract-adapter';
import type { FC, ReactNode } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Wallet } from './useWallet.js';
import { WalletContext } from './useWallet.js';
import { useLocalStorage } from './useLocalStorage.js';
import { LocalStorageKey } from '@amax/abstract-adapter';

export interface WalletProviderProps {
    children: ReactNode;
    adapters?: Adapter[];
    onError?: (error: WalletError) => void;
    onConnect?: (account: Account) => unknown;
    onDisconnect?: () => unknown;
    onAccountsChanged?: (account: Account, preAccount?: Account) => unknown;
    onReadyStateChanged?: (state: WalletReadyState) => unknown;
    onChainChanged?: (chainData: unknown) => unknown;
    onAdapterChanged?: (adapter: Adapter | null) => unknown;
    localStorageKey?: string;
    autoConnect?: boolean;
    disableAutoConnectOnLoad?: boolean;
}

const initialState: {
    wallet: Wallet | null;
    account: Account | null;
    connected: boolean;
    adapter: Adapter | null;
} = {
    wallet: null,
    account: null,
    connected: false,
    adapter: null,
};

export const WalletProvider: FC<WalletProviderProps> = function ({
    children,
    adapters: adaptersPro = null,
    onError = (error) => console.error(error),
    onReadyStateChanged,
    onConnect,
    onDisconnect,
    onAccountsChanged,
    onChainChanged,
    onAdapterChanged,
    localStorageKey = LocalStorageKey.SelectedAdapterName,
    autoConnect = true,
    disableAutoConnectOnLoad = false,
}) {
    const [name, setName] = useLocalStorage<AdapterName | null>(localStorageKey, null);
    const [{ wallet, connected, account, adapter }, setState] = useState(initialState);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const isConnecting = useRef(false);
    const isDisconnecting = useRef(false);

    // set default supported adapters
    const adapters = useMemo(() => {
        if (adaptersPro === null) {
            return []; // new TronLinkAdapter()
        }
        return adaptersPro;
    }, [adaptersPro]);
    const [wallets, setWallets] = useState<Wallet[]>(() =>
        adapters.map((adapter) => ({
            adapter,
            state: adapter.state,
        }))
    );
    useEffect(
        function () {
            setWallets((prevWallets) =>
                adapters.map((adapter, index) => {
                    const wallet = prevWallets[index];
                    if (wallet && wallet.adapter === adapter && wallet.state === adapter.state) {
                        return wallet;
                    }
                    return {
                        adapter,
                        state: adapter.state,
                    };
                })
            );

            function handleStateChange(this: Adapter) {
                setWallets((prevWallets) => {
                    const index = prevWallets.findIndex((wallet) => wallet.adapter === this);
                    if (index === -1) {
                        return prevWallets;
                    }
                    return prevWallets.map((wallet, idx) => {
                        if (idx === index) {
                            return {
                                ...wallet,
                                state: wallet.adapter.state,
                            };
                        }
                        return wallet;
                    });
                });
            }
            adapters.forEach((adapter) => adapter.on('stateChanged', handleStateChange, adapter));
            return () => adapters.forEach((adapter) => adapter.off('stateChanged', handleStateChange, adapter));
        },
        [adapters]
    );

    // Set state when choosen wallet changes
    useEffect(
        function () {
            const wallet = name && wallets.find((item) => item.adapter.name === name);
            if (wallet) {
                setState({
                    wallet,
                    adapter: wallet.adapter,
                    connected: wallet.adapter.connected,
                    account: wallet.adapter.account,
                });
            } else {
                setState(initialState);
            }
        },
        [name, wallets]
    );

    const preAdapter = useRef<Adapter | null>(null);
    useEffect(
        function () {
            if (adapter !== preAdapter.current) {
                onAdapterChanged?.(adapter);
                preAdapter.current = adapter;
            }
        },
        [adapter, onAdapterChanged]
    );

    const handleConnect = useCallback(
        function (account: Account) {
            if (!adapter) {
                return setName(null);
            }
            setState((state) => ({
                ...state,
                connected: adapter.connected,
                account: adapter.account,
            }));
            onConnect?.(account);
        },
        [adapter, setName, onConnect]
    );

    const handleError = useCallback(
        function (error: WalletError) {
            onError(error);
            return error;
        },
        [onError]
    );
    const handleAccountChange = useCallback(
        function (account: Account, preAccount?: Account) {
            setState((state) => ({ ...state, account }));
            onAccountsChanged?.(account, preAccount);
        },
        [onAccountsChanged]
    );
    const handleDisconnect = useCallback(
        function () {
            onDisconnect?.();
        },
        [onDisconnect]
    );
    const handleReadyStateChanged = useCallback(
        function (readyState: WalletReadyState) {
            onReadyStateChanged?.(readyState);
        },
        [onReadyStateChanged]
    );
    const handleChainChanged = useCallback(
        function (chainData: unknown) {
            onChainChanged?.(chainData);
        },
        [onChainChanged]
    );
    useEffect(
        function () {
            if (adapter) {
                adapter.on('connect', handleConnect);
                adapter.on('error', handleError);
                adapter.on('accountsChanged', handleAccountChange);
                adapter.on('chainChanged', handleChainChanged);
                adapter.on('readyStateChanged', handleReadyStateChanged);
                adapter.on('disconnect', handleDisconnect);
                return () => {
                    adapter.off('connect', handleConnect);
                    adapter.off('error', handleError);
                    adapter.off('accountsChanged', handleAccountChange);
                    adapter.off('chainChanged', handleChainChanged);
                    adapter.off('readyStateChanged', handleReadyStateChanged);
                    adapter.off('disconnect', handleDisconnect);
                };
            }
        },
        [
            adapter,
            handleConnect,
            handleError,
            handleAccountChange,
            handleChainChanged,
            handleReadyStateChanged,
            handleDisconnect,
        ]
    );
    // disconnect the previous when wallet changes
    useEffect(() => {
        return () => {
            adapter?.disconnect();
        };
    }, [adapter]);

    const hasManuallySetName = useRef(false);
    // auto connect
    useEffect(
        function () {
            const canAutoConnect = autoConnect && (!disableAutoConnectOnLoad || hasManuallySetName.current);
            if (isConnecting.current || !canAutoConnect || !adapter || adapter.state !== AdapterState.Disconnect) {
                return;
            }
            (async function connect() {
                isConnecting.current = true;
                setConnecting(true);
                try {
                    await adapter.connect();
                } catch (error) {
                    // setName(null);
                } finally {
                    setConnecting(false);
                    isConnecting.current = false;
                }
            })();
        },
        [isConnecting, autoConnect, adapter, setName, disableAutoConnectOnLoad]
    );
    const select = useCallback(
        (name: AdapterName) => {
            hasManuallySetName.current = true;
            setName(name);
        },
        [setName]
    );

    const connect = useCallback(
        async function () {
            if (isConnecting.current || isDisconnecting.current || connected) {
                return;
            }
            if (!adapter) throw handleError(new WalletNotSelectedError());
            isConnecting.current = true;
            setConnecting(true);
            try {
                await adapter.connect();
            } catch (error: unknown) {
                setName(null);
                throw error;
            } finally {
                setConnecting(false);
                isConnecting.current = false;
            }
        },
        [isConnecting, isDisconnecting, adapter, connected, handleError, setName]
    );

    const disconnect = useCallback(
        async function () {
            if (isDisconnecting.current) return;
            if (!adapter) return setName(null);

            isDisconnecting.current = true;
            setDisconnecting(true);
            try {
                await adapter.disconnect();
                setName(null);
            } catch (error: any) {
                setName(null);
                throw error;
            } finally {
                setDisconnecting(false);
                isDisconnecting.current = false;
            }
        },
        [adapter, isDisconnecting, setName]
    );

    const transact = useCallback(
        async function (actions: Action[]) {
            if (!adapter) throw handleError(new WalletNotSelectedError());
            return await adapter.transact(actions);
        },
        [adapter, handleError]
    );

    const signMessage = useCallback(
        async function (message: string) {
            if (!adapter) throw handleError(new WalletNotSelectedError());
            return await adapter.signMessage(message);
        },
        [adapter, handleError]
    );

    return (
        <WalletContext.Provider
            value={{
                disableAutoConnectOnLoad,
                autoConnect,
                wallets,
                wallet,
                account,
                connecting,
                connected,
                disconnecting,
                select,
                connect,
                disconnect,
                transact,
                signMessage,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export interface Action {
    account: string;
    name: string;
    data: any;
    authorization: Actor[];
}

export type Permission = 'owner' | 'active' | string;

export interface Actor {
    actor: string;
    permission: Permission;
}

export interface Account {
    actor: string;
    permission: Permission;
    publicKey: string;
}
/**
 * Wallet ready state.
 */
export enum WalletReadyState {
    /**
     * Adapter will start to check if wallet exists after adapter instance is created.
     */
    Loading = 'Loading',
    /**
     * When checking ends and wallet is not found, readyState will be NotFound.
     */
    NotFound = 'NotFound',
    /**
     * When checking ends and wallet is found, readyState will be Found.
     */
    Found = 'Found',
}
/**
 * Adapter state
 */
export enum AdapterState {
    /**
     * If adapter is checking the wallet, the state is Loading.
     */
    Loading = 'Loading',
    /**
     * If wallet is not installed, the state is NotFound.
     */
    NotFound = 'NotFound',
    /**
     * If wallet is installed but is not connected to current Dapp, the state is Disconnected.
     */
    Disconnect = 'Disconnected',
    /**
     * Wallet is connected to current Dapp.
     */
    Connected = 'Connected',
}

export enum LocalStorageKey {
    SelectedAdapterName = 'amaxAdapterName',
}

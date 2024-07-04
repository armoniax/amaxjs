import EventEmitter from 'eventemitter3';
import type { WalletError } from './errors.js';
import type { Account, Action, WalletReadyState } from './types.js';
import { AdapterState } from './types.js';

export { EventEmitter };

export interface AdapterEvents {
    connect(account: Account): void;
    disconnect(): void;
    error(error: WalletError): void;
    readyStateChanged(state: WalletReadyState): void;
    stateChanged(state: AdapterState): void;
    accountsChanged(account: Account, preAccount: Account): void;
    chainChanged(chainData: unknown): void;
}

export type AdapterName<T extends string = string> = T & { __brand__: 'AdapterName' };

export interface TransactResult {
    transaction_id: string;
    processed: any;
}

export interface AdapterProps<Name extends string = string> {
    name: AdapterName<Name>;
    url: string;
    icon: string;
    readyState: WalletReadyState;
    state: AdapterState;
    account: Account | null;
    connecting: boolean;
    connected: boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signMessage(message: string): Promise<string>;
    transact(actions: Action[]): Promise<TransactResult>;
}

export abstract class Adapter<Name extends string = string>
    extends EventEmitter<AdapterEvents>
    implements AdapterProps
{
    abstract name: AdapterName<Name>;
    abstract url: string;
    abstract icon: string;
    abstract readyState: WalletReadyState;
    abstract state: AdapterState;
    abstract account: Account | null;
    abstract connecting: boolean;

    get connected() {
        return this.state === AdapterState.Connected;
    }

    connect(): Promise<void> {
        console.info("The current adapter doesn't support connect by DApp.");
        return Promise.resolve();
    }
    disconnect(): Promise<void> {
        console.info("The current adapter doesn't support disconnect by DApp.");
        return Promise.resolve();
    }
    signMessage(message: string): Promise<string> {
        console.info("The current adapter doesn't support signMessage by DApp.");
        return Promise.resolve(message);
    }
    transact(_actions: Action[]): Promise<TransactResult> {
        console.info("The current adapter doesn't support transact by DApp.");
        return Promise.resolve({} as any);
    }
}

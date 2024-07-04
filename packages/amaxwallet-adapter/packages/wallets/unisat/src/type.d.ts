declare module '@amax/amaxjs-ecc';
declare module 'bitcore-lib';

declare interface AmaxKeyPair {
    mnemonic: string;
    privateKey: string;
    publicKey: string;
}

declare interface Actor {
    actor: string;
    permission: string;
}

declare interface Action {
    account: string; // 合约名称
    name: string; // 合约方法名
    data: any; // 合约参数
    authorization?: Actor[];
}

declare interface L2amcOwner {
    account: string;
    xchain_pubkey: string;
    next_nonce: number;
    amc_txid: string;
    created_at: string;
    recovered_public_key: string;
}
declare interface UnisatWalletAdapterOwnerConfig {
    rpc?: string;
    walletProviderLocalStorageKey?: string;
    btcOwnerContract?: string;
}

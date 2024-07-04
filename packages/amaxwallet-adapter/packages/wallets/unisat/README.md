# `@amax/amaxwallet-adapter-unisat`

This package provides an adapter to enable Amax DApps to connect to the  [Unisat Wallet extension](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/unisat).

## Demo

```typescript
import { UnisatAdapter } from '@amax/amaxwallet-adapter-unisat';

const adapter = new UnisatAdapter();
// connect to TokenPocket
await adapter.connect();

// then you can get account
console.log(adapter.account);

// using adapter push a transaction
const TransactResult = await adapter.transact(acions);
```

## Documentation

### API

-   `Constructor(config: UnisatAdapterConfig)`

```typescript
interface UnisatAdapterConfig {
    rpc?: string;
    walletProviderLocalStorageKey?: string;
    btcOwnerContract?: string;
    btcProxy?: string;
    checkTimeout?: number;
}
```
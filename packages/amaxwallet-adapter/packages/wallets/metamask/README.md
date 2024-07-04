# `@amax/amaxwallet-adapter-metamask`

This package provides an adapter to enable Amax DApps to connect to the  [MetaMask Wallet extension](https://metamask.io/).

## Demo

```typescript
import { MetaMaskAdapter } from '@amax/amaxwallet-adapter-metamask';

const adapter = new MetaMaskAdapter();
// connect to TokenPocket
await adapter.connect();

// then you can get account
console.log(adapter.account);

// using adapter push a transaction
const TransactResult = await adapter.transact(acions);
```

## Documentation

### API

-   `Constructor(config: MetaMaskAdapterConfig)`

```typescript
interface MetaMaskAdapterConfig {
    rpc?: string;
    walletProviderLocalStorageKey?: string;
}
```
# `@amax/amaxwallet-adapter-aplink`

This package provides an adapter to enable Amax DApps to connect to the  [APLink Wallet App](https://aplink.app/).

## Demo

```typescript
import { AplinkAdapter } from '@amax/amaxwallet-adapter-aplink';

const adapter = new AplinkAdapter();
// connect to TokenPocket
await adapter.connect();

// then you can get account
console.log(adapter.account);

// using adapter push a transaction
const TransactResult = await adapter.transact(acions);
```

## Documentation

### API

-   `Constructor(config: AplinkAdapterConfig)`

```typescript
interface AplinkAdapterConfig {
    rpc?: string;
    ws?: string;
    scope?: string;
    lang?: string;
    walletProviderLocalStorageKey?: string;
}
```
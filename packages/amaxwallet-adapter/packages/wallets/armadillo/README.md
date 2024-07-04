# `@amax/amaxwallet-adapter-armadillo`

This package provides an adapter to enable Amax DApps to connect to the  [Armadillo Wallet extension](https://chromewebstore.google.com/detail/armadillo/ahkbnfljhaifiikpkhnkeobchonbpjpb?hl=zh-CN&utm_source=ext_sidebar).

## Demo

```typescript
import { ArmadilloAdapter } from '@amax/amaxwallet-adapter-armadillo';

const adapter = new ArmadilloAdapter();
// connect to TokenPocket
await adapter.connect();

// then you can get account
console.log(adapter.account);

// using adapter push a transaction
const TransactResult = await adapter.transact(acions);
```

## Documentation

### API

-   `Constructor(config: ArmadilloAdapterConfig)`

```typescript
interface ArmadilloAdapterConfig {
    permission?: string;
    walletProviderLocalStorageKey?: string;
}
```
# amaxwallet-adapter

This repository contains wallet adapters and components for AMAX DApps. With out-of-box components and unified methods, developers can easily interact with multiple wallets, `select/connect/disconnect` wallets and sign a message or transaction.

## Wallet Integrations

### Supported

-   [Armadillo Extension](https://chromewebstore.google.com/detail/armadillo/ahkbnfljhaifiikpkhnkeobchonbpjpb?hl=zh-CN&utm_source=ext_sidebar): All versions
-   [APLink App](https://aplink.app/): All versions,  but not support `signMessage`
-   [MetaMask Snap](https://snaps.metamask.io/snap/npm/amax/amaxsnap/): All versions
-   [unisat Extension](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/unisat): All versions


## Introduction

### Adapters

Wallet adapters help you to access to AMAX wallets with consistent API.

There are many wallets supporting AMAX network such as Armadillo,  **Different wallets** and **different versions** of one wallet may have different interface to use. The aim of **Adapters** relavant pacakges is to shield these differences and offer consistent interface for DApp developers. DApps don't need to change their code frequently if they have accessed to the amax wallet dapters code.

For example if you want to connect to different wallets, you have to use different methods:

```js
// Armadillo
window.armadillo.signMessage(message);


With adapter, you can use consistent APIs for different wallets:

```js
// Armadillo
const armadilloAdapter = new ArmadilloAdapter();
await armadilloAdapter.connect();
await armadilloAdapter.signMessage(message);

```

### React Hooks

React hook is a hook to manage the global state of wallet, such as current selected wallet and the connect state, account, and so on. It also provides some methods to interact with wallet.

When your dapp supports multiple wallets, with the help of `useWallet()` hook you can easily:

-   select which wallet to use
-   connect to the selected wallet
-   disconnect to the selected wallet
-   call `signMessage` or `transact` of the selected wallet

Examples:

```jsx
function Comp() {
    const { wallet, address, connected, select, connect, disconnect, signMessage, signTransaction } = useWallet();
    return (
        <div>
            <button onClick={() => select('Armadillo')}>Select Wallet</button>
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
            <button onClick={() => signMessage('Hello World')}>Sign Message</button>
        </div>
    );
}
```

### React UI Components

`useWallet()` only contains logic to manage wallet state. Besides, we provide a set of out-of-box components to help you interact with wallets:

-   `WalletSelectButton`: Show wallets dialog to select a wallet
-   `WalletConnectButton`: Connect to the selected wallet
-   `WalletDisconnectButton`: Disconnect to the selected wallet
-   `WalletActionButton`: A Button with multiple actions include `select/connect/disconnect`



## Quick Start

Clone this repo and run the following commands:

```bash
pnpm install
pnpm build
pnpm example
```

> As the repo uses `pnpm` to manage workspace, please install `Nodejs` and `pnpm` first.
> The following is required:
>
> -   Nodejs >= 20
> -   pnpm >= 7

## Contributing

### Release

1. first update package version:

```shell
pnpm update-version
```

2. release the packages

```
pnpm release
```

## License

[MIT](https://opensource.org/licenses/MIT)

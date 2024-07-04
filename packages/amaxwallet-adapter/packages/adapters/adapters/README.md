# @amax/amaxwallet-adapters

`@amax/amaxwallet-adapters` provides multiple wallet adapters to help developers connect to Amax wallet.

## Supported wallets

As `@amax/amaxwallet-adapters` exports adapter of each wallet , you can use this package, or use the individual wallet adapter you want.

| NPM package                                                                                                          | Description                                                                  | Source Code                                                                                          |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`@amax/amaxwallet-adapters`](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/adapters)                           | Includes all the wallet adapters                                             | [View](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/adapters)      |
| [`@amax/amaxwallet-adapter-armadillo`](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/armadillo)           | adapter for [Armadillo](https://chromewebstore.google.com/detail/armadillo/ahkbnfljhaifiikpkhnkeobchonbpjpb?hl=zh-CN&utm_source=ext_sidebar)                            | [View](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/armadillo)      |
| [`@amax/amaxwallet-adapter-aplink`](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/aplink) | adapter for adapter for [APLink](https://aplink.app/home) | [View](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/aplink) |
| [`@amax/amaxwallet-adapter-metamask`](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/metamask)     | adapter for [Metamask](https://metamask.io/)                          | [View](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/metamask)   |
| [`"@amax/amaxwallet-adapter-unisat`](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/unisat)             | adapter for [UniSat](https://chromewebstore.google.com/detail/ppbibelpcjmhbdihakflkdcoccbgbkpo)                                  | [View](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/packages/adapters/wallets/unisat)       |


## Usage

> If you are working in a typescript project, you must set `skipLibCheck: true` in `tsconfig.json`.

### React

You can use `@amax/amaxwallet-adapters` in your component. Use `useMemo` to memorize the `adapter` to improve your web performance.

```tsx
import { ArmadilloAdapter } from '@amax/amaxwallet-adapters';

function App() {
    const [readyState, setReadyState] = useState(WalletReadyState.NotFound);
    const [account, setAccount] = useState('');
    const [signedMessage, setSignedMessage] = useState('');

    const adapter = useMemo(() => new ArmadilloAdapter({permission: 'owner' }), []);

    useEffect(() => {
        setReadyState(adapter.readyState);
        setAccount(adapter.account!);

        adapter.on('connect', () => {
            setAccount(adapter.account!);
        });

        adapter.on('readyStateChanged', (state) => {
            setReadyState(state);
        });

        adapter.on('accountsChanged', (data) => {
            setAccount(data);
        });

        adapter.on('disconnect', () => {
            // when disconnect from wallet
        });
        return () => {
            // remove all listeners when components is destroyed
            adapter.removeAllListeners();
        };
    }, []);

    async function sign() {
        const res = await adapter!.signMessage('helloworld');
        setSignedMessage(res);
    }

    return (
        <div className="App">
            <div>readyState: {readyState}</div>
            <div>current account: {JSON.stringify(account)}</div>
            <button disabled={adapter.connected} onClick={() => adapter.connect()}>
                Connect to Amax
            </button>
            <button onClick={sign}>sign message</button>
            <br />
            SignedMessage: {signedMessage}
        </div>
    );
}
```

A demo with cdn file can be found [here](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/demos/react-ui).


### Vue

In Vue, as the `created/mounted` hook just can be executed once, you can init the adapter in `mounted` or `created` hook.

```js
// vue2.x
export default {
    created() {
        this.adapter = new ArmadilloAdapter();
        this.adapter.on('connect', () => {
            // here you can do something
        });
    },
    beforeDestroy() {
        this.adapter.removeAllListeners();
    }
}

// vue3
export default {
    setup() {
        onMounted(function() {
            const adapter = new ArmadilloAdapter();
            adapter.on('connect', () => {
                // here you can do something
            });
        });
        onBeforeUnmount(function() {
            // remove all listeners when components is destroyed
            adapter.removeAllListeners();
        });
        return {};
    }
}
```

## API Reference

### Adapter

The `Adapter` class defines the common interface for all adapters of specified wallets.

#### Constructor

-   `constructor(config)`: adapter constructor method, an optional config is valid. For detailed config type, refer to the following adapter section.

#### Properties

-   `name`: The name of the adapter.
-   `url`: The website of the adapter's wallet.
-   `icon`: The icon of the adapter's wallet.
-   `readyState`: The wallet's state, which includes three value:
    -   `Loading`: When adapter is checking if the wallet is available or not.
    -   `NotFound`: The wallet is not detected in current browser.
    -   `Found`: The wallet is detected in current browser.
-   `account`: The account of current account when the adapter is connected.
-   `connecting`: Whether the adapter is trying to connect to the wallet.
-   `connected`: Whether the adapter is connected to the wallet.

#### Methods

-   `connect(): Promise<void>`: connect to the wallet.
-   `disconnect(): Promise<void>`: disconnect to the wallet.
-   `signMessage(message): Promise<string>`: sign a string, return the signature result.
-   `transact(actions): Promise<TransactResult>`: push a transaction.

#### Events

`Adapter` extends the `EventEmitter` class in `eventemitter3` package. So you can listen to the events by `adapter.on('connect', function() {})`.

Events are as follows:

-   `connect(address)`: Emit when adapter is connected to the wallet. The parameter is the address of current account.
-   `disconnect()`: Emit when adapter is disconnected to the wallet.
-   `readyStateChanged(state: WalletReadyState)`: Emit when wallet's readyState is changed. The parameter is the state of wallet:
    ```typescript
    enum WalletReadyState {
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
    ```
-   `accountsChanged(address: string, preAddress: string)`: Emit when users change the current selected account in wallet. The parameter is the address of new account.
-   `chainChanged(chainInfo: ChainInfo)`: Emit when users change the current selected chain in wallet. The parameter is the new network config：
    ```typescript
    interface ChainInfo {
        chainId: string;
    }
    ```
-   `error(WalletError)`: Emit when there are some errors when call the adapter's method. The [WalletError Types] is defined as follows.

### WalletError

`WalletError` is a superclass which defines the error when using adapter.
All error types are extended from this class.
Developers can check the error type according to the error instance.

```typescript
try {
    // do something here
} catch (error: WalletError) {
    if (error instanceof WalletNotFoundError) {
        console.log('Wallet is not found');
    }
}
```

All errors are as follows:

-   `WalletNotFoundError`: Occurs when wallet is not installed.
-   `WalletNotSelectedError`: Occurs when connect but there is no selected wallet.
-   `WalletDisconnectedError`: Occurs when wallet is disconnected. Used by some wallets which won't connect automatically when call `signMessage()` or `signTransaction()`.
-   `WalletConnectionError`: Occurs when try to connect a wallet.
-   `WalletDisconnectionError`: Occurs when try to disconnect a wallet.
-   `WalletSignMessageError`: Occurs when call `signMessage()`.
-   `WalletSignTransactionError`: Occurs when call `signTransaction()`.

Following exmaple shows how to get original error info with `WalletError`:

```js
const adapter = new ArmadilloAdapter();
try {
    await adapter.connect();
} catch (e: any) {
    const originalError = e.error;
}
```

<h3>ArmadilloAdapter</h3>

-   `Constructor(config: ArmadilloAdapterConfig)`
    ```typescript
    interface ArmadilloAdapterConfig {
        permission?: string;
        walletProviderLocalStorageKey?: string;
    }
    ```


-   **TronLink Doesn't support `disconnect` by DApp**. As ArmadilloAdapter doesn't support disconnect by DApp website, call `adapter.disconnect()` won't disconnect from amax extension really.
-   **Auto open TronLink app in mobile browser**. If developers call `connect()` method in mobile browser, it will open DApp in TronLink app to get amax wallet.

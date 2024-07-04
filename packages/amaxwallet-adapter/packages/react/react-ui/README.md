# @amax/amaxwallet-adapter-react-ui

`@amax/amaxwallet-adapter-react-ui` provides a set of out-of-the-box components to make it easy to select, change, connect and disconnect wallet.

`@amax/amaxwallet-adapter-react-ui` depends `@amax/amaxwallet-adapter-react-hooks` to work. So developers must wrap `App` content within the `WalletProvider`.

## Installation

```bash
npm install @amax/amaxwallet-adapter-react-ui @amax/amaxwallet-adapter-react-hooks @amax/abstract-adapter @amax/amaxwallet-adapters

# or pnpm install @amax/amaxwallet-adapter-react-ui @amax/amaxwallet-adapter-react-hooks @amax/abstract-adapter @amax/amaxwallet-adapters

# or yarn install @amax/amaxwallet-adapter-react-ui @amax/amaxwallet-adapter-react-hooks @amax/abstract-adapter @amax/amaxwallet-adapters
```

## Usage

`@amax/amaxwallet-adapter-react-ui` provide a `Select Wallet Modal` by `Context.Provider`. So developers must wrap `App` content within the `WalletProvider` and `WalletModalProvider`.

> Note: A stylesheet must be imported to make components work fine.

```jsx
import { useWallet, WalletProvider } from '@amax/amaxwallet-adapter-react-hooks';
import { WalletModalProvider, WalletActionButton } from '@amax/amaxwallet-adapter-react-ui';
// This is necessary to keep style normal.
import '@amax/amaxwallet-adapter-react-ui/style.css';
import { WalletDisconnectedError, WalletError, WalletNotFoundError } from '@amax/abstract-adapter';
import toast, { Toaster } from 'react-hot-toast';

function App() {
    // here use `react-hot-toast` npm package to notify user what happened
    function onError(e: WalletError) {
        if (e instanceof WalletNotFoundError) {
            toast.error(e.message);
        } else if (e instanceof WalletDisconnectedError) {
            toast.error(e.message);
        } else toast.error(e.message);
    }
    return (
        <WalletProvider onError={onError}>
            <WalletModalProvider>
                <ConnectComponent></ConnectComponent>
                <Profile></Profile>
            </WalletModalProvider>
        </WalletProvider>
    );
}
function ConnectComponent() {
    const { connect, disconnect, select, connected } = useWallet();
    return <WalletActionButton></WalletActionButton>;
}
function Profile() {
    const { account, connected, wallet } = useWallet();
    return (
        <div>
            <p>
                <span>Connection Status:</span> {connected ? 'Connected' : 'Disconnected'}
            </p>
            <p>
                <span>Your selected Wallet:</span> {wallet?.adapter.name}
            </p>
            <p>
                <span>Your Account:</span> {JSON.stringify(account)}
            </p>
        </div>
    );
}
```

## `WalletModalProvider` and `useWalletModal`

`WalletModalProvider` provide a `Select Wallet Modal` by `Context.Provider`. The modal can be controled by `useWalletModal`.

```jsx
function App() {
    const { visible, setVisible } = useWalletModal();
    function toggle() {
        setVisible((visible) => !visible);
    }
    return (
        <div>
            <button onClick={toggle}>{visible ? 'Close Modal' : 'Open Modal'}</button>
        </div>
    );
}
```

## `WalletConnectButton`

Button to connect to the selected wallet. The button is disabled when:

-   no wallet is selected
-   is connecting to wallet
-   is connected
-   disabled by props

### Props

```jsx
type ButtonProps = PropsWithChildren<{
    className?: string,
    disabled?: boolean,
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void,
    style?: CSSProperties,
    tabIndex?: number,
    icon?: string,
}>;
```

## `WalletDisconnectButton`

Button to connect to the selected wallet. The button is disabled when:

-   no wallet is selected
-   is connecting to wallet
-   disabled by props

### Props

Same as `WalletConnectButton`.

## `WalletSelectButton`

Button to open `Select Wallet Modal`.

### Props

Same as `WalletConnectButton`.

## `WalletActionButton`

Button with multiple functions including:

-   Select wallet
-   Connect to wallet
-   Disconnect from wallet
-   Show current selected wallet and address
-   Copy address

It's recommended to use this component to connect wallet easily.

### Props

Same as `WalletConnectButton`.

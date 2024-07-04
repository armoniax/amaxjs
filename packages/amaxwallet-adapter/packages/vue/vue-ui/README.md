# @amax/amaxwallet-adapter-vue-ui

`@amax/amaxwallet-adapter-vue-ui` provides a set of out-of-the-box components to make it easy to select, change, connect and disconnect wallet.

`@amax/amaxwallet-adapter-vue-ui` depends `@amax/amaxwallet-adapter-vue-hooks` to work. So developers must wrap `App` content within the `WalletProvider`.

## Installation

```bash
npm install @amax/amaxwallet-adapter-vue-ui @amax/amaxwallet-adapter-vue-hooks @amax/abstract-adapter @amax/amaxwallet-adapters

# or pnpm install @amax/amaxwallet-adapter-vue-ui @amax/amaxwallet-adapter-vue-hooks @amax/abstract-adapter @amax/amaxwallet-adapters

# or yarn install @amax/amaxwallet-adapter-vue-ui @amax/amaxwallet-adapter-vue-hooks @amax/abstract-adapter @amax/amaxwallet-adapters
```

## Usage

`@amax/amaxwallet-adapter-vue-ui` provide a `Select Wallet Modal` by `provide()` in Vue. So developers must wrap `App` content within the `WalletProvider` and `WalletModalProvider`.

> Note: A stylesheet must be imported to make components work fine.

Here is a [Demo project](https://github.com/armoniax/amaxjs/tree/main/packages/amaxwallet-adapter/demos/vue-ui/vite-app);

```html
<template>
    <WalletProvider @error="onError">
        <WalletModalProvider>
            <WalletActionButton></WalletActionButton>
            <Profile></Profile>
        </WalletModalProvider>
    </WalletProvider>
</template>
<script setup>
    import { h, defineComponent } from 'vue';
    import { useWallet, WalletProvider } from '@amax/amaxwallet-adapter-vue-hooks';
    import { WalletModalProvider, WalletActionButton } from '@amax/amaxwallet-adapter-vue-ui';
    // This is necessary to keep style normal.
    import '@amax/amaxwallet-adapter-vue-ui/style.css';
    import { WalletDisconnectedError, WalletError, WalletNotFoundError } from '@amax/abstract-adapter';

    function onError(e: WalletError) {
        if (e instanceof WalletNotFoundError) {
            console.error(e.message);
        } else if (e instanceof WalletDisconnectedError) {
            console.error(e.message);
        } else console.error(e.message);
    }

    const ConnectComponent = defineComponent({
        setup() {
            return () => h(WalletActionButton);
        },
    });

    const Profile = defineComponent({
        setup() {
            const { wallet } = useWallet();
            return () => h('div', `Current adapter: ${wallet?.adapter.name}`);
        },
    });
</script>
```

## `WalletModalProvider` and `useWalletModal`

`WalletModalProvider` provide a `Select Wallet Modal` by `provide()` in Vue. The modal can be controled by `useWalletModal`.

```html
<template>
    <div>
        <button @click="toggle">{{visible ? 'Close Modal' : 'Open Modal'}}</button>
    </div>
</template>
<script setup>
    const { visible, setVisible } = useWalletModal();
    function toggle() {
        setVisible((visible) => !visible);
    }
</script>
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

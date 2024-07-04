<script setup lang="ts">
import VueUiDemo from './components/VueUiDemo.vue';
import HooksDemo from './components/HooksDemo.vue';
import { WalletProvider } from '@amax/amaxwallet-adapter-vue-hooks';
import { Account, Adapter, WalletReadyState } from '@amax/abstract-adapter';
import { ArmadilloAdapter, AplinkAdapter, MetaMaskAdapter, UnisatAdapter } from '@amax/amaxwallet-adapters';
import { WalletModalProvider, WalletActionButton } from '@amax/amaxwallet-adapter-vue-ui';

const armadilloAdapter = new ArmadilloAdapter({ permission: 'owner' });
const aplinkWalletAdapter = new AplinkAdapter({ rpc: 'https://test-chain.ambt.art' });
const metaMaskWalletAdapter = new MetaMaskAdapter({ rpc: 'https://test-chain.ambt.art' });
const unisatWalletAdapter = new UnisatAdapter({
    rpc: 'https://test-chain.ambt.art',
    btcOwnerContract: 'btc.owner4',
    btcProxy: 'btc.proxy',
});

const adapters = [armadilloAdapter, aplinkWalletAdapter, metaMaskWalletAdapter, unisatWalletAdapter];

function onAdapterChanged(adapter: Adapter | null) {
    console.log('[wallet hooks] onAdapterChanged: ', adapter?.name);
}
function onReadyStateChanged(readyState: WalletReadyState) {
    console.log('[wallet hooks] onReadyStateChanged: ', readyState);
}
function onConnect(account: Account) {
    console.log('[wallet hooks] onConnect: ', account);
}
function onDisconnect() {
    console.log('[wallet hooks] onDisconnect');
}
function onAccountsChanged(account: Account) {
    console.log('[wallet hooks] onAccountsChanged: ', account);
}
function onChainChanged(chainInfo: any) {
    console.log('[wallet hooks] onChainChanged: ', chainInfo);
}
</script>

<template>
    <WalletProvider
        :adapters="adapters"
        @adapter-changed="onAdapterChanged"
        @ready-state-changed="onReadyStateChanged"
        @connect="onConnect"
        @disconnect="onDisconnect"
        @chain-changed="onChainChanged"
        @accounts-changed="onAccountsChanged"
    >
        <WalletModalProvider>
            <WalletActionButton></WalletActionButton>
            <VueUiDemo />
            <HooksDemo />
        </WalletModalProvider>
    </WalletProvider>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

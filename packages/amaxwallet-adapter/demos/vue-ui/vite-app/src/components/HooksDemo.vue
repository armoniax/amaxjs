<script setup lang="ts">
import { useWallet } from '@amax/amaxwallet-adapter-vue-hooks';
import { ElButton, ElOption, ElSelect } from 'element-plus';
const { wallets, wallet, account, connected, select, connect, disconnect, signMessage, transact } = useWallet();
const receiver = 'testuser2222';

async function onSelect(v: any) {
    console.log('onselect', v);
    await select(v);
}

async function onConnect() {
    await connect();
}

async function onDisconnect() {
    await disconnect();
}

async function onSignMessage() {
    const res = await signMessage('Hello world!');
    alert(res);
}

async function onTransfer() {
    if (!account) {
        return;
    }
    try {
        const transactResult = await transact([
            {
                account: 'amax.token',
                name: 'transfer',
                authorization: [{ actor: account.actor, permission: account.permission }],
                data: {
                    from: account.actor,
                    to: receiver,
                    quantity: '0.00100000 AMAX',
                    memo: '',
                },
            },
        ]);
        console.log(transactResult);
    } catch (e: any) {
        console.log(e.message);
    }
}
</script>

<template>
    <div>
        <p>Current Wallet: {{ wallet?.adapter.name }}</p>
        <p>Connection State: {{ wallet?.adapter.state }}</p>
        <p>Account : {{ JSON.stringify(account) }}</p>
        <ElSelect :modelValue="wallet?.adapter.name" @change="onSelect">
            <ElOption v-for="wallet of wallets" :key="wallet.adapter.name" :value="wallet.adapter.name"></ElOption>
        </ElSelect>
        <ElButton :disabled="connected" @click="onConnect">connect</ElButton>
        <ElButton :disabled="!connected" @click="onDisconnect">disconnect</ElButton>
        <ElButton :disabled="!connected" @click="onSignMessage">signMessage</ElButton>
        <ElButton :disabled="!connected" @click="onTransfer">transfer</ElButton>
    </div>
</template>

<style scoped>
p {
    color: #888;
}
</style>

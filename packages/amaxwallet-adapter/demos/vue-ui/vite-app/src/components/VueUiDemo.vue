<script setup lang="ts">
import { isInMobileBrowser } from '@amax/abstract-adapter';
import { useWallet } from '@amax/amaxwallet-adapter-vue-hooks';
import {
    WalletSelectButton,
    WalletConnectButton,
    WalletActionButton,
    WalletDisconnectButton,
} from '@amax/amaxwallet-adapter-vue-ui';
import { ElTable, ElTableColumn } from 'element-plus';
import { markRaw } from 'vue';
const isMobile = isInMobileBrowser();
const rows = [
    { name: 'Select Wallet Button', ui: markRaw(WalletSelectButton) },
    { name: 'Connect Button', ui: markRaw(WalletConnectButton) },
    { name: 'Disconnect Button', ui: markRaw(WalletDisconnectButton) },
    { name: 'Multi Action Button', ui: markRaw(WalletActionButton) },
];
const walletContext = useWallet();
console.log(walletContext);
</script>

<template>
    <div :style="{ width: isMobile ? '320px' : '800px' }">
        <ElTable :data="rows">
            <ElTableColumn label="Component Name" prop="name"> </ElTableColumn>
            <ElTableColumn label="Component UI">
                <template #default="{ row: { ui } }">
                    <component :is="ui"></component>
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>

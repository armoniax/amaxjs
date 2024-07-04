import { useWallet } from '@amax/amaxwallet-adapter-vue-hooks';
import { computed, defineComponent } from 'vue';
import { Button, ButtonProps } from './Button.js';
export const WalletDisconnectButton = defineComponent({
    props: ButtonProps,
    setup(props, { slots }) {
        const { wallet, disconnect, disconnecting, connected } = useWallet();
        async function handleClick() {
            let preventDefault = false;
            if (props.onClick) {
                preventDefault = await props.onClick();
            }
            if (!preventDefault) {
                disconnect().catch(() => {
                    //
                });
            }
        }
        const content = computed(() => {
            if (slots.default) return slots.default();
            if (disconnecting.value) return 'Disconnecting ...';
            if (wallet.value) return 'Disconnect';
            return 'Disconnect Wallet';
        });
        return () => (
            <Button
                {...{ ...props, onClick: handleClick }}
                data-testid="wallet-disconnect-button"
                disabled={props.disabled || !wallet.value || !connected.value}
                icon={props.icon ? props.icon : wallet.value ? wallet.value.adapter.icon : ''}
            >
                {content.value}
            </Button>
        );
    },
});

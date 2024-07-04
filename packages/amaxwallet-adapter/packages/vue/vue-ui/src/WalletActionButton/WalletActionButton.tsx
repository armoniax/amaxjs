import { useWallet } from '@amax/amaxwallet-adapter-vue-hooks';
import { Button, ButtonProps } from '../Button.js';
import { WalletSelectButton } from '../WalletSelectButton.js';
import { WalletConnectButton } from '../WalletConnectButton.js';
import { Collapse } from './Collapse.js';
import { useWalletModal } from '../useWalletModal.js';
import { copyData, createWrapperAndAppendToBody, getRelatedPosition } from '../utils.js';
import type { CSSProperties, PropType, Ref, UnwrapRef } from 'vue';
import { defineComponent, ref, onMounted, onUnmounted, onBeforeMount } from 'vue';
function useRef<T>(initialValue: T | (() => T)): [Ref<T>, (v: T) => void] {
    const v = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    const state = ref<T>(v);
    const setState = (v: T) => {
        state.value = v as UnwrapRef<T>;
    };
    return [state as Ref<T>, setState];
}
export const WalletActionButton = defineComponent({
    props: {
        className: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        style: {
            type: Object as PropType<CSSProperties>,
            default: () => ({}),
        },
        tabIndex: {
            type: Number,
            default: 0,
        },
        icon: {
            type: String,
            default: '',
        },
    },
    setup(props, { slots }) {
        const { account, wallet, disconnect } = useWallet();
        const { setVisible } = useWalletModal();
        const [dropdownVisible, setDropdownVisible] = useRef(false);
        const [copied, setCopied] = useRef(false);
        const nodeRef = ref<HTMLElement | null>();
        const wrapperRef = ref<HTMLElement | null>();

        const copyAddress = () => {
            if (account.value) {
                copyData(account.value.actor);
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                    hideDropdown();
                }, 400);
            }
        };

        function changeWallet() {
            setVisible(true);
            hideDropdown();
        }
        function openDropdown() {
            if (!wrapperRef.value) {
                return;
            }
            const offsetParent = element.offsetParent as HTMLElement;
            const position = getRelatedPosition(wrapperRef.value, offsetParent);
            element.style.top = `${position.top + wrapperRef.value.offsetHeight}px`;
            element.style.left = `${position.left}px`;
            setDropdownVisible(true);
        }
        function hideDropdown() {
            setDropdownVisible(false);
        }

        async function handleDisconnect() {
            await disconnect();
            hideDropdown();
        }

        const listener = (event: Event) => {
            const node = nodeRef.value;
            if (!node || node.contains(event.target as Node)) return;
            hideDropdown();
        };
        onMounted(() => {
            document.addEventListener('mousedown', listener);
            document.addEventListener('touchstart', listener);
        });
        onUnmounted(() => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        });

        let collapseId: string, element: HTMLElement;
        onBeforeMount(() => {
            element = createWrapperAndAppendToBody();
            element.style.position = 'absolute';
            collapseId = element.id;
        });
        onUnmounted(() => {
            document.body.removeChild(element);
        });

        return () =>
            !wallet.value ? (
                <WalletSelectButton {...{ ...props, onClick: hideDropdown }}>
                    {slots.default ? slots.default() : 'Select Wallet'}
                </WalletSelectButton>
            ) : (
                <div
                    ref={(el) => (wrapperRef.value = el as HTMLElement)}
                    data-testid="wallet-action-button"
                    class="adapter-dropdown"
                >
                    {!account.value ? (
                        <div onMouseenter={openDropdown} onMouseleave={hideDropdown}>
                            {slots.default ? (
                                <WalletConnectButton {...{ ...props, onClick: () => undefined }}>
                                    {slots.default()}
                                </WalletConnectButton>
                            ) : (
                                <WalletConnectButton {...{ ...props, onClick: () => undefined }}></WalletConnectButton>
                            )}
                        </div>
                    ) : (
                        <Button
                            ref={(el) => (wrapperRef.value = el as HTMLElement)}
                            {...{ ...props, onClick: openDropdown }}
                            style={{ pointerEvents: dropdownVisible.value ? 'none' : 'auto', ...props.style }}
                            icon={wallet.value ? wallet.value.adapter.icon : ''}
                        >
                            {slots.default
                                ? slots.default()
                                : !wallet.value || !account.value
                                    ? null
                                    : account.value.actor}
                        </Button>
                    )}
                    <Collapse
                        className="adapter-dropdown-collapse"
                        isOpen={dropdownVisible.value}
                        telePortId={collapseId}
                        {...(!account.value ? { onMouseEnter: openDropdown, onMouseLeave: hideDropdown } : {})}
                    >
                        <ul ref={nodeRef} class="adapter-dropdown-list" role="menu">
                            {account.value && (
                                <li onClick={copyAddress} class="adapter-dropdown-list-item" role="menuitem">
                                    {copied.value ? 'Copied' : 'Copy account'}
                                </li>
                            )}
                            <li onClick={changeWallet} class="adapter-dropdown-list-item" role="menuitem">
                                Change wallet
                            </li>
                            {account.value && (
                                <li onClick={handleDisconnect} class="adapter-dropdown-list-item" role="menuitem">
                                    Disconnect
                                </li>
                            )}
                        </ul>
                    </Collapse>
                </div>
            );
    },
});

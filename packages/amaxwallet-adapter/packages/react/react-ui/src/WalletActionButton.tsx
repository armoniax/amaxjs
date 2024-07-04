import { useWallet } from '@amax/amaxwallet-adapter-react-hooks';
import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';
import type { ButtonProps } from './Button.js';
import { Button } from './Button.js';
import { WalletSelectButton } from './WalletSelectButton.js';
import { WalletConnectButton } from './WalletConnectButton.js';
import { Collapse } from './Collapse.js';
import { useWalletModal } from './useWalletModal.js';
import { copyData } from './utils.js';
export const WalletActionButton: FC<ButtonProps> = ({ children, ...props }) => {
    const { account, wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const ref = useRef<HTMLUListElement>(null);

    const content = useMemo(() => {
        if (children) return children;
        if (!wallet || !account) return null;
        return account.actor;
    }, [children, wallet, account]);

    const copyAddress = () => {
        if (account) {
            copyData(account.actor);
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

    const openDropdown = useCallback(function () {
        setDropdownVisible(true);
    }, []);

    const hideDropdown = useCallback(function () {
        setDropdownVisible(false);
    }, []);
    const handleDisconnect = useCallback(
        async function () {
            await disconnect();
            hideDropdown();
        },
        [disconnect, hideDropdown]
    );

    useEffect(() => {
        const listener = (event: Event) => {
            const node = ref.current;
            if (!node || node.contains(event.target as Node)) return;
            hideDropdown();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, hideDropdown]);

    if (!wallet)
        return (
            <WalletSelectButton onClick={hideDropdown} {...props}>
                {children}
            </WalletSelectButton>
        );

    return (
        <div data-testid="wallet-action-button" className="adapter-dropdown">
            {!account ? (
                <div onMouseEnter={openDropdown} onMouseLeave={hideDropdown}>
                    <WalletConnectButton {...props}>{children}</WalletConnectButton>
                </div>
            ) : (
                <Button
                    onClick={openDropdown}
                    style={{ pointerEvents: dropdownVisible ? 'none' : 'auto', ...props.style }}
                    icon={wallet ? wallet.adapter.icon : ''}
                    {...props}
                >
                    {content}
                </Button>
            )}
            <Collapse
                className="adapter-dropdown-collapse"
                isOpen={dropdownVisible}
                {...(!account ? { onMouseEnter: openDropdown, onMouseLeave: hideDropdown } : {})}
            >
                <ul ref={ref} className="adapter-dropdown-list" role="menu">
                    {account && (
                        <li onClick={copyAddress} className="adapter-dropdown-list-item" role="menuitem">
                            {copied ? 'Copied' : 'Copy address'}
                        </li>
                    )}
                    <li onClick={changeWallet} className="adapter-dropdown-list-item" role="menuitem">
                        Change wallet
                    </li>
                    {account && (
                        <li onClick={handleDisconnect} className="adapter-dropdown-list-item" role="menuitem">
                            Disconnect
                        </li>
                    )}
                </ul>
            </Collapse>
        </div>
    );
};

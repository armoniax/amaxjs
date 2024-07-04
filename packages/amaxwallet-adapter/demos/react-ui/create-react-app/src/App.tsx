import React, { useMemo, useState } from 'react';
import type { Action, TransactResult, WalletError } from '@amax/abstract-adapter';
import { WalletDisconnectedError, WalletNotFoundError } from '@amax/abstract-adapter';
import { useWallet, WalletProvider } from '@amax/amaxwallet-adapter-react-hooks';
import {
    WalletActionButton,
    WalletConnectButton,
    WalletDisconnectButton,
    WalletModalProvider,
    WalletSelectButton,
} from '@amax/amaxwallet-adapter-react-ui';
// @ts-ignore
import toast from 'react-hot-toast';
// @ts-ignore
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Alert } from '@mui/material';
import { ArmadilloAdapter, AplinkAdapter, MetaMaskAdapter, UnisatAdapter } from '@amax/amaxwallet-adapters';

import { tronWeb } from './tronweb';
import { Button } from '@amax/amaxwallet-adapter-react-ui';
const rows = [
    { name: 'Connect Button', reactUI: WalletConnectButton },
    { name: 'Disconnect Button', reactUI: WalletDisconnectButton },
    { name: 'Select Wallet Button', reactUI: WalletSelectButton },
    { name: 'Multi Action Button', reactUI: WalletActionButton },
];
/**
 * wrap your app content with WalletProvider and WalletModalProvider
 * WalletProvider provide some useful properties and methods
 * WalletModalProvider provide a Modal in which you can select wallet you want use.
 *
 * Also you can provide a onError callback to process any error such as ConnectionError
 */
export function App() {
    function onError(e: WalletError) {
        if (e instanceof WalletNotFoundError) {
            toast.error(e.message);
        } else if (e instanceof WalletDisconnectedError) {
            toast.error(e.message);
        } else toast.error(e.message);
    }
    const adapters = useMemo(function () {
        const armadilloAdapter = new ArmadilloAdapter({ permission: 'owner' });
        const aplinkWalletAdapter = new AplinkAdapter({ rpc: 'https://test-chain.ambt.art' });
        const metaMaskWalletAdapter = new MetaMaskAdapter({ rpc: 'https://test-chain.ambt.art' });
        const unisatWalletAdapter = new UnisatAdapter({ rpc: 'https://test-chain.ambt.art', btcOwnerContract: 'btc.owner4', btcProxy: 'btc.proxy' });
        return [armadilloAdapter, aplinkWalletAdapter, metaMaskWalletAdapter, unisatWalletAdapter];
    }, []);
    return (
        <WalletProvider onError={onError} autoConnect={true} disableAutoConnectOnLoad={true} adapters={adapters}>
            <WalletModalProvider>
                <UIComponent></UIComponent>
                <Profile></Profile>
                <SignDemo></SignDemo>
            </WalletModalProvider>
        </WalletProvider>
    );
}

function UIComponent() {
    return (
        <div>
            <h2>UI Component</h2>
            <TableContainer style={{ overflow: 'visible' }} component="div">
                <Table sx={{}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Component</TableCell>
                            <TableCell align="left">React UI</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">
                                    <row.reactUI></row.reactUI>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

function Profile() {
    const { account, connected, wallet } = useWallet();
    return (
        <div>
            <h2>Wallet Connection Info</h2>
            <p>
                <span>Connection Status:</span> {connected ? 'Connected' : 'Disconnected'}
            </p>
            <p>
                <span>Your selected Wallet:</span> {wallet?.adapter.name}
            </p>
            <p>
                <span>Your Account Name:</span> {account?.actor}
            </p>
            <p>
                <span>Your Publickey:</span> {account?.publicKey}
            </p>
            <p>
                <span>Your Permission:</span> {account?.permission}
            </p>
        </div>
    );
}

function SignDemo() {
    const { signMessage, transact, account } = useWallet();
    const [message, setMessage] = useState('');
    const [signedMessage, setSignedMessage] = useState('');
    const receiver = 'testuser2222';
    const [open, setOpen] = useState(false);
    const [transactResult, setTransactResult] = useState<TransactResult>(null);

    async function onSignMessage() {
        const res = await signMessage(message);
        setSignedMessage(res);
    }

    async function onTransfer() {
        try {
            const transactResult = await transact([
                {
                    account: "amax.token",
                    name: "transfer",
                    authorization: [{ actor: account.actor, permission: account.permission }],
                    data: {
                        from: account.actor,
                        to: receiver,
                        quantity: "0.00100000 AMAX",
                        memo: ""
                    }
                }
            ]);
            setTransactResult(transactResult)
            setOpen(true);
        } catch (e) {
            console.log(e.message)
        }
    }
    return (
        <div style={{ marginBottom: 200 }}>
            <h2>Sign a message</h2>
            <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all' }}>
                You can sign a message by click the button.
            </p>
            <Button style={{ marginRight: '20px' }} onClick={onSignMessage}>
                SignMessage
            </Button>
            <TextField
                size="small"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="input message to signed"
            ></TextField>
            <p>Your sigedMessage is: {signedMessage}</p>
            <h2>Sign a Transaction</h2>
            <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all' }}>
                You can transfer 0.001 AMAX to &nbsp;<i>{receiver}</i>&nbsp;by click the button.
            </p>
            <Button onClick={onTransfer}>Transfer</Button>
            {open && (
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%', marginTop: 1 }}>
                    Success! You can confirm your transfer on{' '}
                    <a target="_blank" rel="noreferrer" href={`https://testnet.amaxscan.io/transaction/${transactResult.transaction_id}`}>
                        Amax Scan
                    </a>
                </Alert>
            )}
        </div>
    );
}

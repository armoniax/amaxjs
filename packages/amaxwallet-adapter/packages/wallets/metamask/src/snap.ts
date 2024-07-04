import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { Action } from '@amax/abstract-adapter';
import { JsonRpc } from '@amax/amaxjs-v2';
export const defaultSnapOrigin = 'npm:@amax/amaxsnap'; //'local:http://localhost:8080';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export declare type Snap = {
    permissionName: string;
    id: string;
    version: string;
    initialPermissions: Record<string, unknown>;
};

export declare type GetSnapsResponse = Record<string, Snap>;

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
    snapId: string = defaultSnapOrigin,
    params: Record<'version' | string, unknown> = {}
) => {
    await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
            [snapId]: params,
        },
    });
};

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (provider?: MetaMaskInpageProvider): Promise<GetSnapsResponse> =>
    (await (provider ?? window.ethereum).request({
        method: 'wallet_getSnaps',
    })) as unknown as GetSnapsResponse;

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
    try {
        const snaps = await getSnaps();

        return Object.values(snaps).find(
            (snap) => snap.id === defaultSnapOrigin && (!version || snap.version === version)
        );
    } catch (e) {
        console.log('Failed to obtain installed snap', e);
        return undefined;
    }
};

export async function snapTransact(actions: Action[], rpc: string) {
    return await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: defaultSnapOrigin,
            request: {
                method: 'signTransaction',
                params: {
                    actions,
                    network: rpc,
                    path: 0,
                },
            },
        },
    });
}

export async function snapSignMessage(msg: string) {
    return await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: defaultSnapOrigin,
            request: {
                method: 'signMessage',
                params: {
                    message: msg, // sign string
                    path: 0, // signer derive path
                },
            },
        },
    });
}

export async function getPublickey(paths = [0]): Promise<string> {
    const accounts = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: defaultSnapOrigin,
            request: {
                method: 'getAccounts',
                params: { paths },
            },
        },
    });
    return accounts[0];
}

export function getRPC(rpc: string): JsonRpc {
    return new JsonRpc(rpc, { fetch });
}

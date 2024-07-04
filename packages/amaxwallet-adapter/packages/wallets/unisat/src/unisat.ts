import ecc from '@amax/amaxjs-ecc';
import * as bip39 from 'bip39';
import hdkey from 'hdkey';
import { Api, JsonRpc } from '@amax/amaxjs-v2';
import CryptoJS from 'crypto-js';
import bitcore from 'bitcore-lib';
import bs58 from 'bs58';
import { Serialize } from '@amax/amaxjs-v2';
import type { UnisatAdapterConfig } from './utils.js';
import { supportUnisatWallet } from './utils.js';
import { JsSignatureProvider } from '@amax/amaxjs-v2/dist/eosjs-jssig';
import type { Account } from '@amax/abstract-adapter';
import { WalletNotFoundError } from '@amax/abstract-adapter';

/**
 * 通过助记词生成公私钥
 * @param mnemonic 默认随机生成
 * @param derivePath 默认最后一位为0
 * @returns
 */
export function generateAmaxKeyPairs(): AmaxKeyPair {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const master = hdkey.fromMasterSeed(seed);
    const node = master.derive("m/44'/1048576'/0'/0/0");
    const privateKey = ecc.PrivateKey(node.privateKey).toString();
    const publicKey = ecc.PublicKey(node.publicKey).toString();
    return {
        mnemonic,
        privateKey,
        publicKey,
    };
}

export function getRPC(rpc: string): JsonRpc {
    return new JsonRpc(rpc, { fetch });
}

export function stringToSha256(str: string) {
    const hashedStr = CryptoJS.SHA256(str).toString();
    return hashedStr;
}

export async function l2amcActive(params: any) {
    const res = await fetch('https://amaxup.amaxtest.com/api/activate/btc', {
        method: 'post',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res;
}

export function stringToHex(str: string) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16);
    }
    return hex;
}

export function getAmaxSign(btcSign: string): string {
    const buf = Buffer.from(btcSign, 'base64');
    const v = buf[0];
    const signature = bitcore.crypto.Signature.fromCompact(buf);
    const r = signature.r.toString('hex').padStart(64, '0');
    const s = signature.s.toString('hex').padStart(64, '0');
    const sig = v.toString(16) + r + s;
    const k1 = stringToHex('K1');
    const wd = CryptoJS.enc.Hex.parse(sig + k1);
    const rmd160 = CryptoJS.RIPEMD160(wd);
    const checksum = rmd160.toString().slice(0, 8);
    const sigBs58 = bs58.encode(Buffer.from(sig + checksum, 'hex'));
    return `SIG_K1_${sigBs58}`;
}

export async function signMessage(msg: string) {
    const sig = await window.unisat.signMessage(msg);
    return getAmaxSign(sig);
}

export function serializePublicKey(publicKey: string) {
    const sb = new Serialize.SerialBuffer({
        textEncoder: new TextEncoder(),
        textDecoder: new TextDecoder(),
    });
    sb.pushPublicKey(publicKey);
    return Serialize.arrayToHex(sb.getUint8Array(sb.length)).toLowerCase();
}

async function getActionBin(actions: Action[], nonce: number, config: Required<UnisatAdapterConfig>): Promise<string> {
    const rpc = getRPC(config.rpc);
    try {
        const { binargs } = await rpc.abi_json_to_bin(config.btcProxy, 'proxyaction', { actions, nonce } as any);
        return binargs;
    } catch (e) {
        throw new Error('action error');
    }
}

export async function getL2amcOwnerByBtcPubkey(config: Required<UnisatAdapterConfig>): Promise<L2amcOwner> {
    const btcPublickey = await getBtcPublickey();
    const rpc = getRPC(config.rpc);
    const {
        rows: [item],
    } = await rpc.get_table_rows({
        code: config.btcOwnerContract,
        scope: 'btc',
        table: 'l2amcaccts',
        json: true,
        limit: 1,
        reverse: false,
        index_position: 2,
        key_type: 'sha256',
        lower_bound: stringToSha256(btcPublickey),
        upper_bound: stringToSha256(btcPublickey),
    });
    if (!item) {
        throw new Error('l2amcOwner not found');
    }
    return item;
}

async function getActionDataBin(action: Action, rpc: string): Promise<Action> {
    const api = getRPC(rpc);
    try {
        const { binargs } = await api.abi_json_to_bin(action.account, action.name, action.data);
        action.data = binargs;
        return action;
    } catch (e) {
        throw 'action error';
    }
}

export function getAmaxClient(keyPairs: AmaxKeyPair, rpc: string): Api {
    const signatureProvider = new JsSignatureProvider([keyPairs.privateKey]);
    return new Api({ rpc: getRPC(rpc), signatureProvider });
}

export async function transact(
    actions: Action[],
    keyPairs: AmaxKeyPair,
    account: Account,
    config: Required<UnisatAdapterConfig>
) {
    const binActions = await Promise.all(actions.map((action) => getActionDataBin(action, config.rpc)));
    const l2amcOwner = await getL2amcOwnerByBtcPubkey(config);
    const next_nonce = l2amcOwner.next_nonce;
    const bin = await getActionBin(binActions, next_nonce, config);
    const sign = await signMessage(bin);
    const api = await getAmaxClient(keyPairs, config.rpc);
    return await api.transact(
        {
            actions: [
                {
                    account: config.btcProxy,
                    name: 'submitaction',
                    authorization: [
                        {
                            actor: account.actor,
                            permission: 'submitperm',
                        },
                    ],
                    data: {
                        account: account.actor,
                        packed_action: bin,
                        sign: sign,
                    },
                },
            ],
        },
        {
            blocksBehind: 3,
            expireSeconds: 30,
        }
    );
}

export async function getBtcPublickey(): Promise<string> {
    if (!supportUnisatWallet()) {
        throw new WalletNotFoundError();
    }
    const [btcPublickey] = await window.unisat.requestAccounts();
    if (!btcPublickey) throw new Error('btc account not found');
    return btcPublickey;
}

import type { RpcMethod } from '@metamask/multichain-api-client';
import type { SignedTransaction, Transaction } from '@tronweb3/tronwallet-abstract-adapter';

/**
 * 定义 Tron 区块链交互所需的 RPC 方法与事件。
 */
export type TronRpc = {
    methods: {
        signMessage: RpcMethod<{ message: string; privateKey?: string }, { signature: string }>;
        signTransaction: RpcMethod<
            { transaction: Transaction; privateKey?: string },
            { signedTransaction: SignedTransaction }
        >;
    };
    events: [];
};

/**
 * 以 CAIP-2 格式表示的 Tron 网络作用域枚举。
 */
export enum Scope {
    MAINNET = 'tron:728126428',
    SHASTA = 'tron:2494104990',
    NILE = 'tron:3448148188',
}

/**
 * Scope 的字符串字面量类型。
 */
export type ScopeValue = `${Scope}`;

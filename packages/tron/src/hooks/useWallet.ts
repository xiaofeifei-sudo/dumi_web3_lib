import type { Adapter, AdapterName, Transaction, AdapterState } from '@tronweb3/tronwallet-abstract-adapter';
import { createContext, useContext } from 'react';

/**
 * 钱包对象结构
 * - adapter 当前钱包适配器实例
 * - state 当前适配器状态（就绪、不可用等）
 */
export interface Wallet {
    adapter: Adapter;
    state: AdapterState;
}
/**
 * 钱包上下文的状态结构
 * - 包含自动连接、当前钱包、地址、连接状态等
 * - 提供选择、连接、断开、签名交易与消息的方法
 */
export interface WalletContextState {
    reconnectOnMount: boolean;
    wallets: Wallet[];
    wallet: Wallet | null;
    address: string | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;

    select: (adapterName: AdapterName) => void;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;

    signTransaction: Adapter['signTransaction'];
    signMessage: Adapter['signMessage'];
}
/**
 * 在未注入 Provider 的情况下打印错误提示
 * - 用于引导开发者在组件树中包裹 WalletProvider
 */
function printError() {
    console.error(`
You are using WalletContext without provide the WalletContext.Provider.
Please wrap your sub-components with a WalletProvider and provide required values.
`);
}
/**
 * 默认上下文对象
 * - 方法均在未提供 Provider 时提示错误并返回拒绝的 Promise
 * - 属性通过 getter 在访问时提示错误
 */
const DEFAULT_CONTEXT = {
    reconnectOnMount: true,
    connecting: false,
    connected: false,
    disconnecting: false,
    /* eslint-disable */
    select(_name: AdapterName) {
        printError();
    },
    connect() {
        printError();
        return Promise.reject();
    },
    disconnect() {
        printError();
        return Promise.reject();
    },
    signTransaction(_transaction: Transaction) {
        printError();
        return Promise.reject();
    },
    signMessage(_message: string) {
        printError();
        return Promise.reject();
    },
    /* eslint-enable */
} as WalletContextState;

/**
 * wallets 属性的惰性访问：在未提供 Provider 时提示错误
 */
Object.defineProperty(DEFAULT_CONTEXT, 'wallets', {
    get() {
        printError();
        return [];
    },
});
/**
 * wallet 属性的惰性访问：在未提供 Provider 时提示错误
 */
Object.defineProperty(DEFAULT_CONTEXT, 'wallet', {
    get() {
        printError();
        return null;
    },
});
/**
 * address 属性的惰性访问：在未提供 Provider 时提示错误
 */
Object.defineProperty(DEFAULT_CONTEXT, 'address', {
    get() {
        printError();
        return null;
    },
});

/**
 * 钱包上下文对象
 */
export const WalletContext = createContext<WalletContextState>(DEFAULT_CONTEXT as WalletContextState);
/**
 * 使用钱包上下文的 Hook
 * - 返回当前钱包上下文状态与操作方法
 */
export function useWallet(): WalletContextState {
    return useContext(WalletContext);
}

import type { NetworkNodeConfig } from '@tronweb3/tronwallet-abstract-adapter';
import type { TronWeb } from '@tronweb3/tronwallet-abstract-adapter';

/**
 * TronLink 钱包事件类型定义
 */
export interface TronLinkWalletEvents {
    /**
     * 连接事件
     */
    connect: (...args: unknown[]) => unknown;
    /**
     * 断开连接事件
     */
    disconnect: (...args: unknown[]) => unknown;
}

export type { TronWeb };
/**
 * 请求账户返回结构
 */
export interface ReqestAccountsResponse {
    /**
     * 响应码：200 成功；4000 请求已存在；4001 用户拒绝
     */
    code: 200 | 4000 | 4001;
    /**
     * 响应消息
     */
    message: string;
}

/**
 * TronLink 注入的 message 事件数据结构
 */
export interface TronLinkMessageEvent {
    data: {
        /**
         * 是否由 TronLink 注入
         */
        isTronLink: boolean;
        message: {
            /**
             * 事件动作类型
             */
            action: 'setAccount' | 'accountsChanged' | 'setNode' | 'connect' | 'disconnect';
            /**
             * 事件数据，随具体动作而变
             */
            data?: AccountsChangedEventData | NetworkChangedEventData;
        };
    };
}
export interface AccountsChangedEventData {
    // 当用户锁定账户时，TronLink 会返回 false，这里按字符串处理
    address: string;
}

/**
 * 网络切换事件数据
 */
export interface NetworkChangedEventData {
    /**
     * 当前节点配置
     */
    node: NetworkNodeConfig;
    /**
     * 连接的节点配置
     */
    connectNode: NetworkNodeConfig;
}

/**
 * Tron 请求参数
 */
interface TronRequestArguments {
    /**
     * 请求方法名
     */
    readonly method: string;
    /**
     * 请求参数
     */
    readonly params?: unknown[] | object;
}
/**
 * Provider RPC 错误结构
 */
interface ProviderRpcError extends Error {
    /**
     * 错误代码
     */
    code: number;
    /**
     * 错误信息
     */
    message: string;
    /**
     * 额外错误数据
     */
    data?: unknown;
}
/**
 * Tron 事件类型枚举
 */
type TronEvent = 'connect' | 'disconnect' | 'chainChanged' | 'accountsChanged';

/**
 * 连接事件回调，包含链 ID
 */
export type TronConnectCallback = (data: { chainId: string }) => void;
export type TronChainChangedCallback = TronConnectCallback;
/**
 * 断开连接事件回调
 */
export type TronDisconnectCallback = (error: ProviderRpcError) => void;
/**
 * 账户变更事件回调，返回地址数组（可能为空）
 */
export type TronAccountsChangedCallback = (data: [string?]) => void;
/**
 * Tron 对象接口（TIP-1193）
 */
export interface Tron {
    /**
     * 请求方法。
     * 当 method 为 'eth_requestAccounts' 时返回账户地址数组。
     */
    request: ((args: { method: 'eth_requestAccounts' }) => Promise<[string]>) & ((args: TronRequestArguments) => Promise<unknown>);

    /**
     * 事件订阅。
     * 支持 connect、disconnect、chainChanged、accountsChanged。
     */
    on: ((event: 'connect', cb: TronConnectCallback) => void) & ((event: 'disconnect', cb: TronDisconnectCallback) => void) & ((event: 'chainChanged', cb: TronChainChangedCallback) => void) & ((event: 'accountsChanged', cb: TronAccountsChangedCallback) => void);

    /**
     * 取消事件订阅
     */
    removeListener: (event: TronEvent, cb: unknown) => void;
    /**
     * TronWeb 实例或 false（不可用时）
     */
    tronWeb: TronWeb | false;
    /**
     * 是否为 TronLink 环境
     */
    isTronLink: boolean;
}

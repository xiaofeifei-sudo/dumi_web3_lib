import { NetworkType } from '@tronweb3/tronwallet-abstract-adapter';
import { Scope } from './types';

/**
 * 将链 ID 转换为对应的 Tron 作用域。
 * @param chainId - 链 ID 字符串。
 * @returns 对应的 Tron 作用域。
 * @throws 当链 ID 不受支持时抛出错误。
 */
export function chainIdToScope(chainId: string): Scope {
    switch (chainId) {
        case '0x2b6653dc': // Tron 主网
            return Scope.MAINNET;
        case '0xcd8690dc': // Tron Nile 测试网
            return Scope.NILE;
        case '0x94a9059e': // Tron Shasta 测试网
            return Scope.SHASTA;
        default:
            throw new Error(`Could not determine scope for unsupported chainId: ${chainId}`);
    }
}

/**
 * 将 Tron 作用域转换为对应的链 ID。
 * @param scope - Tron 作用域。
 * @returns 对应的链 ID 字符串。
 * @throws 当作用域不受支持时抛出错误。
 */
export function scopeToChainId(scope: Scope): string {
    switch (scope) {
        case Scope.MAINNET:
            return '0x2b6653dc';
        case Scope.NILE:
            return '0xcd8690dc';
        case Scope.SHASTA:
            return '0x94a9059e';
        default:
            throw new Error(`Could not determine chainId for unsupported scope: ${scope}`);
    }
}

/**
 * 从 CAIP 账户 ID 中提取地址。
 * @param caipAccountId - CAIP 账户 ID 字符串（例如 'tron:mainnet:address'）。
 * @returns 提取出的地址。
 * @throws 当 CAIP 账户 ID 无效时抛出错误。
 */
export function getAddressFromCaipAccountId(caipAccountId: string): string {
    const [, , address] = caipAccountId.split(':');
    if (!address) {
        throw new Error(`Invalid CAIP account ID: ${caipAccountId}`);
    }
    return address;
}

/**
 * 判断给定数据是否为 accountsChanged 事件。
 * @param data - 事件数据。
 * @returns 若为 accountsChanged 事件则返回 true，否则返回 false。
 */
export function isAccountChangedEvent(event: any): boolean {
    return event?.method === 'wallet_notify' && event?.params?.notification?.method === 'metamask_accountsChanged';
}

/**
 * 判断给定数据是否为 sessionChanged 事件。
 * @param event - 事件数据。
 * @returns 若为 sessionChanged 事件则返回 true，否则返回 false。
 */
export function isSessionChangedEvent(event: any): boolean {
    return event?.method === 'wallet_sessionChanged';
}

/**
 * 将 Tron 作用域转换为对应的 NetworkType。
 * @param scope - Tron 作用域字符串。
 * @returns 对应的 NetworkType。
 * @throws 当作用域不受支持时抛出错误。
 */
export function scopeToNetworkType(scope: Scope): NetworkType {
    switch (scope) {
        case Scope.MAINNET:
            return NetworkType.Mainnet;
        case Scope.NILE:
            return NetworkType.Nile;
        case Scope.SHASTA:
            return NetworkType.Shasta;
        default:
            throw new Error(`Could not determine network type for unsupported scope: ${scope}`);
    }
}

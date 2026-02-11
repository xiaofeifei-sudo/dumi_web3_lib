import { WalletError } from '@tronweb3/tronwallet-abstract-adapter';

/**
 * 获取网络信息错误
 * 当从钱包或 TronWeb 获取当前网络信息失败时抛出
 */
export class WalletGetNetworkError extends WalletError {
    name = 'WalletGetNetworkError';
}

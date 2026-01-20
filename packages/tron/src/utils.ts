/* v8 ignore start */
import { WalletReadyState } from '@tronweb3/tronwallet-abstract-adapter';

// 判断钱包是否“就绪”：已发现或正在加载即视为就绪
export const hasWalletReady = (readyState?: WalletReadyState) =>
  readyState === WalletReadyState.Found || readyState === WalletReadyState.Loading;

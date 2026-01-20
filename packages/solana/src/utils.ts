import { WalletReadyState } from '@solana/wallet-adapter-base';

import type {
  AdapterWalletFactory as AdapterWalletFactoryType,
  WalletConnectWalletFactory as WalletConnectWalletFactoryType,
  WalletFactory as WalletFactoryType,
} from './wallets/types';

/** 判断钱包是否“就绪”（已安装或可加载） */
export const hasWalletReady = (readyState?: WalletReadyState) =>
  readyState === WalletReadyState.Installed || readyState === WalletReadyState.Loadable;

/** 是否为 WalletConnect 钱包工厂 */
export const isWalletConnectFactory = (
  factory: WalletFactoryType,
): factory is WalletConnectWalletFactoryType =>
  !!(factory as WalletConnectWalletFactoryType).isWalletConnect;

/** 是否为 Adapter 钱包工厂（基于 @solana/wallet-adapter-* 的适配器） */
export const isAdapterWalletFactory = (
  factory: WalletFactoryType,
): factory is AdapterWalletFactoryType => {
  return (factory as AdapterWalletFactoryType).adapter !== undefined;
};

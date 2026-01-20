import type { Adapter } from '@solana/wallet-adapter-base';
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

import type { IUniversalProvider } from '../types';
import type { WalletConnectWalletAdapter } from '../wallet-connect-adapter';

export interface StandardWallet extends Wallet {
  /** 标准钱包标记（非 WalletConnect，直接由 adapter 或内置提供） */
  isStandardWallet: boolean;
}

export interface WalletFactory {
  /** 创建钱包实例；可选传入 WalletConnect Provider 获取器 */
  create: (getWalletConnect?: () => Promise<IUniversalProvider | undefined>) => Wallet;
}

export interface StandardWalletFactory extends WalletFactory {
  /** 创建标准钱包实例 */
  create: () => StandardWallet;
}

export interface AdapterWalletFactory extends WalletFactory {
  // 仅在使用 `@solana/wallet-adapter-*` 时需要
  adapter: Adapter;
}

export interface WalletConnectWalletFactory extends WalletFactory {
  /** WalletConnect 适配器 */
  adapter: WalletConnectWalletAdapter;
  /** 标记该工厂为 WalletConnect 类型 */
  isWalletConnect: boolean;
}

export type WalletFactoryBuilder = (
  adapter: Adapter,
  walletMetadata: WalletMetadata,
) => AdapterWalletFactory;

export type StandardWalletFactoryBuilder = (
  walletMetadata: WalletMetadata,
) => StandardWalletFactory;

export type WalletConnectWalletFactoryBuilder = (
  adapter: WalletConnectWalletAdapter,
  walletMetadata: WalletMetadata,
) => WalletConnectWalletFactory;

import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter';
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

// 标准钱包类型：在基础 Wallet 上增加标准化标识
export interface StandardWallet extends Wallet {
  isStandardWallet: boolean;
}
// 标准钱包工厂：用于创建标准钱包实例
export interface StandardWalletFactory {
  create: () => StandardWallet;
}

// 基于适配器的具体钱包工厂
export interface AdapterWalletFactory {
  adapter: Adapter;
}

// 构建具体钱包工厂的方法签名
export type WalletFactoryBuilder = (
  adapter: Adapter,
  walletMetadata: WalletMetadata,
) => AdapterWalletFactory;

// 构建标准钱包工厂的方法签名
export type StandardWalletFactoryBuilder = (
  walletMetadata: WalletMetadata,
) => StandardWalletFactory;

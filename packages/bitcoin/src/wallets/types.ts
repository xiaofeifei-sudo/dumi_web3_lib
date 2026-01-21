// 说明：钱包工厂相关类型定义
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

import type { BitcoinWallet } from '../adapter';

export interface WalletWithAdapter extends Wallet {
  // 每个钱包都绑定一个具体的 Bitcoin 适配器
  adapter: BitcoinWallet;
}

export interface WalletFactory {
  // 工厂方法：创建包含适配器的钱包对象
  create: () => WalletWithAdapter;
}

export type WalletFactoryBuilder = (
  // wallets have different adapter
  adapterConstructor: any,
  metadata: WalletMetadata,
) => WalletFactory;

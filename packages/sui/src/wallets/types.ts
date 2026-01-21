/**
 * 钱包工厂与类型定义
 * - WalletFactory：用于创建通用 Wallet 对象
 * - WalletFactoryBuilder：根据元数据生成工厂的构造函数类型
 */
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

export interface WalletFactory {
  /** 创建一个通用 Wallet 实例 */
  create: () => Wallet;
}

/** 依据 WalletMetadata 生成 WalletFactory 的函数类型 */
export type WalletFactoryBuilder = (metadata: WalletMetadata) => WalletFactory;

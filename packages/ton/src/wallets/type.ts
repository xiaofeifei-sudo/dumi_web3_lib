import type { WalletInfo } from '@tonconnect/sdk';
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

/**
 * 基础 TON 钱包类型
 * - 组合 WalletMetadata 与 TonConnect 的 WalletInfo
 * - 可选 universalLink（通用唤起链接）
 */
export type TonBasicWallet = TonWalletMetadata &
  WalletInfo & {
    universalLink?: string;
  };

/**
 * 通用钱包类型：用于 UI 与连接流程
 */
export type TonWallet = Wallet & WalletInfo;

/**
 * 钱包工厂接口
 * - create：根据基础元数据生成通用钱包对象
 */
export interface WalletFactory {
  create: () => TonWallet;
}

/**
 * TON 钱包元数据类型
 * - 从通用 WalletMetadata 中移除 name/remark 字段，由工厂统一生成
 */
export type TonWalletMetadata = Omit<WalletMetadata, 'name' | 'remark'>;

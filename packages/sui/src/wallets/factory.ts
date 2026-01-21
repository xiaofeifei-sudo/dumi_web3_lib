/**
 * 钱包工厂实现
 * - 输入 WalletMetadata，返回一个具有 create() 方法的工厂
 * - create() 产出通用 Wallet 对象，并补充标准能力探测方法
 */
/* v8 ignore start */
import type { WalletFactoryBuilder } from './types';

export const WalletFactory: WalletFactoryBuilder = (metadata) => {
  return {
    create: () => {
      return {
        ...metadata,
        // 我们简单假设所有钱包都遵循 `Standard Wallet` 规范，
        // 因此由 wallets 提供的标准钱包会通过 dapp-kit 注入，不在此处可用。
        hasWalletReady: () => Promise.resolve(false),
        hasExtensionInstalled: () => Promise.resolve(false),
      };
    },
  };
};

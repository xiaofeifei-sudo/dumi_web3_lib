import { isWalletInfoCurrentlyInjected } from '@tonconnect/sdk';

import type { TonBasicWallet, WalletFactory } from './type';

/**
 * 根据基础元数据创建通用 TON 钱包对象
 * - 检测当前环境是否已注入钱包（浏览器扩展）
 * - 映射 name/remark/key/icon 等通用字段
 * - 提供 hasWalletReady/hasExtensionInstalled 便捷方法
 */
export const TonWalletFactory = (metadata: TonBasicWallet): WalletFactory => {
  const isReady = isWalletInfoCurrentlyInjected(metadata);

  return {
    create: () => {
      return {
        ...metadata,
        name: metadata.name,
        remark: metadata.appName,
        key: metadata.appName,
        icon: metadata.icon ?? metadata.imageUrl,
        hasWalletReady: () => Promise.resolve(isReady),
        hasExtensionInstalled: () => Promise.resolve(isReady),
      };
    },
  };
};

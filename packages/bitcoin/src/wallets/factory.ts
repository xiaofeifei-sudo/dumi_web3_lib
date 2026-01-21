// 说明：通用钱包工厂，用于将适配器构造函数与钱包元数据绑定
import type { WalletFactoryBuilder } from './types';

export const WalletFactory: WalletFactoryBuilder = (adapterConstructor, metadata) => {
  return {
    create: () => {
      // 以 metadata.name 作为适配器的初始化名字
      const adapter = new adapterConstructor(metadata.name);
      return {
        ...metadata,
        adapter,
        // 判断钱包是否就绪：provider 是否存在
        hasWalletReady: () => Promise.resolve(!!adapter.provider),
        // 判断扩展是否安装：与就绪状态一致
        hasExtensionInstalled: () => Promise.resolve(!!adapter.provider),
      };
    },
  };
};

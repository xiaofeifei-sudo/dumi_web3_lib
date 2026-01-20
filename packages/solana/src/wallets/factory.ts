/* v8 ignore start */
import type {
  StandardWalletFactoryBuilder,
  WalletConnectWalletFactoryBuilder,
  WalletFactoryBuilder,
} from './types';

export const WalletFactory: WalletFactoryBuilder = (adapter, metadata) => {
  return {
    adapter,
    create: () => {
      return {
        ...metadata,
        /** 使用适配器名称覆盖钱包名称，保持与 adapter 一致 */
        name: adapter.name,
        remark: metadata.remark,
        adapter: adapter,
      };
    },
  };
};

// 用于标准钱包：不依赖 WalletConnect 的常规钱包
export const StandardWalletFactory: StandardWalletFactoryBuilder = (metadata) => {
  return {
    create: () => {
      return {
        ...metadata,
        isStandardWallet: true,
      };
    },
  };
};

// 用于 `WalletConnect`：支持二维码连接、延迟初始化 Provider
export const WalletConnectWalletFactory: WalletConnectWalletFactoryBuilder = (
  adapter,
  metadata,
) => {
  return {
    isWalletConnect: true,
    adapter,
    create: (getWalletConnectProvider) => {
      return {
        ...metadata,
        name: adapter.name,
        remark: metadata.remark,
        adapter,

        getQrCode: getWalletConnectProvider
          ? async () => {
              const walletConnectProvider = await getWalletConnectProvider();

              if (!walletConnectProvider) {
                return Promise.reject(new Error('WalletConnect is not available'));
              }

              return new Promise((resolve) => {
                walletConnectProvider.on('display_uri', (uri: string) => {
                  resolve({ uri });
                });
              });
            }
          : undefined,
      };
    },
  };
};

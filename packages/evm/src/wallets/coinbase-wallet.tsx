import { metadata_CoinbaseWallet } from 'pelican-web3-lib-assets';
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';
import { coinbaseWallet, type CoinbaseWalletParameters } from 'wagmi/connectors';

import type { WalletFactory } from '../interface';

/**
 * Coinbase Wallet 钱包工厂
 * - 使用 wagmi 的 coinbaseWallet 连接器
 * - create 返回 Wallet 元数据与就绪状态
 * - 支持通过 coinbaseConfig 传入自定义参数
 */
export const CoinbaseWallet: (
  metadata?: Partial<WalletMetadata>,
  coinbaseConfig?: CoinbaseWalletParameters,
) => WalletFactory = (metadata, coinbaseConfig) => {
  return {
    connectors: ['Coinbase Wallet'],
    create: (): Wallet => {
      return {
        ...metadata_CoinbaseWallet,
        hasWalletReady: async () => {
          return true;
        },
        ...metadata,
      };
    },
    createWagmiConnector: () => {
      return coinbaseWallet(coinbaseConfig);
    },
  };
};

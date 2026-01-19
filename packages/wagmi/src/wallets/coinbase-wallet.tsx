import { metadata_CoinbaseWallet } from 'pelican-web3-lib-assets';
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';
import { coinbaseWallet, type CoinbaseWalletParameters } from 'wagmi/connectors';

import type { WalletFactory } from '../interface';

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

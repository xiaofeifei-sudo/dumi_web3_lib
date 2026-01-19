import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

export interface WalletFactory {
  create: () => Wallet;
}

export type WalletFactoryBuilder = (metadata: WalletMetadata) => WalletFactory;

import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter';
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

export interface StandardWallet extends Wallet {
  isStandardWallet: boolean;
}
export interface StandardWalletFactory {
  create: () => StandardWallet;
}

export interface AdapterWalletFactory {
  adapter: Adapter;
}

export type WalletFactoryBuilder = (
  adapter: Adapter,
  walletMetadata: WalletMetadata,
) => AdapterWalletFactory;

export type StandardWalletFactoryBuilder = (
  walletMetadata: WalletMetadata,
) => StandardWalletFactory;

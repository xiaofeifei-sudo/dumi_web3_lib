import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

import type { BitcoinWallet } from '../adapter';

export interface WalletWithAdapter extends Wallet {
  adapter: BitcoinWallet;
}

export interface WalletFactory {
  create: () => WalletWithAdapter;
}

export type WalletFactoryBuilder = (
  // wallets have different adapter
  adapterConstructor: any,
  metadata: WalletMetadata,
) => WalletFactory;

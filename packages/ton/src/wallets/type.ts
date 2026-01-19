import type { WalletInfo } from '@tonconnect/sdk';
import type { Wallet, WalletMetadata } from 'pelican-web3-lib-common';

export type TonBasicWallet = TonWalletMetadata &
  WalletInfo & {
    universalLink?: string;
  };

export type TonWallet = Wallet & WalletInfo;

export interface WalletFactory {
  create: () => TonWallet;
}

export type TonWalletMetadata = Omit<WalletMetadata, 'name' | 'remark'>;

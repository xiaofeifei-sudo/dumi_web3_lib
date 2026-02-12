import { metadata_FoxWallet } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';

export const FoxWallet: WalletMetadata = {
  ...metadata_FoxWallet,
  key: 'foxTronWallet',
  group: 'Popular',
  supportSwitchChain: false,
};

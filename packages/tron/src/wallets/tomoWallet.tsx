import { metadata_TomoWallet } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';

export const TomoWallet: WalletMetadata = {
  ...metadata_TomoWallet,
  key: 'tomoTronWallet',
  group: 'Popular',
  supportSwitchChain: false,
};

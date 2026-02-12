import { metadata_GateWallet } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';

export const GateWallet: WalletMetadata = {
  ...metadata_GateWallet,
  key: 'gateTronWallet',
  group: 'Popular',
  supportSwitchChain: false,
};

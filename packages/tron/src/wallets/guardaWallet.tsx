import { metadata_Guarda } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';

export const GuardaWallet: WalletMetadata = {
  ...metadata_Guarda,
  key: 'guardaTronWallet',
  group: 'Popular',
  supportSwitchChain: false,
};

import { metadata_TokenPocket } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';

export const TokenPocketWallet: WalletMetadata = {
  ...metadata_TokenPocket,
  key: 'tokenPocketTronWallet',
  group: 'Popular',
  supportSwitchChain: false,
};

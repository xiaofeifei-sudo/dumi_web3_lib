import { metadata_Ledger } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';

export const LedgerWallet: WalletMetadata = {
  ...metadata_Ledger,
  key: 'ledgerTronWallet',
  group: 'Popular',
  supportSwitchChain: false
};

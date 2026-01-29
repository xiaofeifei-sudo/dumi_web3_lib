import type { WalletMetadata } from 'pelican-web3-lib-common';
import { WalletColorful } from 'pelican-web3-lib-icons';

export const metadata_Ledger: WalletMetadata = {
  icon: <WalletColorful />,
  name: 'Ledger',
  remark: 'Ledger Wallet',
  app: {
    link: 'https://www.ledger.com/',
  },
  group: 'Hardware',
};

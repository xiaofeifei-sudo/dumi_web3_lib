import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ScanColorful } from 'pelican-web3-lib-icons';

export const metadata_MobileConnect: WalletMetadata = {
  icon: <ScanColorful />,
  name: 'Scan QR Code',
  remark: 'Connect with mobile APP',
  group: 'Popular',
  universalProtocol: {
    link: 'https://walletconnect.com/',
  },
};

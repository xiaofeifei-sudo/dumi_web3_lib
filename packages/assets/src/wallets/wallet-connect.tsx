import type { WalletMetadata } from 'pelican-web3-lib-common';
import { WalletConnectColorful } from 'pelican-web3-lib-icons';

export const metadata_WalletConnect: WalletMetadata = {
  icon: <WalletConnectColorful />,
  name: 'WalletConnect',
  remark: 'Connect with mobile APP',
  universalProtocol: {
    link: 'https://walletconnect.com/',
  },
};

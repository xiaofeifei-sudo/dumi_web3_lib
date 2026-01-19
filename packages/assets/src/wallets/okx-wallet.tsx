import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, OkxWalletColorful } from 'pelican-web3-lib-icons';

export const metadata_OkxWallet: WalletMetadata = {
  icon: <OkxWalletColorful />,
  name: 'OKX Wallet',
  remark: 'OKX Wallet',
  app: {
    link: 'https://www.okx.com/download',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/mcohilncbfahbmgdjkbpemcciiolgcge',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
  // TODO suport deeplink
};

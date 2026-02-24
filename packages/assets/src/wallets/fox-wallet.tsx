// 说明：Fox Wallet 的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful } from 'pelican-web3-lib-icons';

export const metadata_FoxWallet: WalletMetadata = {
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=foxwallet.com',
  name: 'FoxWallet',
  remark: 'Fox Wallet',
  app: {
    link: 'https://foxwallet.com/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://foxwallet.com/',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

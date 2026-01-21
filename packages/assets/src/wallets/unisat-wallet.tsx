// 说明：Unisat Wallet 的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, UnisatColorful } from 'pelican-web3-lib-icons';

export const metadata_Unisat: WalletMetadata = {
  icon: <UnisatColorful />,
  name: 'Unisat Wallet',
  remark: 'Unisat Wallet',
  app: {
    link: 'https://unisat.io/download',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/unisat/ppbibelpcjmhbdihakflkdcoccbgbkpo',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

// 说明：Guarda 钱包的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful } from 'pelican-web3-lib-icons';

export const metadata_Guarda: WalletMetadata = {
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=guarda.com',
  name: 'Guarda',
  remark: 'Guarda Wallet',
  app: {
    link: 'https://guarda.com/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://guarda.com/',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

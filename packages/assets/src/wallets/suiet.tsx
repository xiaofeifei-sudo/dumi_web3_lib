// 说明：Suiet 钱包的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, SuietColorful } from 'pelican-web3-lib-icons';

export const metadata_Suiet: WalletMetadata = {
  name: 'Suiet',
  remark: 'Suiet Wallet',
  icon: <SuietColorful />,
  app: {
    link: 'https://suiet.app/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

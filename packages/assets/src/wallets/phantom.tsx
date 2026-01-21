// 说明：Phantom 钱包的展示元数据与 DeepLink 模板
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, PhantomColorful } from 'pelican-web3-lib-icons';

export const metadata_Phantom: WalletMetadata = {
  icon: <PhantomColorful />,
  name: 'Phantom',
  remark: 'Phantom Wallet',
  app: {
    link: 'https://phantom.app/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
  deeplink: {
    urlTemplate: 'https://phantom.com/ul/browse/${url}?ref=${ref}',
  },
};

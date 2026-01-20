/* v8 ignore start */
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { BybitWalletCircleColorful, ChromeCircleColorful } from 'pelican-web3-lib-icons';

// Bybit 钱包的展示与下载信息元数据
export const BybitWallet: WalletMetadata = {
  icon: <BybitWalletCircleColorful />,
  name: 'Bybit',
  remark: 'Bybit',
  app: {
    link: 'https://www.bybit.com/download/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/bybit-wallet/pdliaogehgdbhbnmkklieghmmjkpigpa',
      description:
        'Bybit Wallet connects you to the world of Web3 with best-in-class reliability and security.',
    },
  ],
  key: 'BybitWallet',
  group: 'Popular',
};

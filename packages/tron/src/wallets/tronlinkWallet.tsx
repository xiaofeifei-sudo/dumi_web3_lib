/* v8 ignore start */
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, TronlinkColorful } from 'pelican-web3-lib-icons';

// TronLink 钱包的展示与下载信息元数据
export const TronlinkWallet: WalletMetadata = {
  icon: <TronlinkColorful />,
  name: 'TronLink',
  remark: 'TronLink',
  app: {
    link: 'https://www.tronlink.org/dlDetails/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
      description: 'The first and most popular TRON wallet. Recommended by TRON Foundation.',
    },
  ],
  key: 'tronWallet',
  group: 'Popular',
};

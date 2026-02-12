// 说明：Gate Wallet 的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful } from 'pelican-web3-lib-icons';

export const metadata_GateWallet: WalletMetadata = {
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=gate.io',
  name: 'Gate Wallet',
  remark: 'Gate Wallet',
  app: {
    link: 'https://www.gate.io/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://www.gate.io/',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

// 说明：Xverse 钱包的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, XverseColorful } from 'pelican-web3-lib-icons';

export const metadata_Xverse: WalletMetadata = {
  icon: <XverseColorful />,
  name: 'Xverse',
  remark: 'Xverse Wallet',
  app: {
    link: 'https://www.xverse.app/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

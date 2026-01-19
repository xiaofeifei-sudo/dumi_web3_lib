import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, SlushCircleFilled } from 'pelican-web3-lib-icons';

export const metadata_Slush: WalletMetadata = {
  name: 'Slush',
  remark: 'Slush',
  icon: <SlushCircleFilled />,
  app: {
    link: 'https://slush.app/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'chromewebstore.google.com/detail/opcgpfmipidbgpenhmajoajpbobppdil',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

import { metadata_OkxWallet } from 'pelican-web3-lib-assets';
import { ChromeCircleColorful } from 'pelican-web3-lib-icons';

import type { TonWalletMetadata } from './type';

export const okxTonWallet: TonWalletMetadata = {
  ...metadata_OkxWallet,
  key: 'okxTonWallet',
  group: 'Popular',
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/mcohilncbfahbmgdjkbpemcciiolgcge',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

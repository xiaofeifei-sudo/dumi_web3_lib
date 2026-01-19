import { ChromeCircleColorful, TonkeeperColorful } from 'pelican-web3-lib-icons';

import type { TonWalletMetadata } from './type';

export const tonkeeper: TonWalletMetadata = {
  key: 'tonkeeper',
  icon: <TonkeeperColorful />,
  group: 'Popular',
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/omaabbefbmiijedngplfjmnooppbclkk',
      description:
        'Tonkeeper is the easiest way to store, send, and receive Toncoin on The Open Network',
    },
  ],
};

import { ChromeCircleColorful, MytonWalletCircleColorful } from 'pelican-web3-lib-icons';

import type { TonWalletMetadata } from './type';

/**
 * MyTonWallet 钱包元数据
 * - 功能丰富的浏览器扩展，包含多账户、NFT、TON DNS 等
 */
export const myTonWallet: TonWalletMetadata = {
  key: 'mytonwallet',
  icon: <MytonWalletCircleColorful />,
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/fldfpgipfncgndfolcbkdeeknbbbnhcc',
      description:
        'The most feature-rich TON extension – with support of multi-accounts, tokens, NFT, TON DNS, TON Sites, TON Proxy, and TON Magic.',
    },
  ],
};

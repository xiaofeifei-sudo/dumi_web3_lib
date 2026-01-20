/* v8 ignore start */
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { BitgetWalletColorful, ChromeCircleColorful } from 'pelican-web3-lib-icons';

// Bitget 钱包的展示与下载信息元数据
export const BitgetWallet: WalletMetadata = {
  icon: <BitgetWalletColorful />,
  name: 'Bitget',
  remark: 'Bitget',
  app: {
    link: 'https://web3.bitget.com/wallet-download',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/bitget-wallet-crypto-web3/jiidiaalihmmhddjgbnbgdfflelocpak',
      description:
        "Bitget Wallet, formerly known as BitKeep, is one of the world's largest non-custodial  multi-chain crypto wallets.",
    },
  ],
  key: 'BitgetWallet',
  group: 'Popular',
};

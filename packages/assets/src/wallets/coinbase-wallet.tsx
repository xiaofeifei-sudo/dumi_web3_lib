// 说明：Coinbase Wallet 的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, CoinbaseWalletCircleColorful } from 'pelican-web3-lib-icons';

export const metadata_CoinbaseWallet: WalletMetadata = {
  icon: <CoinbaseWalletCircleColorful />,
  name: 'Coinbase Wallet',
  remark: 'Coinbase Wallet',
  app: {
    link: 'https://www.coinbase.com/wallet',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

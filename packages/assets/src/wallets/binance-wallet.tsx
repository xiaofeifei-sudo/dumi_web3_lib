// 说明：Binance Wallet 的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, BnbCircleColorful } from 'pelican-web3-lib-icons';

export const metadata_BinanceWallet: WalletMetadata = {
  icon: <BnbCircleColorful />,
  name: 'Binance Wallet',
  remark: 'Binance Web3 Wallet',
  app: {
    link: 'https://www.binance.com/en/web3wallet',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link:
        'https://chromewebstore.google.com/detail/binance-wallet/cadiboklkpojfamcoggejbbdjcoiljjk',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

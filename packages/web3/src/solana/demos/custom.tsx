import React from 'react';
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, SolflareColorful } from 'pelican-web3-lib-icons';
import {
  OKXWallet,
  PhantomWallet,
  SolanaWeb3ConfigProvider,
  StandardWalletFactory,
} from 'pelican-web3-lib-solana';

const metadata_Demo: WalletMetadata = {
  icon: <SolflareColorful />,
  name: 'Demo',
  remark: 'Demo Wallet',
  app: {
    link: 'https://solflare.com/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      wallets={[
        PhantomWallet(),
        OKXWallet({
          deeplink: {
            urlTemplate: 'https://www.okx.com/download?url=${url}&ref=${ref}',
          },
          app: {
            link: 'https://www.okx.com/',
          },
        }),
        StandardWalletFactory(metadata_Demo),
      ]}
    ></SolanaWeb3ConfigProvider>
  );
};

export default App;

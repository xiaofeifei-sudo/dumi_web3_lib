// 说明：Safeheron 钱包的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful, SafeheronColorful } from 'pelican-web3-lib-icons';

export const metadata_Safeheron: WalletMetadata = {
  icon: <SafeheronColorful />,
  name: 'Safeheron',
  remark: 'Safeheron Wallet',
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/safeheron/aiaghdjafpiofpainifbgfgjfpclngoh',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

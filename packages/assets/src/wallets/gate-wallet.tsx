// 说明：Gate Wallet 的展示元数据
import type { WalletMetadata } from 'pelican-web3-lib-common';
import { ChromeCircleColorful } from 'pelican-web3-lib-icons';

export const metadata_GateWallet: WalletMetadata = {
  icon: 'https://lh3.googleusercontent.com/RjkrXU4ovz77JApt18xbtVzBF414DAtTznrZuSOa5ynqL8CstZlHCeUcPV0hAbj62rKCWwJejIfV8FYfHhCltgsL=s120',
  name: 'Gate Wallet',
  remark: 'Gate Wallet',
  app: {
    link: 'https://www.gate.io/',
  },
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://www.gate.io/',
      description: 'Access your wallet right from your favorite web browser.',
    },
  ],
};

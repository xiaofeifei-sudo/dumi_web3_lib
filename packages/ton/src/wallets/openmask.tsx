import { ChromeCircleColorful, OpenmaskCircleColorful } from 'pelican-web3-lib-icons';

import type { TonWalletMetadata } from './type';

/**
 * OpenMask 钱包元数据
 * - 包含浏览器扩展信息与展示图标
 */
export const openmask: TonWalletMetadata = {
  key: 'openmask',
  icon: <OpenmaskCircleColorful />,
  extensions: [
    {
      key: 'Chrome',
      browserIcon: <ChromeCircleColorful />,
      browserName: 'Chrome',
      link: 'https://chromewebstore.google.com/detail/penjlddjkjgpnkllboccdgccekpkcbin',
      description:
        'OpenMask is an extension for accessing TON enabled decentralized applications, or "dApps" in your browser! MetaMask analog for The Open Network.',
    },
  ],
};

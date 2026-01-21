import { metadata_OkxWallet } from 'pelican-web3-lib-assets';
import { ChromeCircleColorful } from 'pelican-web3-lib-icons';

import type { TonWalletMetadata } from './type';

/**
 * OKX TON 钱包元数据
 * - 复用通用 OKX 元数据并补充 TON 相关字段
 */
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

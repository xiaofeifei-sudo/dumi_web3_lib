import { metadata_imToken } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

/**
 * imToken 钱包工厂
 * - 使用 injected 连接器（目标 imToken）
 * - 通过 UniversalWallet 统一适配
 */
export const ImToken: EthereumWallet = (metadata) => {
  return new UniversalWallet(
    {
      ...metadata_imToken,
      ...metadata,
    },
    () =>
      injected({
        target: 'imToken',
      }),
  );
};

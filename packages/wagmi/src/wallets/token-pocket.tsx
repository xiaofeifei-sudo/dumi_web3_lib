import { metadata_TokenPocket } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

/**
 * TokenPocket 钱包工厂
 * - 使用 injected 连接器（目标 tokenPocket）
 * - 通过 UniversalWallet 统一适配
 */
export const TokenPocket: EthereumWallet = (metadata) => {
  return new UniversalWallet(
    {
      ...metadata_TokenPocket,
      ...metadata,
    },
    () => {
      return injected({
        target: 'tokenPocket',
      });
    },
  );
};

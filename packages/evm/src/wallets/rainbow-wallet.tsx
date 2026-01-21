import { metadata_RainbowWallet } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

/**
 * Rainbow Wallet 钱包工厂
 * - 使用 injected 连接器（目标 rainbow）
 * - 通过 UniversalWallet 统一适配
 */
export const RainbowWallet: EthereumWallet = (metadata) => {
  return new UniversalWallet(
    {
      ...metadata_RainbowWallet,
      ...metadata,
    },
    () =>
      injected({
        target: 'rainbow',
      }),
  );
};

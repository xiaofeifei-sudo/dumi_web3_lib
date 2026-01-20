import { metadata_OkxWallet } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

/**
 * OKX Wallet 钱包工厂
 * - 使用 injected 连接器（目标 okxWallet）
 * - 通过 UniversalWallet 统一适配
 */
export const OkxWallet: EthereumWallet = (metadata) => {
  return new UniversalWallet(
    {
      ...metadata_OkxWallet,
      ...metadata,
    },
    () =>
      injected({
        target: 'okxWallet',
      }),
  );
};

import { metadata_MetaMask } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

/**
 * MetaMask 钱包工厂
 * - 使用 wagmi 的 injected 连接器，目标为 metaMask
 * - 通过 UniversalWallet 统一适配 pelican-web3-lib
 */
export const MetaMask: EthereumWallet = (metadata) => {
  return new UniversalWallet(
    {
      ...metadata_MetaMask,
      ...metadata,
    },
    () =>
      injected({
        target: 'metaMask',
      }),
  );
};

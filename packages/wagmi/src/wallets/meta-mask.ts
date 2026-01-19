import { metadata_MetaMask } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

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

import { metadata_TokenPocket } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

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

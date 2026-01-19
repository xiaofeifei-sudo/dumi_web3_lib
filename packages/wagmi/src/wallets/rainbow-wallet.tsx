import { metadata_RainbowWallet } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

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

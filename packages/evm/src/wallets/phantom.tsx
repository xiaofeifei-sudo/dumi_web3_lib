import { metadata_Phantom } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

export const PhantomWallet: EthereumWallet = (metadata) => {
  return new UniversalWallet(
    {
      ...metadata_Phantom,
      ...metadata,
    },
    () =>
      injected({
        target: 'phantom',
      }),
  );
};


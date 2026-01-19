import { metadata_imToken } from 'pelican-web3-lib-assets';
import { injected } from 'wagmi/connectors';

import type { EthereumWallet } from '../interface';
import { UniversalWallet } from './universal-wallet';

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

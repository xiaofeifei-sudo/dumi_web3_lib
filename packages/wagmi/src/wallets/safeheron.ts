/* v8 ignore start */
import { metadata_Safeheron } from 'pelican-web3-lib-assets';
import { type Wallet } from 'pelican-web3-lib-common';
import type { Connector } from 'wagmi';

import type { EthereumWallet } from '../interface';

export const SafeheronWallet: EthereumWallet = (metadata) => {
  return {
    connectors: ['Safeheron'],
    create: (connectors?: readonly Connector[]): Wallet => {
      return {
        ...metadata_Safeheron,
        hasWalletReady: async () => {
          return !!(await connectors?.[0]?.getProvider());
        },
        hasExtensionInstalled: async () => {
          return !!(await connectors?.[0]?.getProvider());
        },
        ...metadata,
      };
    },
  };
};

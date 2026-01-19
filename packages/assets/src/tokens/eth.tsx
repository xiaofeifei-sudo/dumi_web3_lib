import type { Token } from 'pelican-web3-lib-common';
import { EthereumColorful } from 'pelican-web3-lib-icons';

import { BSC, Mainnet } from '../chains/ethereum';

export const ETH: Token = {
  name: 'Ethereum',
  symbol: 'ETH',
  decimal: 18,
  icon: <EthereumColorful />,
  availableChains: [
    {
      chain: Mainnet,
    },
    {
      chain: BSC,
      contract: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    },
  ],
};

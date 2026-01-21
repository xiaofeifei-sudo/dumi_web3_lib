// 说明：ETH 代币元数据（EVM 主网原生资产）
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
      // 以太坊主网（无需合约地址）
      chain: Mainnet,
    },
    {
      // BSC 上的跨链映射合约地址
      chain: BSC,
      contract: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    },
  ],
};

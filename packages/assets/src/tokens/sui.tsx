// 说明：SUI 代币元数据（Sui 链原生资产）
import type { Token } from 'pelican-web3-lib-common';
import { SuiColorful } from 'pelican-web3-lib-icons';

export const SUI: Token = {
  name: 'Sui',
  symbol: 'SUI',
  decimal: 9,
  icon: <SuiColorful />,
  availableChains: [],
};

import { metadata_BinanceWallet } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';

// Binance Tron 钱包的展示信息元数据
export const BinanceWallet: WalletMetadata = {
  ...metadata_BinanceWallet,
  key: 'binanceTronWallet',
  group: 'Popular',
  supportSwitchChain: false,
};

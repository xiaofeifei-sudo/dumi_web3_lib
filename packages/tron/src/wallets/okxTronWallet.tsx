/* v8 ignore start */
import { metadata_OkxWallet } from 'pelican-web3-lib-assets';
import type { WalletMetadata } from 'pelican-web3-lib-common';

// OKX Tron 钱包的展示信息元数据
export const OkxTronWallet: WalletMetadata = {
  ...metadata_OkxWallet,
  key: 'okxTronWallet',
  group: 'Popular',
  supportSwitchChain: false,
};

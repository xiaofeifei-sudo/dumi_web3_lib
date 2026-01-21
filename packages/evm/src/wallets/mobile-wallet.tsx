import { metadata_MobileConnect } from 'pelican-web3-lib-assets';

import { WalletConnect, type EthereumWalletConnect } from './wallet-connect';

/**
 * MobileWallet
 * 移动端通用 WalletConnect 工厂（基于 WalletConnect）
 */
export const MobileWallet: EthereumWalletConnect = (metadata) => {
  return WalletConnect({
    ...metadata_MobileConnect,
    ...metadata,
  });
};

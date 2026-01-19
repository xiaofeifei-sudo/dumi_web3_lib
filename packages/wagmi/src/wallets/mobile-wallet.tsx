import { metadata_MobileConnect } from 'pelican-web3-lib-assets';

import { WalletConnect, type EthereumWalletConnect } from './wallet-connect';

export const MobileWallet: EthereumWalletConnect = (metadata) => {
  return WalletConnect({
    ...metadata_MobileConnect,
    ...metadata,
  });
};

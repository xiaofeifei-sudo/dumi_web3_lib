import React from 'react';
import { message } from 'antd';
import type { Wallet } from 'pelican-web3-lib';
import { ConnectButton } from 'pelican-web3-lib';
import {
  metadata_MetaMask,
  metadata_TokenPocket,
  metadata_WalletConnect,
} from 'pelican-web3-lib-assets';

const App: React.FC = () => {
  return (
    <ConnectButton
      availableWallets={[
        {
          ...metadata_MetaMask,
          hasExtensionInstalled: async () => true,
        },
        {
          ...metadata_WalletConnect,
          getQrCode: async () => {
            return {
              uri: 'http://example.com',
            };
          },
        },
        {
          ...metadata_TokenPocket,
          hasExtensionInstalled: async () => true,
          getQrCode: async () => {
            return {
              uri: 'http://example.com',
            };
          },
        },
      ]}
      onConnectClick={(wallet?: Wallet) => {
        message.info(`Connect with ${wallet?.name || 'More'}`);
      }}
      quickConnect
    />
  );
};

export default App;

import React from 'react';
import { createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Suiet, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

const App: React.FC = () => {
  return (
    <SuiWeb3ConfigProvider
      wallets={[Suiet()]}
      balance
      networkConfig={networkConfig}
      defaultNetwork="testnet"
    ></SuiWeb3ConfigProvider>
  );
};

export default App;

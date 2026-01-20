import React from 'react';
import { WagmiWeb3ConfigProvider, MetaMask, TokenPocket, OkxWallet } from 'pelican-web3-lib-wagmi';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider wallets={[MetaMask(), TokenPocket(), OkxWallet()]}></WagmiWeb3ConfigProvider>
  );
};

export default App;

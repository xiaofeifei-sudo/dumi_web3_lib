import React from 'react';
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  OkxWallet,
  RainbowWallet,
  CoinbaseWallet,
  TokenPocket,
} from 'pelican-web3-lib-wagmi';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      wallets={[MetaMask(), OkxWallet(), RainbowWallet(), CoinbaseWallet(), TokenPocket()]}
    ></WagmiWeb3ConfigProvider>
  );
};

export default App;

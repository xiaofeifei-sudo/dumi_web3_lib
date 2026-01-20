import React from 'react';
import {
  CoinbaseWallet,
  OKXWallet,
  PhantomWallet,
  SolanaWeb3ConfigProvider,
  SolflareWallet,
} from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      wallets={[CoinbaseWallet(), PhantomWallet(), SolflareWallet(), OKXWallet()]}
    ></SolanaWeb3ConfigProvider>
  );
};

export default App;

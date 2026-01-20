import React from 'react';
import { CoinbaseWallet, PhantomWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      wallets={[CoinbaseWallet(), PhantomWallet()]}
    ></SolanaWeb3ConfigProvider>
  );
};

export default App;

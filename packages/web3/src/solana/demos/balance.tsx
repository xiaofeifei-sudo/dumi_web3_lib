import React from 'react';
import { CoinbaseWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return <SolanaWeb3ConfigProvider balance wallets={[CoinbaseWallet()]}></SolanaWeb3ConfigProvider>;
};

export default App;

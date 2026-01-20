import React from 'react';
import {
  OKXWallet,
  PhantomWallet,
  SolanaWeb3ConfigProvider,
  WalletConnectWallet,
} from 'pelican-web3-lib-solana';

const rpcProvider = () => `https://api.zan.top/node/v1/solana/mainnet/${YOUR_ZAN_API_KEY}`;

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      autoAddRegisteredWallets
      balance
      rpcProvider={rpcProvider}
      wallets={[PhantomWallet(), OKXWallet(), WalletConnectWallet()]}
      walletConnect={{ projectId: YOUR_WALLET_CONNECT_PROJECT_ID }}
    ></SolanaWeb3ConfigProvider>
  );
};

export default App;

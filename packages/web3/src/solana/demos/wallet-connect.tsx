import React from 'react';
import { SolanaWeb3ConfigProvider, WalletConnectWallet } from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      wallets={[WalletConnectWallet()]}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
    ></SolanaWeb3ConfigProvider>
  );
};

export default App;

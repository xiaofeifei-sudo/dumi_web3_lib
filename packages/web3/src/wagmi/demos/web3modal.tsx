import React from 'react';
import { WagmiWeb3ConfigProvider, WalletConnect } from 'pelican-web3-lib-wagmi';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      wallets={[WalletConnect({ useWalletConnectOfficialModal: true })]}
      walletConnect={{
        projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
        useWalletConnectOfficialModal: true,
      }}
    ></WagmiWeb3ConfigProvider>
  );
};

export default App;

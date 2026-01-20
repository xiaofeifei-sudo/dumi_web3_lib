import React from 'react';
import { Space } from 'antd';
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  TokenPocket,
  OkxWallet,
  WalletConnect,
  Mainnet,
} from 'pelican-web3-lib-wagmi';
import { QueryClient } from '@tanstack/react-query';
import { http } from 'wagmi';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
       eip6963={{
        autoAddInjectedWallets: true,
      }}
      ens
      balance
      chains={[Mainnet]}
      wallets={[MetaMask(), TokenPocket(), OkxWallet(), WalletConnect({ useWalletConnectOfficialModal: false }),]}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
      transports={{
        [Mainnet.id]: http(),
      }}
      queryClient={queryClient}
    >
      <Space direction="vertical">
        <Connector>
          <ConnectButton quickConnect />
        </Connector>
      </Space>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

import React from 'react';
import {Space} from 'antd';
import {CoinbaseWallet, Mainnet, MetaMask, OkxWallet, PhantomWallet, Sepolia, TokenPocket, WagmiWeb3ConfigProvider, WalletConnect,} from 'pelican-web3-lib-evm';
import {QueryClient} from '@tanstack/react-query';
import {http} from 'wagmi';
import Connector from '../../components/Connector';
import {ConnectButton} from '../../components/connect-button';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      ens
      balance
      chains={[Sepolia]}
      wallets={[
        MetaMask(),
        TokenPocket(),
        OkxWallet(),
        CoinbaseWallet(),
        PhantomWallet(),
        WalletConnect()
      ]}
      walletConnect={
        {
                      projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
                      useWalletConnectOfficialModal: false,
                    }
      }
      transports={{
        [Sepolia.id]: http(),
      }}
      queryClient={queryClient}
    >
      <Space direction="vertical">
        <Connector>
          <ConnectButton quickConnect/>
        </Connector>
      </Space>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

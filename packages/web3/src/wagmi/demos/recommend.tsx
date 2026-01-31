import React from 'react';
import {Space} from 'antd';
import {CoinbaseWallet, Mainnet, MetaMask, OkxWallet, Sepolia, TokenPocket, WagmiWeb3ConfigProvider, WalletConnect,} from 'pelican-web3-lib-evm';
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
      chains={[Mainnet, Sepolia]}
      wallets={[
        MetaMask(),
        TokenPocket(),
        OkxWallet(),
        CoinbaseWallet(),
      ]}
      walletConnect={
        {
                      projectId: "516c0404ce78defabd49030fb0c95b22",
                      useWalletConnectOfficialModal: true,
                    }
      }
      transports={{
        [Mainnet.id]: http(),
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

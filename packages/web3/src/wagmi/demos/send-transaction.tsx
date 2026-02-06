import React from 'react';
import { Space } from 'antd';
import { WagmiWeb3ConfigProvider, Mainnet, MetaMask, Sepolia, WalletConnect } from 'pelican-web3-lib-evm';
import { http } from 'wagmi';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';
import SendTransactionWidget from '../widgets/send-transaction-widget';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      reconnectOnMount={true}
      chains={[Sepolia, Mainnet]}
      wallets={[MetaMask(),WalletConnect() ]}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
      balance
      transports={{
        [Sepolia.id]: http(),
        [Mainnet.id]: http(),
      }}
    >
      <Space direction="vertical">
        <Connector>
          <ConnectButton quickConnect />
        </Connector>
        <SendTransactionWidget initialAmount={0.001} amountStep={0.001} />
      </Space>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

import React from 'react';
import { Space } from 'antd';
import {
  WagmiWeb3ConfigProvider,
  Mainnet,
  Sepolia,
  MetaMask,
  WalletConnect,
  USDT,
} from 'pelican-web3-lib-evm';
import { http } from 'wagmi';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      ens
      balance
      token={USDT}
      chains={[ Sepolia]}
      wallets={[MetaMask(), WalletConnect()]}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
      transports={{
        [Mainnet.id]: http(),
        [Sepolia.id]: http(),
      }}
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

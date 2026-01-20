import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import {
  WagmiWeb3ConfigProvider,
  Mainnet,
  MetaMask,
  WalletConnect,
} from 'pelican-web3-lib-wagmi';
import { createConfig, http } from 'wagmi';
import { injected, walletConnect as wagmiWalletConnect } from 'wagmi/connectors';
import { mainnet } from 'wagmi/chains';
import { Space } from 'antd';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const config = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
  connectors: [
    wagmiWalletConnect({ projectId: YOUR_WALLET_CONNECT_PROJECT_ID, showQrModal: false }),
    injected({ target: 'metaMask' }),
  ],
});

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      config={config}
      queryClient={new QueryClient()}
      chains={[Mainnet]}
      wallets={[MetaMask(), WalletConnect({ useWalletConnectOfficialModal: true })]}
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

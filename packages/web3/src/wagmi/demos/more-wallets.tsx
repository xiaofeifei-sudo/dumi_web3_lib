import React from 'react';
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  OkxWallet,
  CoinbaseWallet,
  TokenPocket,
  MobileWallet,
  WalletConnect,
  ImToken,
} from 'pelican-web3-lib-evm';
import { ConnectButton } from '../../components/connect-button';
import Connector from '../../components/Connector';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
      wallets={[
        MetaMask(),
        TokenPocket({
          group: 'Popular',
        }),
        MobileWallet({
          group: 'Popular',
        }),
        WalletConnect(),
        CoinbaseWallet(
          {},
          {
            appName: 'ant.design.web3',
            jsonRpcUrl: `https://api.zan.top/node/v1/eth/mainnet/${YOUR_ZAN_API_KEY}`,
          },
        ),
        OkxWallet(),
        ImToken(),
      ]}
    >
      <Connector
      >
        <ConnectButton quickConnect />
      </Connector>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

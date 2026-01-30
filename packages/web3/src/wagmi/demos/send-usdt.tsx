import React from 'react';
import { Space } from 'antd';
import { WagmiWeb3ConfigProvider, Mainnet, MetaMask, Sepolia, USDT, WalletConnect, MobileWallet, ImToken, RainbowWallet, SafeheronWallet } from 'pelican-web3-lib-evm';
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
      balance
      chains={[Sepolia, Mainnet]}
      wallets={[MetaMask(), WalletConnect(), MobileWallet(), ImToken(), RainbowWallet(), SafeheronWallet()]}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
      transports={{
        [Sepolia.id]: http(),
        [Mainnet.id]: http(),
      }}
      token={USDT}
    >
      <Space direction="vertical">
        <Connector>
          <ConnectButton quickConnect />
        </Connector>
        <SendTransactionWidget
          token={USDT}
          title="Send USDT (ERC-20) on Mainnet:"
          buttonText="Send USDT"
          amountStep={1}
          initialAmount={1}
        />
      </Space>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

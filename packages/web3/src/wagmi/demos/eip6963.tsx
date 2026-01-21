import React from 'react';
import { WagmiWeb3ConfigProvider, Mainnet } from 'pelican-web3-lib-evm';
import { Space } from 'antd';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const App: React.FC = () => {
  return <WagmiWeb3ConfigProvider eip6963={{
    autoAddInjectedWallets: true,
  }} chains={[Mainnet]}>
    <Space direction="vertical">
        <Connector>
          <ConnectButton quickConnect />
        </Connector>
      </Space>

  </WagmiWeb3ConfigProvider>;
};

export default App;

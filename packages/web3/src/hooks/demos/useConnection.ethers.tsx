import React from 'react';
import { Button, Space } from 'antd';
import { useAccount, useConnection, useProvider } from 'pelican-web3-lib';
import { EthersWeb3ConfigProvider, MetaMask } from 'pelican-web3-lib-ethers';

const Demo: React.FC = () => {
  const { account } = useAccount();
  const { connect, disconnect } = useConnection();
  const { availableWallets } = useProvider();
  return (
    <Space direction="vertical">
      <Button
        onClick={() => {
          if (account) {
            disconnect?.();
            return;
          }
          const target = (availableWallets ?? [])[0];
          if (target) {
            connect?.(target);
          }
        }}
      >
        {account ? 'Disconnect' : 'Connect'}
      </Button>
      {account ? <div>{account.address}</div> : <div>Not Connected</div>}
    </Space>
  );
};

const App: React.FC = () => {
  return (
    <EthersWeb3ConfigProvider wallets={[MetaMask()]}>
      <Demo />
    </EthersWeb3ConfigProvider>
  );
};

export default App;

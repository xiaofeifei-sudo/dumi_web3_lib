import React from 'react';
import { Button, Space } from 'antd';
import { useAccount, useConnection, useProvider } from 'pelican-web3-lib';
import { EthWeb3jsConfigProvider } from 'pelican-web3-lib-eth-web3js';
import { MetaMask } from 'pelican-web3-lib-eth-web3js';

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
    <EthWeb3jsConfigProvider wallets={[MetaMask()]}>
      <Demo />
    </EthWeb3jsConfigProvider>
  );
};

export default App;

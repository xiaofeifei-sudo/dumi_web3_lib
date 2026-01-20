import React from 'react';
import { Button, Space } from 'antd';
import { useAccount, useConnection } from 'pelican-web3-lib';
import { BitcoinWeb3ConfigProvider, XverseWallet } from 'pelican-web3-lib-bitcoin';

const Demo: React.FC = () => {
  const { account } = useAccount();
  const { connect, disconnect } = useConnection();
  return (
    <Space direction="vertical">
      <Button
        onClick={() => {
          if (account) {
            disconnect?.();
            return;
          }
          connect?.();
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
    <BitcoinWeb3ConfigProvider wallets={[XverseWallet()]} balance>
      <Demo />
    </BitcoinWeb3ConfigProvider>
  );
};

export default App;


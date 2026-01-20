import React from 'react';
import { Button, Space } from 'antd';
import { useAccount, useConnection } from 'pelican-web3-lib';
import { SuiWeb3ConfigProvider, Suiet } from 'pelican-web3-lib-sui';

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
    <SuiWeb3ConfigProvider wallets={[Suiet()]}>
      <Demo />
    </SuiWeb3ConfigProvider>
  );
};

export default App;


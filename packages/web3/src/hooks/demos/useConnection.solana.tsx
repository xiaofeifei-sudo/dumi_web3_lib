import React from 'react';
import { Button, Space } from 'antd';
import { useAccount, useConnection } from 'pelican-web3-lib';
import { PhantomWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

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
    <SolanaWeb3ConfigProvider wallets={[PhantomWallet()]}>
      <Demo />
    </SolanaWeb3ConfigProvider>
  );
};

export default App;


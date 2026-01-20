import React from 'react';
import { Button, Space } from 'antd';
import { useAccount, useConnection } from 'pelican-web3-lib';
import { TronWeb3ConfigProvider, TronlinkWallet, OkxTronWallet, BybitWallet } from 'pelican-web3-lib-tron';

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
    <TronWeb3ConfigProvider wallets={[TronlinkWallet, OkxTronWallet, BybitWallet]}>
      <Demo />
    </TronWeb3ConfigProvider>
  );
};

export default App;

import React from 'react';
import { Button } from 'antd';
import { useAccount, useConnection } from 'pelican-web3-lib';
import { PhantomWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

const Demo: React.FC = () => {
  const { account } = useAccount();
  const { connect, disconnect } = useConnection();
  return (
    <>
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
      {account ? <p>Account: {account?.address}</p> : <p>Not Connected</p>}
    </>
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

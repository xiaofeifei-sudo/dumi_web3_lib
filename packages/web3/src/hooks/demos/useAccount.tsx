import React from 'react';
import { Space } from 'antd';
import { useAccount } from 'pelican-web3-lib';

const App: React.FC = () => {
  const { account } = useAccount();
  if (!account) {
    return <div>Not Connected</div>;
  }
  return <Space direction="vertical">{account.address}</Space>;
};

export default App;

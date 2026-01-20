import React from 'react';
import { Space } from 'antd';
import { Suiet, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';

const App: React.FC = () => {
  return (
    <SuiWeb3ConfigProvider wallets={[Suiet()]}>
      <Space></Space>
    </SuiWeb3ConfigProvider>
  );
};

export default App;

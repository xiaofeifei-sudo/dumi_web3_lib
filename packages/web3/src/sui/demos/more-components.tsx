import React from 'react';
import { Space } from 'antd';
import { Suiet, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';

const App: React.FC = () => {
  return (
    <SuiWeb3ConfigProvider wallets={[Suiet()]}>
      <Space>
        {/* <NFTCard address="0x110e5f6b7113ac27cad69b561d0cc595f6b875d07d2d8714e439bb73059aa6f8" />
        <NFTImage address="0x110e5f6b7113ac27cad69b561d0cc595f6b875d07d2d8714e439bb73059aa6f8" /> */}
      </Space>
    </SuiWeb3ConfigProvider>
  );
};

export default App;

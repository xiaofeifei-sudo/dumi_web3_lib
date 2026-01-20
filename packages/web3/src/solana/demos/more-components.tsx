import React from 'react';
import { Space } from 'antd';
import { CoinbaseWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      rpcProvider={() => `https://api.zan.top/node/v1/solana/mainnet/${YOUR_ZAN_API_KEY}`}
      wallets={[CoinbaseWallet()]}
    >
      <Space direction="vertical"></Space>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;

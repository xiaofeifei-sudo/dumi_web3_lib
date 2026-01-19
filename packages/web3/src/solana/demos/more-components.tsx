import React from 'react';
import { Space } from 'antd';
import { Address, BrowserLink, NFTCard } from 'pelican-web3-lib';
import { CoinbaseWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      rpcProvider={() => `https://api.zan.top/node/v1/solana/mainnet/${YOUR_ZAN_API_KEY}`}
      wallets={[CoinbaseWallet()]}
    >
      <Space direction="vertical">
        <BrowserLink address="GNyDA4Z7vgTzi35qRFHBa4BDjZiugycWhNGWgcJcxiMo" ellipsis />
        <Address address="GNyDA4Z7vgTzi35qRFHBa4BDjZiugycWhNGWgcJcxiMo" ellipsis />
        <NFTCard address="GNyDA4Z7vgTzi35qRFHBa4BDjZiugycWhNGWgcJcxiMo" tokenId={3332} />
      </Space>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;

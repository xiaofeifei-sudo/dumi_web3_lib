import React from 'react';
import { WagmiWeb3ConfigProvider, Mainnet, Optimism, Polygon, Arbitrum, Base, BSC } from 'pelican-web3-lib-wagmi';

const App: React.FC = () => {
  return <WagmiWeb3ConfigProvider balance={false} chains={[Mainnet, Optimism, Polygon, Arbitrum, Base, BSC]}></WagmiWeb3ConfigProvider>;
};

export default App;

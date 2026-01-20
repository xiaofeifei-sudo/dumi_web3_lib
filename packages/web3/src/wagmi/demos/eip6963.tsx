import React from 'react';
import { WagmiWeb3ConfigProvider, Mainnet } from 'pelican-web3-lib-wagmi';

const App: React.FC = () => {
  return <WagmiWeb3ConfigProvider eip6963 chains={[Mainnet]}></WagmiWeb3ConfigProvider>;
};

export default App;

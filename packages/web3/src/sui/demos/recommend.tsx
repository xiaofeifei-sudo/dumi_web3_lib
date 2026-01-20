import React from 'react';
import { Slush, Suiet, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';

const App: React.FC = () => {
  return (
    <SuiWeb3ConfigProvider balance autoConnect wallets={[Suiet(), Slush()]}></SuiWeb3ConfigProvider>
  );
};

export default App;

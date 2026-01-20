import React from 'react';
import { Web3ConfigProvider } from 'pelican-web3-lib';

const App: React.FC = () => {
  return (
    <Web3ConfigProvider
      locale={{
        ConnectButton: {
          connect: 'CONNECT',
        },
      }}
    ></Web3ConfigProvider>
  );
};

export default App;

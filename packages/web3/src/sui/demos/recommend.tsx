import React from 'react';
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { Slush, Suiet, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';

const App: React.FC = () => {
  return (
    <SuiWeb3ConfigProvider balance autoConnect wallets={[Suiet(), Slush()]}>
      <Connector modalProps={{ mode: 'simple', group: false }}>
        <ConnectButton quickConnect />
      </Connector>
    </SuiWeb3ConfigProvider>
  );
};

export default App;

import React from 'react';
import { Slush, Suiet, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

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

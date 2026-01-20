import React from 'react';
import { SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

export default function App() {
  return (
    <SolanaWeb3ConfigProvider autoAddRegisteredWallets>
      <Connector>
        <ConnectButton />
      </Connector>
    </SolanaWeb3ConfigProvider>
  );
}

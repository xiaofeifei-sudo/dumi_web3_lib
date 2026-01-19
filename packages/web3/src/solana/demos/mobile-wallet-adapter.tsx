import React from 'react';
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

export default function App() {
  return (
    <SolanaWeb3ConfigProvider autoAddRegisteredWallets>
      <Connector>
        <ConnectButton />
      </Connector>
    </SolanaWeb3ConfigProvider>
  );
}

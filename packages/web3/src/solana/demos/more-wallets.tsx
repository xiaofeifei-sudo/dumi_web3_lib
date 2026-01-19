import React from 'react';
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  CoinbaseWallet,
  OKXWallet,
  PhantomWallet,
  SolanaWeb3ConfigProvider,
  SolflareWallet,
} from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      wallets={[CoinbaseWallet(), PhantomWallet(), SolflareWallet(), OKXWallet()]}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;

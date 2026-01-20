import React from 'react';
import {
  CoinbaseWallet,
  OKXWallet,
  PhantomWallet,
  SolanaWeb3ConfigProvider,
  SolflareWallet,
} from 'pelican-web3-lib-solana';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';


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

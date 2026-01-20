import React from 'react';
import { PhantomWallet, SolanaWeb3ConfigProvider, TipLinkWallet } from 'pelican-web3-lib-solana';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const App: React.FC = () => {
  return (
     <SolanaWeb3ConfigProvider
      wallets={[
        PhantomWallet(),
        TipLinkWallet({
          clientId: YOUR_TIPLINK_CLIENT_ID,
          theme: 'system',
          title: 'Ant Design Web3',
          hideDraggableWidget: true,
        }),
      ]}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;

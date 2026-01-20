import React from 'react';
import { WagmiWeb3ConfigProvider, UniversalWallet } from 'pelican-web3-lib-wagmi';
import { injected } from 'wagmi/connectors';

const Custom = () =>
  new UniversalWallet(
    {
      key: 'my-wallet',
      name: 'My Wallet',
      remark: 'Custom wallet',
    },
    () =>
      injected({
        target: 'metaMask',
      }),
  );

const App: React.FC = () => {
  return <WagmiWeb3ConfigProvider wallets={[Custom()]}></WagmiWeb3ConfigProvider>;
};

export default App;

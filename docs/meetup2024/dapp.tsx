import {
  Base,
  MetaMask,
  OkxWallet,
  TokenPocket,
  WagmiWeb3ConfigProvider,
  WalletConnect,
} from 'pelican-web3-lib-evm';

import SBT from './sbt';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      wallets={[
        MetaMask(),
        WalletConnect(),
        TokenPocket({
          group: 'Popular',
        }),
        OkxWallet(),
      ]}
      chains={[Base]}
    >
      <SBT />
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

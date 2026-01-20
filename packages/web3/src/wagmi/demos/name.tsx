import React from 'react';
import { WagmiWeb3ConfigProvider, MetaMask, Mainnet } from 'pelican-web3-lib-wagmi';
import { useAccount, useEnsName, useBalance } from 'wagmi';

const Info: React.FC = () => {
  const { address } = useAccount();
  const { data: ens } = useEnsName({ address, chainId: Mainnet.wagmiChain?.id });
  const { data: balance } = useBalance({ address });
  return (
    <div>
      <div>ENS: {ens ?? '-'}</div>
      <div>Balance: {balance?.formatted ?? '-'}</div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider balance ens wallets={[MetaMask()]}>
      <Info />
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

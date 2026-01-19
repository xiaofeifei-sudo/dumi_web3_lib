import { ConnectButton, Connector } from 'pelican-web3-lib';
import { MetaMask, WagmiWeb3ConfigProvider } from 'pelican-web3-lib-wagmi';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider eip6963 ens balance wallets={[MetaMask()]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

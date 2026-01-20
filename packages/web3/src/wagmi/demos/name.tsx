import { WagmiWeb3ConfigProvider, MetaMask } from "pelican-web3-lib-wagmi";
import Connector from "../../components/Connector";
import { ConnectButton } from "../../components/connect-button";


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

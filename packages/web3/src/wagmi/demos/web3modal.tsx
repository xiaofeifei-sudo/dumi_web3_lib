import { WagmiWeb3ConfigProvider, MetaMask, WalletConnect } from "pelican-web3-lib-evm";
import Connector from "../../components/Connector";
import { ConnectButton } from "../../components/connect-button";


const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      wallets={[MetaMask(), WalletConnect()]}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
        useWalletConnectOfficialModal: true,
      }}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

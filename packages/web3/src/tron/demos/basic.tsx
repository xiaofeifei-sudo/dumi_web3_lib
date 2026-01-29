import {
  TronWeb3ConfigProvider,
  TronlinkWallet,
  BybitWallet,
  OkxTronWallet,
  WalletConnectWallet,
  TokenPocketWallet,
  TrustWallet,
  ImTokenWallet,
  MetaMaskTronWallet,
  LedgerWallet,
} from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';


const Basic = () => {
  return (
    <TronWeb3ConfigProvider
      autoConnect={false}
      wallets={[
        TronlinkWallet,
        BybitWallet,
        OkxTronWallet,
        LedgerWallet,
        TokenPocketWallet,
        TrustWallet,
        ImTokenWallet,
        MetaMaskTronWallet,
        WalletConnectWallet,
      ]}
      walletConnect={{
        network: 'Nile',
        options: {
          projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
        },
      }}
      onError={(error)=>console.error("TronWeb3ConfigProvider error:", error)}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default Basic;

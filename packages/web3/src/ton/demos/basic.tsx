import { ConnectButton } from "../../components/connect-button";
import Connector from "../../components/Connector";
import { okxTonWallet, tonkeeper, TonWeb3ConfigProvider } from 'pelican-web3-lib-ton';



const Basic = () => {
  return (
    <TonWeb3ConfigProvider wallets={[tonkeeper, okxTonWallet, { key: 'safepalwallet' }]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </TonWeb3ConfigProvider>
  );
};

export default Basic;

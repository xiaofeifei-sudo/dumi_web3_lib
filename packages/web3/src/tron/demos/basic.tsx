import { TronWeb3ConfigProvider, TronlinkWallet, BybitWallet, OkxTronWallet } from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';


const Basic = () => {
  return (
    <TronWeb3ConfigProvider wallets={[TronlinkWallet, BybitWallet, OkxTronWallet]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default Basic;

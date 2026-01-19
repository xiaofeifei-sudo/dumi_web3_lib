import { ConnectButton, Connector } from 'pelican-web3-lib';
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

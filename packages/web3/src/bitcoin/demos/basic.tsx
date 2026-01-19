import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  BitcoinWeb3ConfigProvider,
  OkxWallet,
  PhantomWallet,
  UnisatWallet,
  XverseWallet,
} from 'pelican-web3-lib-bitcoin';

/**
 * The main application component that sets up the BitcoinWeb3ConfigProvider and Connector.
 * @returns {JSX.Element} The rendered application component.
 */
const App: React.FC = () => {
  return (
    <BitcoinWeb3ConfigProvider
      wallets={[XverseWallet(), UnisatWallet(), OkxWallet(), PhantomWallet()]}
    >
      <Connector
        modalProps={{
          group: false,
          mode: 'simple',
        }}
      >
        <ConnectButton />
      </Connector>
    </BitcoinWeb3ConfigProvider>
  );
};

export default App;

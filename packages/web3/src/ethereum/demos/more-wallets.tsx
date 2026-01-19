import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  CoinbaseWallet,
  ImToken,
  MetaMask,
  MobileWallet,
  OkxWallet,
  TokenPocket,
  WagmiWeb3ConfigProvider,
  WalletConnect,
} from 'pelican-web3-lib-wagmi';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
      wallets={[
        MetaMask(),
        TokenPocket({
          group: 'Popular',
        }),
        MobileWallet({
          group: 'Popular',
        }),
        WalletConnect(),
        CoinbaseWallet(
          {},
          {
            appName: 'ant.design.web3',
            jsonRpcUrl: `https://api.zan.top/node/v1/eth/mainnet/${YOUR_ZAN_API_KEY}`,
          },
        ),
        OkxWallet(),
        ImToken(),
      ]}
    >
      <Connector
        modalProps={{
          footer: (
            <div>
              Powered By <a href="https://web3.ant.design">Ant Design Web3</a>
            </div>
          ),
        }}
      >
        <ConnectButton />
      </Connector>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

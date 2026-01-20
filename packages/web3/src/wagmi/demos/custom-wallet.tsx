import React from 'react';
import { WagmiWeb3ConfigProvider, UniversalWallet, TokenPocket, MetaMask } from 'pelican-web3-lib-wagmi';
import { injected } from 'wagmi/connectors';
import { EthereumCircleColorful } from 'pelican-web3-lib-icons';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';


const App: React.FC = () => {
  return <WagmiWeb3ConfigProvider 
  eip6963
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
      wallets={[
        new UniversalWallet(
          {
            name: 'TestWallet',
            remark: 'My TestWallet',
            icon: <EthereumCircleColorful />,
            extensions: [],
            group: 'Popular',
          },
          () => {
            return injected({
              target() {
                return {
                  id: 'testWallet',
                  name: 'TestWallet',
                  provider: typeof window !== 'undefined' && window.ethereum,
                };
              },
            });
          },
        ),
        TokenPocket({
          group: 'Popular',
        }),
        MetaMask({
          group: 'More',
        }),
      ]} 
  >
    <Connector>
        <ConnectButton />
      </Connector>

  </WagmiWeb3ConfigProvider>;
};

export default App;

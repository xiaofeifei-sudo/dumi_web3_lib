import React from 'react';
import { WagmiWeb3ConfigProvider, Mainnet, Optimism, Polygon, Arbitrum, Base, BSC, Hardhat, Localhost, MetaMask, WalletConnect, X1Testnet, Sepolia, Holesky, BSCTestNet, Avalanche, Scroll, ScrollSepolia } from 'pelican-web3-lib-evm';
import { http } from 'viem';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
      }}
      eip6963
      transports={{
        [Mainnet.id]: http(),
        [Polygon.id]: http(),
        [Arbitrum.id]: http(),
        [Optimism.id]: http(),
        [Avalanche.id]: http(),
        [Scroll.id]: http(),
        [ScrollSepolia.id]: http(),
        [Sepolia.id]: http(),
        [Holesky.id]: http(),
        [X1Testnet.id]: http(),
        [Hardhat.id]: http(),
        [Localhost.id]: http(),
        [BSC.id]: http(),
        [BSCTestNet.id]: http(),
      }}
      balance
      wallets={[MetaMask(), WalletConnect()]}
      chains={[Mainnet, Sepolia, Holesky, Polygon, Arbitrum, Optimism, Avalanche, Base, Scroll, ScrollSepolia, BSC, BSCTestNet, X1Testnet, Hardhat, Localhost]}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

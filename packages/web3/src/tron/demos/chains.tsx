import React, { useState } from 'react';
import {
  TronWeb3ConfigProvider,
  TronlinkWallet,
  BybitWallet,
  OkxTronWallet,
  TokenPocketWallet,
  TrustWallet,
  ImTokenWallet,
  MetaMaskTronWallet,
  WalletConnectWallet,
} from 'pelican-web3-lib-tron';
import type { TronChain } from 'pelican-web3-lib-assets';
import { TronMainnet, TronShastaNet, TronNileNet } from 'pelican-web3-lib-assets';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const Chains: React.FC = () => {
  const [currentChain, setCurrentChain] = useState(TronMainnet);
  const chains = [TronMainnet, TronShastaNet, TronNileNet];

  return (
    <TronWeb3ConfigProvider
      autoConnect={false}
      wallets={[
        TronlinkWallet,
        BybitWallet,
        OkxTronWallet,
        TokenPocketWallet,
        TrustWallet,
        ImTokenWallet,
        MetaMaskTronWallet,
        WalletConnectWallet,
      ]}
    >
      <Connector
        availableChains={chains}
        chain={currentChain}
        switchChain={async (c: any) => {
          setCurrentChain(c);
        }}
        modalProps={{
          mode: 'simple',
        }}
      >
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default Chains;

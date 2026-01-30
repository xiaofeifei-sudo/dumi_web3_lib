import React, { useState } from 'react';
import {
  TronWeb3ConfigProvider,
  TronlinkWallet,
  OkxTronWallet,
  TokenPocketWallet,
  TrustWallet,
  MetaMaskTronWallet,
} from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const Chains: React.FC = () => {

  return (
    <TronWeb3ConfigProvider
      autoConnect={false}
      wallets={[
        TronlinkWallet,
        OkxTronWallet,
        TokenPocketWallet,
        TrustWallet,
        MetaMaskTronWallet,
      ]}
    >
      <Connector
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

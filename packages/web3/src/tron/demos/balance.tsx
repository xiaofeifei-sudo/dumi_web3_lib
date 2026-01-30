import React from 'react';
import {  LedgerWallet, MetaMaskTronWallet, OkxTronWallet, TokenPocketWallet, TronWeb3ConfigProvider, TronlinkWallet, TrustWallet } from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const BalanceDemo: React.FC = () => {
  return (
    <TronWeb3ConfigProvider autoConnect={false} balance 
      wallets={[
        TronlinkWallet,
        OkxTronWallet,
        LedgerWallet,
        TokenPocketWallet,
        TrustWallet,
        MetaMaskTronWallet,
      ]}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default BalanceDemo;

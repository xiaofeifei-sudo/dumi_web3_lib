import React from 'react';
import { TronWeb3ConfigProvider, TronlinkWallet } from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const BalanceDemo: React.FC = () => {
  return (
    <TronWeb3ConfigProvider autoConnect={false} balance wallets={[TronlinkWallet]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default BalanceDemo;

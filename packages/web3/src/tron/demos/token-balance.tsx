import React from 'react';
import { TronWeb3ConfigProvider, TronlinkWallet, USDT } from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';
import { TronNileNet } from 'pelican-web3-lib-assets';

const TokenBalanceDemo: React.FC = () => {
  return (
    <TronWeb3ConfigProvider autoConnect={false} balance token={USDT} initialChain={TronNileNet} wallets={[TronlinkWallet]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default TokenBalanceDemo;

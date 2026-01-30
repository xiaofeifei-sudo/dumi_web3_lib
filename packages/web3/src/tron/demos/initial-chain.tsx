import React from 'react';
import {
  TronWeb3ConfigProvider,
  TronlinkWallet,
  OkxTronWallet,
  LedgerWallet,
  TokenPocketWallet,
  TrustWallet,
  MetaMaskTronWallet,
} from 'pelican-web3-lib-tron';
import { TronNileNet } from 'pelican-web3-lib-assets';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';
import useProvider from '../../hooks/useProvider';
import { Space, Tag } from 'antd';

const ChainStatus: React.FC = () => {
  const { chain } = useProvider();
  return (
    <Space style={{ marginTop: 12 }}>
      <span>当前链：</span>
      <Tag>{chain?.name || '未设置'}</Tag>
    </Space>
  );
};

const InitialChainDemo: React.FC = () => {
  return (
    <TronWeb3ConfigProvider
      autoConnect={false}
      initialChain={TronNileNet}
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
        <ConnectButton chainSelect />
      </Connector>
      <ChainStatus />
    </TronWeb3ConfigProvider>
  );
};

export default InitialChainDemo;

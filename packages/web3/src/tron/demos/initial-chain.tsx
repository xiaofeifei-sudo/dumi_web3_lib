import React from 'react';
import {
  TronWeb3ConfigProvider,
  TronlinkWallet,
  BybitWallet,
  OkxTronWallet,
  LedgerWallet,
  TokenPocketWallet,
  TrustWallet,
  ImTokenWallet,
  MetaMaskTronWallet,
  WalletConnectWallet,
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
        BybitWallet,
        OkxTronWallet,
        LedgerWallet,
        TokenPocketWallet,
        TrustWallet,
        ImTokenWallet,
        MetaMaskTronWallet,
        WalletConnectWallet,
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

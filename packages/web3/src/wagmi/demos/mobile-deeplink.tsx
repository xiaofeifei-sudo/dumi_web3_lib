import React from 'react';
import {Button, Select, Space, Typography} from 'antd';
import {CoreHelperUtil} from 'pelican-web3-lib-common';
import {
  Mainnet,
  WagmiWeb3ConfigProvider,
  WalletConnect,
  type WalletUseInWagmiAdapter,
} from 'pelican-web3-lib-evm';
import {http} from 'wagmi';
import useProvider from '../../hooks/useProvider';
import Connector from '../../components/Connector';
import {ConnectButton} from '../../components/connect-button';

const {Option} = Select;
const {Text} = Typography;

const DeeplinkContent: React.FC = () => {
  const {wcWallets, availableWallets, connect} = useProvider();
  const [selectedWalletId, setSelectedWalletId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  const mobileWallets = React.useMemo(
    () => (wcWallets || []).filter((item) => item.mobile_link),
    [wcWallets],
  );

  const walletConnectWallet = React.useMemo(
    () => (availableWallets || []).find((item) => item.name === WalletConnect.name),
    [availableWallets],
  );

  const handleOpenDeeplink = async () => {
    if (!mobileWallets.length || loading) {
      return;
    }
    const wallet =
      mobileWallets.find((item) => item.id === selectedWalletId) || mobileWallets[0];
    const walletConnectAdapter = walletConnectWallet as WalletUseInWagmiAdapter | undefined;
    if (!walletConnectAdapter?.getQrCode || !walletConnectWallet || !connect) {
      return;
    }
    setLoading(true);
    try {
       connect(walletConnectWallet, {
        connectType: 'qrCode',
      });
      const {uri} = await walletConnectAdapter.getQrCode();
      CoreHelperUtil.openWalletWithDeepLink(wallet, Mainnet, uri, {
        preferUniversalLinks: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{width: '100%'}}>
      <Space direction="vertical" style={{width: '100%'}}>
        <Text>选择 WalletConnect 钱包（移动端）</Text>
        <Select
          style={{width: '100%'}}
          value={selectedWalletId}
          onChange={setSelectedWalletId}
          placeholder="自动检测 WalletConnect 钱包"
        >
          {mobileWallets.map((wallet) => (
            <Option key={wallet.id} value={wallet.id}>
              {wallet.name}
            </Option>
          ))}
        </Select>
      </Space>
      <Button
        type="primary"
        onClick={handleOpenDeeplink}
        disabled={!mobileWallets.length}
        loading={loading}
        style={{width: '100%'}}
      >
        打开钱包 Deeplink
      </Button>
    </Space>
  );
};

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      chains={[Mainnet]}
      wallets={[WalletConnect()]}
      walletConnect={{
        projectId: YOUR_WALLET_CONNECT_PROJECT_ID,
        useWalletConnectOfficialModal: false,
      }}
      transports={{
        [Mainnet.id]: http(),
      }}
      balance
      ens
    >
      <Space direction="vertical">
        <Connector>
          <ConnectButton quickConnect />
        </Connector>
        <DeeplinkContent />
      </Space>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

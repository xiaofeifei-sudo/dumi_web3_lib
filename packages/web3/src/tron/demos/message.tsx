import { Flex, message } from 'antd';

import { SignMessage } from './components/SignMessage';
import { BybitWallet, ImTokenWallet, MetaMaskTronWallet, OkxTronWallet, TokenPocketWallet, TronWeb3ConfigProvider, TronlinkWallet, TrustWallet, WalletConnectWallet } from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const Message = () => {
  return (
    <TronWeb3ConfigProvider wallets={[TronlinkWallet,
            BybitWallet,
            OkxTronWallet,
            TokenPocketWallet,
            TrustWallet,
            ImTokenWallet,
            MetaMaskTronWallet,
            WalletConnectWallet,]} autoConnect={false} >
      <Flex justify="space-between" style={{ width: 386 }}>
        <Connector>
          <ConnectButton />
        </Connector>
        <SignMessage
          signMessageCallback={(signMessageResult, address) => {
            message.success(`签名成功，地址：${address}，签名：${signMessageResult}`);
          }}
        />
      </Flex>
    </TronWeb3ConfigProvider>
  );
};

export default Message;

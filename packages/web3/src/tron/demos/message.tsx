import { Flex, message } from 'antd';

import { SignMessage } from './components/SignMessage';
import { BinanceWallet, BitgetWallet, BybitWallet, FoxWallet, GateWallet, GuardaWallet, MetaMaskTronWallet, OkxTronWallet, TokenPocketWallet, TomoWallet, TronWeb3ConfigProvider, TronlinkWallet, TrustWallet } from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const Message = () => {
  return (
    <TronWeb3ConfigProvider wallets={[TronlinkWallet,
            OkxTronWallet,
            TokenPocketWallet,
            TrustWallet,
            MetaMaskTronWallet,
            BinanceWallet,
            BitgetWallet,
            BybitWallet,
            FoxWallet,
            GateWallet,
            GuardaWallet,
            TomoWallet,
          ]} >
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

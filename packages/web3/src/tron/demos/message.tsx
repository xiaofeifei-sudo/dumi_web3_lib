import { Flex } from 'antd';
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { TronlinkWallet, TronWeb3ConfigProvider } from 'pelican-web3-lib-tron';

import { SignMessage } from './components/SignMessage';

const Message = () => {
  return (
    <TronWeb3ConfigProvider wallets={[TronlinkWallet]}>
      <Flex justify="space-between" style={{ width: 386 }}>
        <Connector>
          <ConnectButton />
        </Connector>
        <SignMessage
          signMessageCallback={(signMessageResult, address) => {
            console.log('signMessageResult', signMessageResult);
            console.log('useAddress', address);
          }}
        />
      </Flex>
    </TronWeb3ConfigProvider>
  );
};

export default Message;

import { Flex, message } from 'antd';

import { SignTransaction } from './components/SignTransaction';
import { TronWeb3ConfigProvider } from 'pelican-web3-lib-tron';
import { TronlinkWallet } from 'pelican-web3-lib-tron';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';

const Transaction = () => {
  return (
    <TronWeb3ConfigProvider wallets={[TronlinkWallet]}>
      <Flex justify="space-between" style={{ width: 386 }}>
        <Connector>
          <ConnectButton />
        </Connector>
        <SignTransaction
          contractAddress="TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"
          toAddress="TUguNkmfvjeHanGyQZLGJfj28w1tMtvNDT"
          amount={1}
          signTransactionCallback={(signTransferResult, address) => {
            message.success(`签名成功，地址：${address}，签名：${signTransferResult}`);
          }}
        />
      </Flex>
    </TronWeb3ConfigProvider>
  );
};

export default Transaction;

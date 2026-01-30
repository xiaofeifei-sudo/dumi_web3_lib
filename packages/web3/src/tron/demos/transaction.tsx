import React from 'react';
import { Button, Input, InputNumber, message, Space } from 'antd';
import { TronWeb3ConfigProvider, TronlinkWallet, USDT } from 'pelican-web3-lib-tron';
import { TronNileNet } from 'pelican-web3-lib-assets';
import Connector from '../../components/Connector';
import { ConnectButton } from '../../components/connect-button';
import useProvider from '../../hooks/useProvider';

const SendTronTransaction: React.FC = () => {
  const { account, sendTransaction } = useProvider();
  const [loading, setLoading] = React.useState(false);
  const [to, setTo] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number | null>(1);

  if (!account) return null;

  const handleSend = async () => {
    try {
      setLoading(true);
      if (!to) {
        message.error('请输入接收地址');
        setLoading(false);
        return;
      }
      if (!amount || amount <= 0) {
        message.error('金额必须大于 0');
        setLoading(false);
        return;
      }
      const hash = await sendTransaction?.({
        to,
        value: amount,
        token: USDT,
      });
      message.success(`发送成功，交易哈希：${hash}`);
    } catch (error: any) {
      message.error(error?.message || '发送交易失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical">
      <span>发送 USDT (TRC-20)</span>
      <Input
        placeholder="接收地址"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <Space>
        <InputNumber
          min={0}
          step={1}
          value={amount as number}
          onChange={setAmount}
        />
        <Button type="primary" loading={loading} onClick={handleSend}>
          发送 USDT
        </Button>
      </Space>
    </Space>
  );
};

const SendNativeTrx: React.FC = () => {
  const { account, sendTransaction } = useProvider();
  const [loading, setLoading] = React.useState(false);
  const [to, setTo] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number | null>(0.1);

  if (!account) return null;

  const handleSend = async () => {
    try {
      setLoading(true);
      if (!to) {
        message.error('请输入接收地址');
        setLoading(false);
        return;
      }
      if (!amount || amount <= 0) {
        message.error('金额必须大于 0');
        setLoading(false);
        return;
      }
      const hash = await sendTransaction?.({
        to,
        value: amount,
      });
      message.success(`发送成功，交易哈希：${hash}`);
    } catch (error: any) {
      message.error(error?.message || '发送交易失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical">
      <span>发送 TRX (原生)</span>
      <Input
        placeholder="接收地址"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <Space>
        <InputNumber
          min={0}
          step={0.1}
          value={amount as number}
          onChange={setAmount}
        />
        <Button loading={loading} onClick={handleSend}>
          发送 TRX
        </Button>
      </Space>
    </Space>
  );
};

const Transaction: React.FC = () => {
  return (
    <TronWeb3ConfigProvider
      wallets={[TronlinkWallet]}
      balance
      token={USDT}
      initialChain={TronNileNet}
    >
      <Space direction="vertical">
        <Connector>
          <ConnectButton />
        </Connector>
        <SendTronTransaction />
        <SendNativeTrx />
      </Space>
    </TronWeb3ConfigProvider>
  );
};

export default Transaction;

import React from 'react';
import { Space, Button, InputNumber, Input, message } from 'antd';
import type { Token } from 'pelican-web3-lib-common';
import useProvider from '../../hooks/useProvider';

export interface SendTransactionWidgetProps {
  token?: Token;
  title?: string;
  buttonText?: string;
  amountStep?: number;
  initialAmount?: number;
}

const SendTransactionWidget: React.FC<SendTransactionWidgetProps> = (props) => {
  const { token, title, buttonText, amountStep = 0.001, initialAmount = 0.001 } = props;
  const { sendTransaction } = useProvider();
  const [to, setTo] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number | null>(initialAmount);
  const [sending, setSending] = React.useState(false);

  const handleSend = async () => {
    if (!to) {
      message.error('Please input recipient address');
      return;
    }
    if (!amount || amount <= 0) {
      message.error('Amount must be greater than 0');
      return;
    }
    try {
      setSending(true);
      const decimals = token?.decimal ?? 18;
      const value = BigInt(Math.floor(amount * 10 ** decimals));
      const hash = await sendTransaction?.({
        to,
        value,
        token,
      });
      message.success(`Transaction sent: ${hash}`);
    } catch (error: any) {
      message.error(error?.message || 'Send transaction failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <Space direction="vertical">
      <span>{title || (token ? `Send ${token.symbol}` : 'Send native token')}</span>
      <Input
        placeholder="Recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <Space>
        <InputNumber
          min={0}
          step={amountStep}
          value={amount as number}
          onChange={setAmount}
        />
        <Button type="primary" loading={sending} onClick={handleSend}>
          {buttonText || 'Send'}
        </Button>
      </Space>
    </Space>
  );
};

export default SendTransactionWidget;


import React from 'react';
import { Button, Space } from 'antd';
import { WagmiWeb3ConfigProvider, MetaMask } from 'pelican-web3-lib-wagmi';
import { useAccount, useSignMessage } from 'wagmi';
import { getNonce, createMessage, verifyMessage } from './mock-api';

const SignIn: React.FC = () => {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  if (!isConnected || !address || !chainId) {
    return null;
  }
  return (
    <Button
      onClick={async () => {
        const nonce = await getNonce(address, chainId);
        const message = createMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        });
        const signature = await signMessageAsync({ message });
        const ok = await verifyMessage(message, signature);
        console.log('siwe verify', ok);
      }}
    >
      Sign-In with Ethereum
    </Button>
  );
};

const App: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider balance={false} wallets={[MetaMask()]} siwe={{ getNonce, createMessage, verifyMessage }}>
      <Space direction="vertical">
        <SignIn />
      </Space>
    </WagmiWeb3ConfigProvider>
  );
};

export default App;

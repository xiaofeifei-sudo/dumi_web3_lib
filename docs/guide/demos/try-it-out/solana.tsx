import React from 'react';
import type { ConfigProviderProps } from 'antd';
import type { ConnectModalProps } from 'pelican-web3-lib';
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { CoinbaseWallet, PhantomWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

type SizeType = ConfigProviderProps['componentSize'];

interface Props {
  mode: ConnectModalProps['mode'];
  size: SizeType;
  quickConnect: boolean;
  buttonType: 'primary' | 'dashed' | 'link' | 'text' | 'default';
}

const App: React.FC<Props> = ({ mode, size, quickConnect, buttonType }) => {
  return (
    <SolanaWeb3ConfigProvider wallets={[CoinbaseWallet(), PhantomWallet()]}>
      <Connector
        modalProps={{
          mode,
        }}
      >
        <ConnectButton
          type={buttonType}
          style={{
            width: 'auto',
          }}
          size={size}
          quickConnect={quickConnect}
        />
      </Connector>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;

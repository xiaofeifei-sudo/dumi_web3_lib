import React from 'react';
import type { ConfigProviderProps } from 'antd';
import type { ConnectModalProps } from 'pelican-web3-lib';
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { Slush, Suiet, SuiWeb3ConfigProvider } from 'pelican-web3-lib-sui';

type SizeType = ConfigProviderProps['componentSize'];

interface Props {
  mode: ConnectModalProps['mode'];
  size: SizeType;
  quickConnect: boolean;
  buttonType: 'primary' | 'dashed' | 'link' | 'text' | 'default';
}

const App: React.FC<Props> = ({ mode, size, quickConnect, buttonType }) => {
  return (
    <SuiWeb3ConfigProvider balance autoConnect wallets={[Suiet(), Slush()]}>
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
    </SuiWeb3ConfigProvider>
  );
};

export default App;

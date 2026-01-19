import React from 'react';
import { Space } from 'antd';
import { ConnectButton, type Chain } from 'pelican-web3-lib';
import { Mainnet, Polygon } from 'pelican-web3-lib-assets';

const App: React.FC = () => {
  const [chain, setChain] = React.useState<Chain>(Polygon);
  return (
    <Space>
      <ConnectButton
        chain={chain}
        availableChains={[Mainnet, Polygon]}
        account={{ address: '3ea2cfd153b8d8505097b81c87c11f5d05097c18' }}
        onSwitchChain={async (c) => {
          setChain(c);
        }}
      />
      <ConnectButton
        chain={chain}
        availableChains={[Mainnet, Polygon]}
        type="primary"
        onSwitchChain={async (c) => {
          setChain(c);
        }}
      />
      <ConnectButton
        chain={chain}
        availableChains={[Mainnet, Polygon]}
        size="large"
        onSwitchChain={async (c) => {
          setChain(c);
        }}
      />
    </Space>
  );
};

export default App;

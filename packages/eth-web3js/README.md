# pelican-web3-lib-eth-web3js

基于 web3.js 的以太坊适配包，为 pelican-web3-lib 提供 EVM 链连接能力。

## 安装

```bash
npm install pelican-web3-lib pelican-web3-lib-eth-web3js
```

## 使用示例

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { Mainnet } from 'pelican-web3-lib-assets';
import { EthWeb3jsConfigProvider } from 'pelican-web3-lib-eth-web3js';
import { MetaMask } from 'pelican-web3-lib-eth-web3js/wallets';

export default () => (
  <EthWeb3jsConfigProvider chains={[Mainnet]} wallets={[MetaMask()]}>
    <Connector>
      <ConnectButton />
    </Connector>
  </EthWeb3jsConfigProvider>
);
```

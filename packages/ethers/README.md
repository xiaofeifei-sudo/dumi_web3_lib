# pelican-web3-lib-ethers

基于 ethers.js v6 的以太坊适配包，为 pelican-web3-lib 提供 EVM 链连接与账户管理能力。

- 官网文档：https://web3.ant.design

## 安装

```bash
npm install pelican-web3-lib pelican-web3-lib-ethers
```

## 使用示例

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { Mainnet } from 'pelican-web3-lib-assets';
import { EthersWeb3ConfigProvider } from 'pelican-web3-lib-ethers';
import { MetaMask } from 'pelican-web3-lib-ethers/wallets';

export default () => (
  <EthersWeb3ConfigProvider chains={[Mainnet]} wallets={[MetaMask()]}>
    <Connector>
      <ConnectButton />
    </Connector>
  </EthersWeb3ConfigProvider>
);
```

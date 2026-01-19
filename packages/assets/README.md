# pelican-web3-lib-assets

Web3 资产资源包，收录常见链、钱包、代币的图标与常量，供 Ant Design Web3 组件与示例使用。

- 官网文档：https://web3.ant.design

## 安装

```bash
npm install pelican-web3-lib-assets
```

## 使用示例

```tsx
import { Ethereum } from 'pelican-web3-lib-assets';
import { USDT } from 'pelican-web3-lib-assets/tokens';
import { MetaMask } from 'pelican-web3-lib-assets/wallets';

export default () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Ethereum />
    <MetaMask />
    <USDT />
  </div>
);
```

## 包含内容

- 链图标与常量：Ethereum 等主流网络
- 钱包图标：MetaMask、WalletConnect、OKX、Phantom 等
- 代币图标：USDT、USDC、ETH、SUI 等

如需查看完整列表与更多示例，请访问：https://web3.ant.design/components/icons

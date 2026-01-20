# pelican-web3-lib-bitcoin

为 pelican-web3-lib 提供比特币适配能力，支持常见钱包（Xverse、Unisat、OKX 等）连接与账户管理。

## 安装

```bash
npm install pelican-web3-lib pelican-web3-lib-bitcoin
```

## 使用示例

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  BitcoinWeb3ConfigProvider,
  OkxWallet,
  UnisatWallet,
  XverseWallet,
} from 'pelican-web3-lib-bitcoin';

const App: React.FC = () => {
  return (
    <BitcoinWeb3ConfigProvider wallets={[XverseWallet(), UnisatWallet(), OkxWallet()]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </BitcoinWeb3ConfigProvider>
  );
};

export default App;
```

## 文档

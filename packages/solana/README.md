# pelican-web3-lib-solana

为 pelican-web3-lib 提供 Solana 适配能力，支持 Phantom 等常见钱包连接。

## 安装

```bash
npm install pelican-web3-lib pelican-web3-lib-solana --save
```

## 使用示例

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { PhantomWallet, SolanaWeb3ConfigProvider } from 'pelican-web3-lib-solana';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider wallets={[PhantomWallet()]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;
```

更多示例参考：https://web3.ant.design/components/solana

## 文档

- Ant Design Web3：https://web3.ant.design
- Solana 官方：https://solana.com

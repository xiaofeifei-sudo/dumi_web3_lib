# pelican-web3-lib-ton

为 pelican-web3-lib 提供 TON 网络适配能力，支持 Tonkeeper、OKX 等钱包连接。

## 安装

```bash
npm install pelican-web3-lib pelican-web3-lib-ton --save
```

## 使用示例

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { okxTonWallet, tonkeeper, TonWeb3ConfigProvider } from 'pelican-web3-lib-ton';

const Basic = () => {
  return (
    <TonWeb3ConfigProvider wallets={[tonkeeper, okxTonWallet, { key: 'safepalwallet' }]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </TonWeb3ConfigProvider>
  );
};

export default Basic;
```


## 文档

- TON 官方：https://ton.org

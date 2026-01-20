# pelican-web3-lib-tron

为 pelican-web3-lib 提供 TRON 网络适配能力，支持 TronLink、OKX、Bitget、Bybit 等钱包连接。

## 安装

```bash
npm install pelican-web3-lib pelican-web3-lib-tron --save
```

## 使用示例

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  BitgetWallet,
  BybitWallet,
  OkxTronWallet,
  TronlinkWallet,
  TronWeb3ConfigProvider,
} from 'pelican-web3-lib-tron';

const Basic = () => {
  return (
    <TronWeb3ConfigProvider wallets={[TronlinkWallet, OkxTronWallet, BitgetWallet, BybitWallet]}>
      <Connector>
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default Basic;
```


## 文档

- TRON 官方：https://tron.network

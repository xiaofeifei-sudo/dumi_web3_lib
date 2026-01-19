# pelican-web3-lib-ethers-v5

针对 ethers.js v5 的兼容包，提供便捷的 v5 Provider 与 Signer Hook，在使用 pelican-web3-lib-ethers（v6）作为配置的同时，继续复用 v5 API。

- 官网文档：https://web3.ant.design

## 安装

```bash
npm install pelican-web3-lib-ethers pelican-web3-lib-ethers-v5
```

## 使用示例

```tsx
import { EthersWeb3ConfigProvider } from 'pelican-web3-lib-ethers';
import { useEthersProvider } from 'pelican-web3-lib-ethers-v5';

export default () => {
  const App = () => {
    const provider = useEthersProvider();
    return <div>{provider ? 'v5 Provider 就绪' : '未连接'}</div>;
  };
  return (
    <EthersWeb3ConfigProvider>
      <App />
    </EthersWeb3ConfigProvider>
  );
};
```

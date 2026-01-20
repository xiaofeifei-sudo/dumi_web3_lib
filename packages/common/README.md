# pelican-web3-lib-common

Web3 通用基础包，提供类型定义、工具方法以及跨链通用的配置上下文。

## 安装

```bash
npm install pelican-web3-lib-common
```

## 功能概览

- 通用类型：账户、余额、链信息、钱包元数据等
- 工具方法：地址格式化、IPFS 资源请求、调试告警等
- Web3ConfigProvider：跨链通用的配置上下文，组件间共享连接状态

## 使用示例

```tsx
import { Web3ConfigProvider } from 'pelican-web3-lib-common';

export default () => (
  <Web3ConfigProvider locale={{ Address: { copyTips: '复制地址' } }}>
    <div>你的 DApp</div>
  </Web3ConfigProvider>
);
```

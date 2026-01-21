# pelican-web3-lib-tron

TRON 网络适配库。提供 Provider 组件与钱包元数据，兼容 TronLink、OKX、Bybit、Bitget 等主流钱包。文档遵循 Lark 风格，覆盖每个用法与模型，避免依赖源码阅读即可完成对接。

## 安装

```bash
pnpm add pelican-web3-lib pelican-web3-lib-tron
```

## 导出结构
- Provider：TronWeb3ConfigProvider（封装 @tronweb3 WalletProvider）
- 钱包元数据：TronlinkWallet、OkxTronWallet、BybitWallet、BitgetWallet
- 工厂类型：StandardWallet、StandardWalletFactory、AdapterWalletFactory、WalletFactoryBuilder、StandardWalletFactoryBuilder
- 工具函数：hasWalletReady（判断适配器就绪状态）

## 快速开始
- 将 TronWeb3ConfigProvider 包裹在应用根节点或路由级节点
- 通过 wallets 传入展示用钱包元数据
- 可选：autoConnect 自动重连；onError 错误回调；ignoreConfig 多 Provider 合并控制；walletProviderProps 自定义底层 @tronweb3 WalletProvider 属性（含适配器集合）

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
    <TronWeb3ConfigProvider
      wallets={[TronlinkWallet, OkxTronWallet, BitgetWallet, BybitWallet]}
      autoConnect
      onError={(e) => {
        // 错误上报或提示
        console.error(e);
      }}
      // 可选：覆盖底层适配器集合
      // walletProviderProps={{ adapters: [new TronLinkAdapter(), new OkxWalletAdapter(), new BybitWalletAdapter()] }}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </TronWeb3ConfigProvider>
  );
};

export default Basic;
```

## Provider 用法
- 内部封装 @tronweb3 WalletProvider，并提供 PelicanWeb3ConfigProvider 的统一上下文（账户与钱包）
- 账户地址自动同步到 account（addressPrefix 空字符串）
- 连接/断开流程：
  - connect：根据传入的钱包元数据 name，选择匹配的 adapter.name 并触发连接
  - disconnect：调用底层适配器的断开方法
- 错误处理：
  - connectionError 由 WalletProvider onError 注入，内部用 promise 驱动连接回调
- 多 Provider 切换：
  - ignoreConfig: true 时在与父级上下文合并时忽略当前 Provider 配置，避免切换场景闪烁

核心属性（简述）：
- wallets: 展示用钱包元数据集合（用于 UI 与选择）
- autoConnect: 是否自动重连
- onError: 错误回调
- walletProviderProps: 透传给底层 WalletProvider 的属性（可覆盖 adapters 集合）
- ignoreConfig: 多 Provider 场景下的合并控制
- locale: 本地化配置

## 钱包元数据
- TronlinkWallet：包含图标、应用下载链接与 Chrome 扩展信息
- OkxTronWallet：复用通用 OKX 钱包元数据并标识 key 与分组
- BybitWallet、BitgetWallet：包含图标、应用下载与 Chrome 扩展信息
- 用于 UI 展示与选择；真实连接由底层适配器完成

## 能力矩阵（钱包）

| 钱包 | 扩展安装检测 | 钱包就绪检测 | 自动重连 | 错误回调 | 适配器可覆盖 |
| --- | --- | --- | --- | --- | --- |
| TronLink | 是 | 是 | 支持 | 支持 | 支持 |
| OKX Wallet | 是 | 是 | 支持 | 支持 | 支持 |
| Bybit | 是 | 是 | 支持 | 支持 | 支持 |
| Bitget | 是 | 是 | 支持 | 支持 | 支持 |

说明：
- 扩展安装与就绪检测基于适配器 readyState（Found/Loading）
- 自动重连由 autoConnect 控制
- 错误回调由 onError 提供
- 适配器集合可通过 walletProviderProps.adapters 覆盖或扩展

## API 模型（接口）

TronWeb3ConfigProviderProps

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| wallets | Wallet[] | 展示用钱包元数据集合 |
| onError | function(Error) | 错误回调 |
| autoConnect | boolean | 是否自动重连 |
| locale | Locale | 本地化配置 |
| walletProviderProps | object | 透传到底层 WalletProvider 的属性（可自定义适配器等） |
| ignoreConfig | boolean | 多 Provider 合并控制 |

PelicanWeb3ConfigProvider（内部）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| availableWallets | Wallet[] | 根据传入 wallets 与适配器匹配后的展示钱包 |
| locale | Locale | 本地化配置 |
| connectionError | WalletError | 连接错误，由 WalletProvider 注入 |
| ignoreConfig | boolean | 多 Provider 合并控制 |

钱包/工厂类型

| 类型 | 说明 |
| --- | --- |
| StandardWallet | 基于 Wallet 扩展的标准钱包类型（isStandardWallet） |
| StandardWalletFactory | 创建标准钱包实例的工厂 |
| AdapterWalletFactory | 基于具体适配器创建的钱包工厂 |
| WalletFactoryBuilder | 构建具体钱包工厂的方法签名 |
| StandardWalletFactoryBuilder | 构建标准钱包工厂的方法签名 |

工具函数

| 函数 | 入参 | 返回 | 说明 |
| --- | --- | --- | --- |
| hasWalletReady | WalletReadyState | boolean | 适配器是否就绪（Found/Loading 视为就绪） |

## 常见问题（FAQ）
- 点击连接无反应：确保传入的钱包元数据 name 与实际 adapter.name 一致，否则无法匹配并连接
- 自动重连失败：检查 autoConnect 是否开启，以及浏览器扩展是否已登录
- 切换多链 Provider 闪烁：在非激活 Provider 上设置 ignoreConfig: true，避免合并时闪烁
- 未找到钱包扩展：请安装对应浏览器扩展并刷新页面；readyState 为 Found/Loading 视为就绪
- 覆盖适配器：通过 walletProviderProps.adapters 传入自定义适配器集合（如新增 WalletConnect 支持）


## 文档
- TRON 官方：https://tron.network

# pelican-web3-lib-solana

Solana 适配库。提供 Provider 组件、钱包工厂与 WalletConnect 适配器，支持 Phantom、Coinbase、Trust、TipLink、WalletConnect 等主流钱包。文档遵循 Lark 风格，覆盖每个用法与模型，避免依赖源码阅读即可完成对接。

## 安装

```bash
pnpm add pelican-web3-lib pelican-web3-lib-solana @solana/wallet-adapter-react @solana/web3.js
```

## 导出结构
- Provider：SolanaWeb3ConfigProvider（封装 ConnectionProvider 与 WalletProvider）
- 链配置：solana、solanaDevnet、solanaTestnet、SolanaChainConfig
- 钱包工厂与内置钱包：wallets/factory、wallets/built-in（Phantom、Coinbase、Trust、TipLink、WalletConnect 等）
- WalletConnect 适配器：WalletConnectWalletAdapter（支持二维码与签名）
- 工具函数与类型：hasWalletReady、isWalletConnectFactory、isAdapterWalletFactory、IUniversalProvider

## 快速开始
- 将 SolanaWeb3ConfigProvider 包裹在应用根节点或路由级节点
- 通过 wallets 传入钱包工厂（内置工厂已包含常见钱包）
- 可选：autoConnect 自动重连；balance 开启余额；walletConnect 配置 WalletConnect；ignoreConfig 多 Provider 合并控制

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  SolanaWeb3ConfigProvider,
  solana,
  PhantomWallet,
  CoinbaseWallet,
  TrustWallet,
} from 'pelican-web3-lib-solana';
import type { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const App: React.FC = () => {
  return (
    <SolanaWeb3ConfigProvider
      chains={[solana]}
      wallets={[PhantomWallet(), CoinbaseWallet(), TrustWallet()]}
      autoConnect
      balance
      walletConnect={{
        // 需在 WalletConnect Cloud 配置项目并填入项目 ID
        projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
        metadata: {
          name: 'Your DApp',
          description: 'Connect with WalletConnect',
          url: 'https://your.site',
          icons: ['https://your.site/icon.png'],
        },
      }}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </SolanaWeb3ConfigProvider>
  );
};

export default App;
```

## Provider 用法
- 组合 ConnectionProvider 与 WalletProvider，统一输出 Pelican Web3 上下文（账户/链/余额/钱包）
- 链与 RPC：
  - chains 默认包含 Solana 主网/开发网/测试网；可通过 rpcProvider 自定义 RPC
  - connectionConfig 可设置 commitment 等参数
- 钱包工厂：
  - wallets 接收工厂列表（包含 Adapter 与 WalletConnect 两类）
  - autoConnect 控制是否自动连接上次钱包
  - walletProviderProps 可透传其它 WalletProvider 参数
- WalletConnect：
  - walletConnect 传入 UniversalProviderOpts（含 projectId、metadata 等），自动初始化 Provider
  - WalletConnect 工厂支持 getQrCode 用于二维码获取
- 多 Provider 合并：
  - ignoreConfig: true 时在合并上下文时忽略当前 Provider，适用于多链切换避免闪烁

核心属性（简述）：
- chains: SolanaChainConfig[]（默认 solana）
- wallets: 钱包工厂列表（见内置工厂）
- balance: 是否开启余额查询
- rpcProvider: (chain) => string（返回 RPC 地址）
- connectionConfig: ConnectionProviderProps['config']
- autoConnect: WalletProvider 自动重连
- walletProviderProps: Omit<WalletProviderProps, 'wallets' | 'autoConnect' | 'children'>
- walletConnect: UniversalProviderOpts
- ignoreConfig: 多 Provider 合并控制
- locale: 本地化配置

## 链配置
- Solana 主网/开发网/测试网内置链：
  - solana（mainnet-beta）、solanaDevnet（devnet）、solanaTestnet（testnet）
- SolanaChainConfig 字段：
  - id（SolanaChainIds）、name、network、rpcUrls.default

## 钱包工厂与内置钱包
- wallets/built-in 提供常见钱包工厂：
  - Phantom、Coinbase、Trust、TipLink、WalletConnect、Backpack、Solflare 等
- WalletConnectWalletAdapter：
  - 支持二维码连接与消息/交易签名
  - 自动处理 session_delete 与断开事件
- 工厂使用说明：
  - 标准钱包工厂（StandardWalletFactory）：不依赖 WalletConnect
  - 适配器钱包工厂（WalletFactory）：基于 @solana/wallet-adapter-* 的 Adapter
  - WalletConnect 工厂（WalletConnectWalletFactory）：支持 getQrCode

## 能力矩阵（钱包）

| 钱包 | 扩展安装检测 | 钱包就绪检测 | 自动重连 | 错误回调 | WalletConnect 二维码 |
| --- | --- | --- | --- | --- | --- |
| Phantom | 是 | 是 | 支持 | 支持 | 否 |
| Coinbase | 是 | 是 | 支持 | 支持 | 否 |
| Trust | 是 | 是 | 支持 | 支持 | 否 |
| TipLink | 否 | 是 | 支持 | 支持 | 否 |
| WalletConnect | 否 | 是 | 支持 | 支持 | 支持 |

说明：
- 扩展安装与就绪检测由 adapter.readyState 决定（Installed/Loadable）
- WalletConnect 工厂提供 getQrCode 用于二维码连接
- autoConnect 控制是否自动重连

## API 模型（接口）

SolanaWeb3ConfigProviderProps

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| locale | Locale | 国际化配置 |
| chains | SolanaChainConfig[] | 可用链列表 |
| wallets | WalletFactory[] | 钱包工厂列表 |
| balance | boolean | 是否开启余额查询 |
| autoAddRegisteredWallets | boolean | 自动追加已注册标准钱包 |
| rpcProvider | function(chain?) => string | 自定义 RPC 提供函数 |
| connectionConfig | object | ConnectionProvider 专用配置 |
| autoConnect | boolean | WalletProvider 自动重连 |
| walletProviderProps | object | 透传到 WalletProvider 的其它参数 |
| walletConnect | UniversalProviderOpts | WalletConnect 初始化配置 |
| ignoreConfig | boolean | 多 Provider 合并控制 |

PelicanWeb3ConfigProvider（内部）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| locale | Locale | 国际化配置 |
| chainAssets | Chain[] | 链展示资源（图标、名称） |
| availableChains | SolanaChainConfig[] | 允许的链 |
| balance | boolean | 是否开启余额 |
| currentChain | SolanaChainConfig | 当前链 |
| availableWallets | Wallet[] | 可用钱包列表（用于 UI） |
| connectionError | WalletConnectionError | 连接错误 |
| autoAddRegisteredWallets | boolean | 自动追加已注册标准钱包 |
| onCurrentChainChange | function(chain?) | 当前链变更回调 |
| ignoreConfig | boolean | 多 Provider 合并控制 |

钱包工厂与类型

| 类型 | 说明 |
| --- | --- |
| StandardWallet | 基于 Wallet 扩展的标准钱包类型（isStandardWallet） |
| WalletFactory | 基于 Adapter 的钱包工厂（create 返回 Wallet） |
| AdapterWalletFactory | 工厂包含 adapter（@solana/wallet-adapter-*） |
| WalletConnectWalletFactory | 工厂包含 WalletConnectWalletAdapter 与 isWalletConnect |
| WalletFactoryBuilder | 构建 AdapterWalletFactory 的方法签名 |
| StandardWalletFactoryBuilder | 构建标准钱包工厂的方法签名 |
| WalletConnectWalletFactoryBuilder | 构建 WalletConnect 工厂的方法签名 |

工具函数

| 函数 | 入参 | 返回 | 说明 |
| --- | --- | --- | --- |
| hasWalletReady | WalletReadyState | boolean | 钱包是否就绪（Installed/Loadable） |
| isWalletConnectFactory | WalletFactory | boolean | 是否为 WalletConnect 工厂 |
| isAdapterWalletFactory | WalletFactory | boolean | 是否为 Adapter 工厂 |

WalletConnect 适配器（核心能力）

| 字段/方法 | 类型 | 说明 |
| --- | --- | --- |
| name/url/icon | string | 钱包基本信息 |
| setWalletConnectProviderGetter | function(getter) | 设置 Provider Getter（延迟初始化） |
| setWalletConnectConfigGetter | function(getter) | 设置配置 Getter（currentChain、rpcEndpoint 等） |
| connect | function() | 建立会话，解析账户地址与公钥 |
| signMessage | function(message) | 消息签名（base58 编解码） |
| signTransaction | function(tx) | 交易签名（兼容 VersionedTransaction 与 Transaction） |
| disconnect | function() | 断开会话并清理监听 |

## 常见问题（FAQ）
- WalletConnect 无法连接：确保 walletConnect.projectId 设置正确，且链 network 与 RPC 地址匹配
- 扩展未检测到：检查 adapter.readyState 是否为 Installed 或 Loadable，刷新页面后重试
- 多链 Provider 闪烁：在非激活 Provider 上设置 ignoreConfig: true，避免合并时闪烁
- 余额为 0 或未显示：确认 balance 已开启且 RPC 节点可用
- 二维码弹窗：通过 WalletConnect 工厂的 getQrCode 获取并展示


## 文档
- Solana 官方：https://solana.com

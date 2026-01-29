# pelican-web3-lib-tron

TRON 网络适配库。提供 Provider 组件与钱包元数据，兼容 TronLink、OKX、Bybit、Bitget 等主流钱包。文档遵循 Lark 风格，覆盖每个用法与模型，避免依赖源码阅读即可完成对接。

## 安装

```bash
pnpm add pelican-web3-lib pelican-web3-lib-tron
```

## 导出结构
- Provider：TronWeb3ConfigProvider（封装 @tronweb3 WalletProvider）
- 钱包元数据：TronlinkWallet、OkxTronWallet、BybitWallet、TokenPocketWallet、TrustWallet、ImTokenWallet、MetaMaskTronWallet、WalletConnectWallet
- 工厂类型：StandardWallet、StandardWalletFactory、AdapterWalletFactory、WalletFactoryBuilder、StandardWalletFactoryBuilder
- 工具函数：hasWalletReady（判断适配器就绪状态）

## 快速开始
- 将 TronWeb3ConfigProvider 包裹在应用根节点或路由级节点
- 通过 wallets 传入展示用钱包元数据
- 可选：autoConnect 自动重连；onError 错误回调；ignoreConfig 多 Provider 合并控制；walletProviderProps 自定义底层 @tronweb3 WalletProvider 属性（含适配器集合）

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  BybitWallet,
  OkxTronWallet,
  TronlinkWallet,
  TokenPocketWallet,
  TrustWallet,
  ImTokenWallet,
  MetaMaskTronWallet,
  WalletConnectWallet,
  TronWeb3ConfigProvider,
} from 'pelican-web3-lib-tron';

const Basic = () => {
  return (
    <TronWeb3ConfigProvider
      wallets={[
        TronlinkWallet,
        OkxTronWallet,
        BybitWallet,
        TokenPocketWallet,
        TrustWallet,
        ImTokenWallet,
        MetaMaskTronWallet,
        WalletConnectWallet,
      ]}
      autoConnect
      onError={(e) => {
        // 错误上报或提示
        console.error(e);
      }}
      // WalletConnect（需 projectId）
      walletConnect={{
        projectId: 'YOUR_PROJECT_ID',
        metadata: {
          name: 'YourDApp',
          description: 'TRON DApp',
          url: 'https://your-dapp.example.com',
          icons: ['https://your-dapp.example.com/icon.png'],
        },
      }}
      // Ledger（如需配置）
      ledgerAdapterConfig={{}}
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
- walletConnect: WalletConnect 适配器配置（需 projectId）
- ledgerAdapterConfig: Ledger 适配器配置

## 钱包元数据
- TronlinkWallet：包含图标、应用下载链接与 Chrome 扩展信息
- OkxTronWallet：复用通用 OKX 钱包元数据并标识 key 与分组
- BybitWallet：包含图标、应用下载与 Chrome 扩展信息
- TokenPocketWallet、TrustWallet、ImTokenWallet：复用通用元数据并标识 key 与分组
- MetaMaskTronWallet：MetaMask Tron 专用元数据
- WalletConnectWallet：WalletConnect 展示元数据（二维码连接）
- 用于 UI 展示与选择；真实连接由底层适配器完成

## 能力矩阵（钱包）

| 钱包 | 扩展安装检测 | 钱包就绪检测 | 自动重连 | 错误回调 | 适配器可覆盖 |
| --- | --- | --- | --- | --- | --- |
| TronLink | 是 | 是 | 支持 | 支持 | 支持 |
| OKX Wallet | 是 | 是 | 支持 | 支持 | 支持 |
| Bybit | 是 | 是 | 支持 | 支持 | 支持 |
| TokenPocket | 是 | 是 | 支持 | 支持 | 支持 |
| MetaMask Tron | 是 | 是 | 支持 | 支持 | 支持 |
| Trust Wallet | 是 | 是 | 支持 | 支持 | 支持 |
| imToken | 是 | 是 | 支持 | 支持 | 支持 |
| WalletConnect | 否 | 是 | 支持 | 支持 | 支持 |
| Ledger | N/A | 是 | 支持 | 支持 | 支持 |
| Gate Wallet | 是 | 是 | 支持 | 支持 | 支持 |
| FoxWallet | 是 | 是 | 支持 | 支持 | 支持 |
| TomoWallet | 是 | 是 | 支持 | 支持 | 支持 |
| Binance Wallet | 是 | 是 | 支持 | 支持 | 支持 |
| Guarda | 是 | 是 | 支持 | 支持 | 支持 |

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
| walletConnect | WalletConnectAdapterConfig | WalletConnect 适配器配置（需 projectId） |
| ledgerAdapterConfig | LedgerAdapterConfig | Ledger 适配器配置 |

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

## 错误码（连接钱包）
- 基于 @tronweb3 适配器的错误通常以 `WalletError` 形式提供，包含 `name` 与 `message`

常见错误类别（name 或 message 可能不同，按场景归类）

- WalletNotFound / Not Installed：未检测到对应钱包扩展或应用
- WalletNotReady / Initializing：钱包尚未就绪（启动中或未登录）
- UserRejected / User Cancelled：用户拒绝连接、签名或授权
- NetworkNotSupported / Wrong Network：当前网络不受支持或与预期不匹配
- ConnectionTimeout：建立连接超时（浏览器/扩展状态异常）
- Disconnected / SessionClosed：连接已断开或会话被关闭

WalletConnect（如使用 @tronweb3/tronwallet-adapter-walletconnect）

- PROJECT_ID_INVALID：projectId 无效或未配置，无法建立会话
- WC_MODAL_CLOSED：用户关闭二维码弹窗，连接中断
- WC_CONNECTION_TIMEOUT：会话建立超时（网络或中继服务不稳定）
- Session Deleted：会话被删除，需要重新扫描二维码

处理建议

- 未安装/未就绪：引导安装扩展或打开 App；刷新页面或重新登录后再试
- 用户拒绝：提示用户确认操作并重试；保留当前选择状态方便再次尝试
- 网络不支持：在 UI 中提示切换到目标网络（TRON 主网/特定侧链）
- 连接超时/断开：触发重新连接流程；必要时清理本地会话并重试
- WalletConnect：校验 projectId 与网络状况；二维码会话失败时重新发起

## 常见问题（FAQ）
- 点击连接无反应：确保传入的钱包元数据 name 与实际 adapter.name 一致，否则无法匹配并连接
- 自动重连失败：检查 autoConnect 是否开启，以及浏览器扩展是否已登录
- 切换多链 Provider 闪烁：在非激活 Provider 上设置 ignoreConfig: true，避免合并时闪烁
- 未找到钱包扩展：请安装对应浏览器扩展并刷新页面；readyState 为 Found/Loading 视为就绪
- 覆盖适配器：通过 walletProviderProps.adapters 传入自定义适配器集合（如扩展 WalletConnect/自定义顺序）
- Ledger：需浏览器支持对应传输方式（如 WebUSB），并根据 ledgerAdapterConfig 配置


## 文档
- TRON 官方：https://tron.network

## 错误标准化（TRON）
- 错误统一通过 normalizeTronError 标准化，优先依据错误类型（适配器错误类）生成 message 与 code；其次按错误类的 name 兜底；最后回落到原始错误的 message 或字符串。
- 标准码仅用于 UI 与上层逻辑的统一处理，并不保证与底层钱包/节点原始 code 一致。

### 码表（TRON）
| code | 说明 | 对应类型/兜底 name |
| --- | --- | --- |
| 4900 | 连接断开 | WalletDisconnectedError |
| 4901 | 网络不匹配 | （无类型，建议由业务在签名/交易前自检） |
| 5000 | 钱包未找到/未安装 | WalletNotFoundError |
| 5001 | 未选择钱包 | WalletNotSelectedError |
| 5002 | 钱包未就绪/加载失败 | WalletWalletLoadError |
| 5003 | 连接超时 | （无类型，依钱包实现） |
| 5004 | 二维码弹窗关闭 | WalletWindowClosedError |
| 5005 | 切链失败 | WalletSwitchChainError |
| 5006 | 签名消息失败 | WalletSignMessageError |
| 5007 | 签名交易失败 | WalletSignTransactionError |
| 5011 | 获取网络失败 | WalletGetNetworkError |
| 5015 | 连接/断开失败 | WalletConnectionError / WalletDisconnectionError |
| -1 | 未知错误 | 兜底（未匹配到类型或 name） |

说明：
- 目前 TRON 适配器错误类名参考：WalletNotFoundError、WalletNotSelectedError、WalletDisconnectedError、WalletConnectionError、WalletDisconnectionError、WalletSignMessageError、WalletSignTransactionError、WalletWalletLoadError、WalletWindowClosedError、WalletSwitchChainError、WalletGetNetworkError。详见 @tronweb3/tronwallet-abstract-adapter。
- 对于非适配器错误类（仅字符串 name 的情况），将按 name 兜底匹配，未命中则返回 -1。

### 使用示例

```ts
import { normalizeTronError } from 'pelican-web3-lib-tron';

try {
  // 触发连接
  await connect();
} catch (e) {
  const err = normalizeTronError(e, { action: 'connect', walletName: wallet?.adapter?.name });
  // 根据标准码与文案处理 UI
  switch (err.code) {
    case 5000:
      // 引导安装钱包
      break;
    case 4900:
      // 提示断开，可触发重连
      break;
    default:
      // 兜底提示
      break;
  }
  // 展示统一中文文案
  // err.message
}
```

### 与 EVM 的差异
- EVM 使用 EIP-1193/JSON-RPC 规范化的 code；TRON 以适配器错误类型为主进行标准化，并提供与 UI 一致的码表。

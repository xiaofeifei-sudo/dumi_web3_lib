---
nav: 组件
subtitle: 索拉纳
order: 5
group:
  title: 连接链
  order: 2
---

# Solana

 `pelican-web3-lib-solana` 将 `pelican-web3-lib` 适配到 Solana 生态。它基于 [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) 构建，为库中的所有组件提供 Solana 连接能力与钱包编排能力。

 适配器集中管理链配置、RPC 选择与钱包集成，让你的 UI 组件保持与链无关、专注于渲染。你只需在顶层 Provider 中配置好链与钱包，组件即可自动获取正确的上下文。

 能力概览：
 - 统一的钱包管理，桌面浏览器可自动检测扩展钱包。
 - 可配置的 RPC 策略，按网络返回你的专属节点地址。
 - 开箱支持主流钱包（Phantom、OKX、TipLink、Mobile Wallet Adapter）与 WalletConnect。
 - 统一的消息与交易签名调用能力。
 - 可选余额显示与多语言支持。

## 推荐配置

我们支持配置丰富的钱包、协议和交互方式，对于大部分 DApp 来说，我们基于对 DApp 用户的习惯分析，推荐使用如下配置：

<code src="./demos/recommend.tsx"></code>

该推荐配置主要包括：

- 支持自动添加检测到的插件钱包。
- 支持显示余额。
- 默认添加 Phantom、OKX 钱包，在用户未安装钱包情况下提供下载引导。
- 配置 `quickConnect`，提供快速连接入口，简化用户操作。
- 使用 `simple` 模式，去掉钱包分组，简化界面。
- 使用自定义的 RPC 提供商，提供更好的节点连接体验。

 为什么推荐这套配置：
 - 优先展示主流钱包并支持一键连接，降低用户操作成本。
 - 仅引入必要的钱包，减小包体积、提升加载速度。
 - 通过自定义 `rpcProvider` 提升网络可靠性（可按环境或链路进行选择）。
 - 使用简化模式满足大多数常规场景，同时保留向高级模式演进的可扩展性。

 注意事项：
 - 若你有自建 RPC 或第三方服务，请在 `rpcProvider` 中按链返回最佳地址。
 - `quickConnect` 是首屏的快速入口，建议保持精简，有助于提高转化。
 - `autoAddRegisteredWallets` 会在运行时自动添加已注册的扩展钱包，无需额外代码。
## 基本使用

<code src="./demos/basic.tsx"></code>

 典型使用流程：
 - 用 `SolanaWeb3ConfigProvider` 包裹应用，传入 `chains`、`wallets` 以及可选的 `rpcProvider`。
 - 渲染连接按钮或钱包选择器组件；适配器负责状态与动作的管理。
 - 在业务逻辑中通过注入的 hooks/props 调用钱包方法（消息/交易签名）。

 小贴士：
 - 明确声明你支持的链（mainnet-beta、devnet、testnet），避免运行期不确定性。
 - 不要在组件内硬编码 RPC 地址，统一放在 `rpcProvider` 中集中管理。
## Mobile Wallet Adapter

`autoAddRegisteredWallets` 为 `true` 时，在移动端也会自动添加名为 `Mobile Wallet Adapter` 的钱包。

<code src="./demos/mobile-wallet-adapter.tsx"></code>

 移动端说明：
 - 支持深链与移动原生交互流程，提升移动端连接体验。
 - 推荐与 `quickConnect` 配合使用，呈现更简洁的移动首屏入口。
 - 请设置好应用元数据（名称、图标），改善移动端钱包切换时的展示效果。
## 添加更多钱包

为了降低引入包的大小，你需要手动配置 `wallets` 引入相关钱包。你可以从 `pelican-web3-lib-assets` 和 `@solana/wallet-adapter-ADAPTER_YOUR_NEED` 中导出相关资源。如果没有你需要的资源，你可以告知我们，或者自行配置，或提交 PR 支持。

`@solana/wallet-adapter-ADAPTER_YOUR_NEED`:

能够在这里找到可用的适配器：[wallet-adapters](https://github.com/anza-xyz/wallet-adapter/blob/master/packages/wallets/wallets/src/index.ts)

<code src="./demos/more-wallets.tsx"></code>

 使用指引：
 - 只引入需要展示的钱包适配器，以保持包体积更小、加载更快。
 - 使用资源包提供钱包图标与安装指引，提升用户理解与转化。
 - 优先选择稳定、使用广泛的适配器，减少用户困惑与维护成本。
## 使用 WalletConnect 协议

<code src="./demos/wallet-connect.tsx"></code>

 配置建议：
 - 通过 `walletConnect` 提供你的 WalletConnect `projectId` 与应用元数据。
 - 保证链列表与应用实际支持的 Solana 网络一致。
 - 同时测试桌面与移动端的交互流程，不同钱包在不同平台的能力可能有所差异。
## 自定义钱包信息

当内置的钱包不满足要求时，你也可以自定义钱包信息，也欢迎提交 PR 帮我们完善内置钱包。

<code src="./demos/custom.tsx"></code>

 常见自定义项：
 - 为企业或自定义钱包提供专属图标、名称与安装指引。
 - 增加检测逻辑，用于判断是否展示为“已安装”或给出安装引导。
 - 设置优先级排序，确保你希望的首选钱包在列表前列。
## 支持切换网络

我们内置了 Solana 主网 `mainnet-beta`，其余的网络需要配置 `chains`，并引入相关资源才可支持。引入方式和钱包类似。

<code src="./demos/networks.tsx"></code>

 网络与配置：
 - 常见网络包括 `mainnet-beta`、`devnet` 与 `testnet`。
 - 通过 `rpcProvider` 为每条链指定可靠的 RPC 地址，提升交互性能。
 - 若支持多网络，请提供清晰的网络切换入口，并持久化用户选择。
## 调用钱包方法

<code src="./demos/sign-message.tsx"></code>

 调用行为说明：
 - `signMessage` 常用于登录鉴权或钱包归属证明。
 - `signTransaction` 在通过 `Connection` 发送交易前进行授权签名。
 - 建议在 UI 中清晰展示各阶段：等待签名、已签名、错误与重试。
## 显示余额

<code src="./demos/balance.tsx"></code>

 说明：
 - 余额读取依赖 Solana RPC 与 `Connection`，可考虑做缓存以减少网络压力。
 - 在交易完成或关键交互节点触发刷新，有助于保持数据新鲜。
 - 清晰展示单位（SOL、lamports）并做好格式化处理。
## 使用 TipLink

TipLink 是一个轻量级的钱包。我们通过内置的 TipLinkWallet 对其进行支持，你可以直接使用。

你也可以在这里找到关于 TipLink Wallet Adapter 的更多信息：[TipLink Wallet Adapter](https://docs.tiplink.io/docs/products/wallet-adapter)

<code src="./demos/tiplink.tsx"></code>

 为什么选择 TipLink：
 - 为没有传统钱包的用户提供“零摩擦”体验。
 - 适用于空投、试用或简单交互等场景，无需完整钱包配置。
 - 当用户需要高级能力时，适时引导其升级至完整钱包。
## 更多组件

你可以配合更多组件使用，组件中涉及到链部分的内容都会从适配器中获取。当然，在组件上直接配置的属性优先级更高。

<code src="./demos/more-components.tsx"></code>

 使用建议：
 - 将跨组件的链与钱包状态放入 Provider 中，通过 hooks/props 进行绑定。
 - 组件级的覆盖配置优先级更高；谨慎使用以避免体验不一致。
 - 统一错误处理与空态展示，提升整体一致性。
## API

### SolanaWeb3ConfigProvider

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| rpcProvider | 连接节点的 RPC 提供商 | (chain?: [Chain](./types#chain)) => string | - | - |
| connectionConfig | 连接节点的配置 | [ConnectionConfig](https://solana-labs.github.io/solana-web3.js/v1.x/types/ConnectionConfig.html) | - | - |
| balance | 是否显示余额 | `boolean` | - | - |
| chains | 可用的链 | SolanaChainConfig\[\] | - | - |
| wallets | 可用的钱包 | WalletFactory\[\] | - | - |
| autoConnect | 是否自动连接 | `boolean` | `false` | - |
| autoAddRegisteredWallets | 是否自动添加已注册的插件钱包 | `boolean` | `false` | - |
| walletProviderProps | WalletProvider 的属性 | [WalletProviderProps](https://github.com/solana-labs/wallet-adapter/blob/master/packages/core/react/src/WalletProvider.tsx#L17) | - | - |
| locale | 多语言设置 | Locale | - | - |
| walletConnect | WalletConnect 配置 | [UniversalProviderOpts](https://github.com/WalletConnect/walletconnect-monorepo/blob/v2.0/providers/universal-provider/src/types/misc.ts#L9) | - | - |

 选项说明：
 - `rpcProvider`：按链返回节点地址，推荐使用 HTTPS 且稳定可靠的提供商。
 - `connectionConfig`：根据业务负载调优承诺级别、超时等参数。
 - `autoConnect`：自动恢复上次使用的钱包；若需显式同意可保持关闭。
 - `autoAddRegisteredWallets`：启用扩展钱包检测，适合桌面浏览器场景。
 - `walletProviderProps`：在需要时透传 Wallet Adapter 的高级配置。
 - `locale`：统一组件的文案与标签的多语言设置。
 - `walletConnect`：配置 `projectId`、应用元信息与链列表以启用 WalletConnect 流程。

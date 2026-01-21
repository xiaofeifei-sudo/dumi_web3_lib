---
nav: 组件
subtitle: 水
order: 6
group:
  title: 连接链
  order: 2
---

# Sui

`pelican-web3-lib-sui` 是 Sui 的官方适配层。它在 [@mysten/dapp-kit](https://www.npmjs.com/package/@mysten/dapp-kit) 与 [@mysten/sui](https://www.npmjs.com/package/@mysten/sui) 基础上进行封装，向 `pelican-web3-lib` 提供一致的链配置、账户信息、余额、SNS（SuiNS）解析以及钱包连接能力。你可以将它与 `pelican-web3-lib` 的通用组件（如 ConnectButton 等）直接结合使用。

- 适用场景：接入 Sui 钱包、显示余额、解析 SuiNS 昵称、切换官方/自定义网络。
- 设计目标：简单接入、默认即用，必要时允许高级自定义（网络、缓存、钱包来源）。

## 推荐配置

对于大多数 Sui DApp，推荐使用如下配置（开箱即用）：

<code src="./demos/recommend.tsx"></code>

该推荐配置主要包括：

- 自动添加浏览器中检测到的标准（插件）钱包，无需手动维护列表。
- 显示账户 SUI 余额（可关闭）。
- 启用 SuiNS，在支持的情况下将地址解析成昵称。
- 配置 `quickConnect`，提供快速连接入口以减少用户点击步骤。
- 使用 `simple` 模式，移除钱包分组，界面更精简直观。

## 自定义 QueryClientProvider

如需定制数据缓存与持久化策略，可用 `PersistQueryClientProvider` 覆盖默认的 `QueryClientProvider`。这通常用于：

- 离线或弱网场景下保留查询结果，减少重复请求。
- 控制缓存失效与刷新策略，配合 React Query 的高级功能。

<NormalInstallDependencies packageNames="@tanstack/query-sync-storage-persister @tanstack/react-query-persist-client" save="true"></NormalInstallDependencies>

<code src="./demos/query-client.tsx"></code>

注意：持久化缓存需要根据 DApp 的数据鲜度要求设定合理的失效时间与重新验证策略，避免展示过期数据。

## 网络

库内置了 Sui 主网 `mainnet`。如需启用其他官方网络（`testnet`、`devnet`、`localnet`），或替换为自定义节点，使用 `networkConfig` 即可。

- `defaultNetwork` 控制初始连接的网络（默认 `mainnet`）。
- `networkConfig` 提供网络键到 fullnode URL 的映射，键名需与网络标识一致（如 `mainnet`/`testnet` 等）。

<code src="./demos/networks.tsx"></code>

## 非官方网络

<code src="./demos/networks-unofficial.tsx"></code>

你可以将自己的 RPC/Fullnode 地址注入到 `networkConfig` 中，以支持企业级自建节点或第三方服务。请确保：

- 节点服务稳定、响应及时。
- 与应用的读写需求（仅查询/包含交易提交）相匹配。

## 更多组件

<code src="./demos/more-components.tsx"></code>

除了基础连接能力，你还可以使用更多 `pelican-web3-lib` 组件（例如账户信息卡片、交易状态提示等）提升用户体验。所有组件都会在同一套 Provider 之上工作，保持一致的数据来源与状态管理。

## API

### SuiWeb3ConfigProvider

| 参数           | 说明                                                                 | 类型            | 默认值    | 版本 |
| -------------- | -------------------------------------------------------------------- | --------------- | --------- | ---- |
| balance        | 是否显示账户 SUI 余额                                                | boolean         | `false`   | -    |
| autoConnect    | 是否在有可用钱包时自动尝试连接                                       | boolean         | `false`   | -    |
| networkConfig  | Sui 网络配置（键为网络名，值为 fullnode URL 映射）                   | NetworkConfig   | -         | -    |
| sns            | 是否开启 SuiNS 昵称解析                                              | boolean         | `false`   | -    |
| defaultNetwork | 默认连接网络（可选：`mainnet`/`testnet`/`devnet`/`localnet` 等）     | string          | `mainnet` | -    |
| wallets        | 额外钱包来源（非标准钱包）列表，使用 WalletFactory 创建              | WalletFactory[] | -         | -    |
| queryClient    | 自定义 QueryClient（未提供则自动注入或新建）                         | QueryClient     | -         | -    |
| locale         | 多语言设置（影响数字、文案格式化等）                                 | Locale          | -         | -    |

补充说明：
- 标准钱包（浏览器注入的插件钱包）会自动检测并加入，无需通过 `wallets` 提供。
- 若你使用持久化 QueryClient，请结合业务设置合适的缓存策略与失效时间。

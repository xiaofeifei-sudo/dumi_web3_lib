---
nav: 组件
subtitle: 开放网络
order: 6
group:
  title: 连接链
  order: 2
---

# TON

Ant Design Web3 提供了 TON 生态的适配能力，使 `@ant-design/web3` 组件可以无缝连接 TON 链。无需手动维护连接状态，组件会通过 [Web3ConfigProvider](../web3-config-provider/index.zh-CN.md) 获取全局连接状态与接口。你也不需要编写钱包适配代码：连接器会暴露通用方法（连接、断开、余额查询以及 TonConnect 原生能力），供组件直接调用。

`@ant-design/web3-ton` 的接口设计参考了 [TON 官方文档](https://docs.ton.org/mandarin/)和`@tonconnect/sdk`，你可以在文档中找到更加深层的实现原理。RPC 服务（比如说查询余额）采用的是 [Tonconnect](http://toncenter.com)，包括测试网以及主网。

TON 支持的钱包可在官方的[钱包列表](https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json)中查看。此适配器提供了部分常用钱包的设置，如下：

- telegram-wallet
- Tonkeeper
- MyTonWallet
- OpenMask
- Tonhub
- DeWallet
- OKX（ 使用前保证 OKX 钱包为最新版本 ）

## 安装与前置要求

- 请确保 TonConnect 的 manifest 文件可以被公网访问。在此模板中，示例文件位于 [public/tonconnect-manifest.json](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/public/tonconnect-manifest.json)，将其 URL 配置到 `manifestUrl`。
- 若启用余额展示，TON 的小数位为 9，符号为 `TON`。Provider 会自动进行格式化。
- 测试网请使用 `CHAIN.TESTNET`；默认连接主网 `CHAIN.MAINNET`。

## 基本使用

<code src='./demos/basic.tsx'></code>

## 在 TON 上进行交易

演示在 TON 测试链上进行交易。<code src='./demos/transaction.tsx'></code>

### TonWeb3ConfigProvider

Provider 支持 TonConnect 的配置字段。具体可参考 SDK 的[配置文档](https://github.com/ton-connect/sdk/blob/main/packages/sdk/src/models/ton-connect-options.ts)。

| 属性 | 描述 | 类型 | 默认值 | 是否为 SDK 保留字段 | 是否必填 |
| --- | --- | --- | --- | --- | --- |
| wallets | 支持的钱包列表 | WalletMetadata\[\] | - | 否 | 必填 |
| balance | 连接后是否展示余额 | `boolean` | `false` | 否 | - |
| locale | 多语言设置 | [Locale](https://github.com/ant-design/ant-design-web3/blob/main/packages/common/src/locale/zh_CN.ts) | - | 否 | - |
| reconnect | 是否支持自动重新连接 | `boolean` | `true` | 否 | - |
| chain | 连接的网络，支持主网和测试网 | [CHAIN](https://github.com/ton-connect/sdk/blob/main/packages/protocol/src/models/CHAIN.ts) | `CHAIN.MAINNET` | 否 | - |
| manifestUrl | 用于连接钱包时候提供 Dapp 身份 | `string` | - | 是 | - |
| storage | 存储协议数据的地址 | `IStorage` | `localStorage` | 是 | - |
| eventDispatcher | 事件调度 | ` EventDispatcher<SdkActionEvent>` | `window.dispatchEvent` | 是 | - |
| walletsListSource | 钱包列表的来源 | `string` | `https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json` | 是 | - |
| walletsListCacheTTLMs | 钱包列表数据刷新间隔 | `number` | `Infinity` | 是 | - |
| disableAutoPauseConnection | 是否禁用自动暂停/恢复连接的行为 | `boolean` | `false` | 是 | - |

#### 配置注意事项

- 钱包筛选：Provider 会从 TonConnect 查询可用钱包，并根据你传入的 `wallets` 进行筛选。钱包元数据中的 `key` 应与官方钱包列表的 `appName` 对应。
- 自动恢复：`reconnect` 为 true 时，初始化阶段会尝试恢复上次连接会话。
- 余额展示：开启 `balance` 后，Provider 会通过 TonCenter 查询余额，并以 `TON` 及 9 位小数展示。
- Manifest：部分钱包要求设置合法的 `manifestUrl`（HTTPS 可访问）。Manifest 文件至少包含 `url`、`name`、`iconUrl` 字段。

## 网络与 API

- 连接器会暴露当前网络，并提供 `getBalance()` 便捷方法，底层基于 TonCenter（主网/测试网）。
- 切换 `chain` 时，会自动切换对应的 API 端点。

## 常见问题

- 钱包未显示：确保钱包 `key` 与官方列表中的 `appName` 一致，并确认已安装对应扩展或 App。
- OKX 无法连接：请升级至 OKX 钱包的最新版本。
- Manifest 报错：检查 `manifestUrl` 是否可通过 HTTPS 访问，且文件内容合法。
- 测试网交易失败：先通过水龙头获取测试网 TON 再进行交易。

## 进阶用法

- 若需要更底层的能力，可使用连接上下文 Hook 获取 TonConnect、账号信息与配置。参考 [useTonConnector](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/ton/src/hooks/useTonConnector.tsx)。

## 参考资料

- TON 官网：https://ton.org
- TonConnect SDK：https://github.com/ton-connect/sdk
- TonCenter API：https://toncenter.com

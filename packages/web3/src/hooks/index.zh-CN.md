---
nav: 组件
subtitle: 钩子函数
group: 通用
order: 2
cover: https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*impVR5nGEFYAAAAAAAAAAAAADlrGAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*SXbqSKo3tlAAAAAAAAAAAAAADlrGAQ/original
---

# Hooks

暴露一些常用的 Hooks，你可以单独使用或者配合组件使用。

## useConnection

连接或者断开连接钱包，通常来说，你不需要直接使用这个 Hook，而是使用 [Connector](../connector/index.zh-CN.md) 组件。该 Hook 是当你需要在自定义的组件或者事件触发连接或者断开连接时使用。

### 代码演示

提供不同链的示例，推荐通过[适配器](../../../../docs/guide/adapter.zh-CN.md)统一管理连接能力，然后在自定义交互里调用 `useConnection`。

Solana（适配器：pelican-web3-lib-solana）
<code src="./demos/useConnection.solana.tsx"></code>

以太坊（适配器：pelican-web3-lib-ethers）
<code src="./demos/useConnection.ethers.tsx"></code>

以太坊（适配器：pelican-web3-lib-eth-web3js）
<code src="./demos/useConnection.web3js.tsx"></code>

Sui（适配器：pelican-web3-lib-sui）
<code src="./demos/useConnection.sui.tsx"></code>

Bitcoin（适配器：pelican-web3-lib-bitcoin）
<code src="./demos/useConnection.bitcoin.tsx"></code>

以太坊（适配器：pelican-web3-lib-wagmi）
<code src="./demos/useConnection.wagmi.tsx"></code>

TRON（适配器：pelican-web3-lib-tron）
<code src="./demos/useConnection.tron.tsx"></code>
<code src="./demos/useConnection.tron.tsx"></code>

### 适配器选择

- 以太坊（EVM，wagmi）：使用 pelican-web3-lib-wagmi 的 WagmiWeb3ConfigProvider；如需 WalletConnect，请在 Provider 上配置 walletConnect.projectId。
- 以太坊（EVM，ethers）：使用 pelican-web3-lib-ethers 的 EthersWeb3ConfigProvider。
- 以太坊（EVM，web3.js）：使用 pelican-web3-lib-eth-web3js 的 EthWeb3jsConfigProvider。
- Solana：使用 pelican-web3-lib-solana 的 SolanaWeb3ConfigProvider。
- Sui：使用 pelican-web3-lib-sui 的 SuiWeb3ConfigProvider。
- Bitcoin：使用相应的 Bitcoin 适配器 Provider。
- TRON：使用 pelican-web3-lib-tron 的 TronWeb3ConfigProvider。

### API

#### Result

| 参数 | 描述 | 类型 |
| --- | --- | --- |
| connect | 连接钱包 | [UniversalWeb3ProviderInterface](../types/index.zh-CN.md#universalweb3providerinterface)["connect"] |
| disconnect | 断开连接 | [UniversalWeb3ProviderInterface](../types/index.zh-CN.md#universalweb3providerinterface)["disconnect"] |

## useAccount

用于获取当前用户的账户地址。

### 代码演示

<code src="./demos/useAccount.tsx"></code>

### API

#### Result

| 参数    | 描述                           | 类型                                       |
| ------- | ------------------------------ | ------------------------------------------ |
| account | 表示当前用户的 web3 账户地址。 | [Account](../types/index.zh-CN.md#account) |

## useNFT

方便获取 NFT 的元数据

### 代码演示

<code src="./demos/useNFT.tsx"></code>

### API

#### Result

| 参数 | 描述 | 类型 |
| --- | --- | --- |
| loading | 表示当前是否正在加载 NFT 元数据。 | `boolean` |
| metadata | 包含与指定 NFT 关联的元数据的对象。 | [NFTMetadata](../types/index.zh-CN.md#nftmetadata) |
| error | 在获取元数据过程中发生错误的时候，error 属性保存错误对象。 | `Error` |

#### Params

| 参数    | 描述                 | 类型               |
| ------- | -------------------- | ------------------ |
| address | 必需。NFT 合约地址。 | `string`           |
| tokenId | 必需。NFT 令牌 ID。  | `bigint \| number` |

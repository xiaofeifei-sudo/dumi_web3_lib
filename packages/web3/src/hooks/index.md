---
nav: Components
group: General
order: 2
cover: https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*impVR5nGEFYAAAAAAAAAAAAADlrGAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*SXbqSKo3tlAAAAAAAAAAAAAADlrGAQ/original
---

# Hooks

Expose some commonly used Hooks that you can use independently or in conjunction with components.

## useConnection

Connect or disconnect the wallet. Usually, you don't need to use this Hook directly, but use the [Connector](../connector/index.md) component. This Hook is used when you need to connect or disconnect the wallet in custom components or event triggers.

### Examples

Examples across different chains. We recommend managing connection capabilities via an [adapter](../../../../docs/guide/adapter.md) and then invoking `useConnection` in your custom interactions.

Solana (Adapter: pelican-web3-lib-solana)
<code src="./demos/useConnection.solana.tsx"></code>

Ethereum (Adapter: pelican-web3-lib-ethers)
<code src="./demos/useConnection.ethers.tsx"></code>

Ethereum (Adapter: pelican-web3-lib-eth-web3js)
<code src="./demos/useConnection.web3js.tsx"></code>

Sui (Adapter: pelican-web3-lib-sui)
<code src="./demos/useConnection.sui.tsx"></code>

Bitcoin (Adapter: pelican-web3-lib-bitcoin)
<code src="./demos/useConnection.bitcoin.tsx"></code>

Ethereum (Adapter: pelican-web3-lib-wagmi)
<code src="./demos/useConnection.wagmi.tsx"></code>

TRON (Adapter: pelican-web3-lib-tron)
<code src="./demos/useConnection.tron.tsx"></code>

### Adapter Setup

- Ethereum (EVM, wagmi): Use WagmiWeb3ConfigProvider from pelican-web3-lib-wagmi; for WalletConnect, set walletConnect.projectId on the Provider.
- Ethereum (EVM, ethers): Use EthersWeb3ConfigProvider from pelican-web3-lib-ethers.
- Ethereum (EVM, web3.js): Use EthWeb3jsConfigProvider from pelican-web3-lib-eth-web3js.
- Solana: Use SolanaWeb3ConfigProvider from pelican-web3-lib-solana.
- Sui: Use SuiWeb3ConfigProvider from pelican-web3-lib-sui.
- Bitcoin: Use the corresponding Bitcoin adapter Provider.
- TRON: Use TronWeb3ConfigProvider from pelican-web3-lib-tron.
### API

#### Result

| Property | Description | Type |
| --- | --- | --- |
| connect | Connect | [UniversalWeb3ProviderInterface](../types/index.md#universalweb3providerinterface)["connect"] |
| disconnect | Disconnect | [UniversalWeb3ProviderInterface](../types/index.md#universalweb3providerinterface)["disconnect"] |

## useAccount

Used to retrieve the account address of the current user.

### Examples

<code src="./demos/useAccount.tsx"></code>

### API

#### Result

| Property | Description | Type |
| --- | --- | --- |
| account | Represents the web3 account address of the current user. | [Account](../types/index.md#account) |

## useNFT

Convenient access to NFT metadata.

### Examples

<code src="./demos/useNFT.tsx"></code>

### API

#### Result

| Property | Description | Type |
| --- | --- | --- |
| loading | Indicate whether the NFT metadata is currently being loaded. | `boolean` |
| metadata | An object containing metadata associated with the specified NFT. | [NFTMetadata](../types/index.md#nftmetadata) |
| error | When an error occurs during the process of fetching metadata, the error property stores the error object. | `Error` |

#### Params

| Property | Description                     | Type               |
| -------- | ------------------------------- | ------------------ |
| address  | Required. NFT contract address. | `string`           |
| tokenId  | Required. NFT token ID.         | `bigint \| number` |

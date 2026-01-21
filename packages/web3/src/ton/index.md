---
nav: Components
order: 6
group:
  title: Connect Blockchains
  order: 2
---

# TON

Ant Design Web3 provides an adapter for the TON ecosystem. It enables `@ant-design/web3` components to connect to the TON chain without manual state management. Global connection state and APIs are exposed via [Web3ConfigProvider](../web3-config-provider/index.md). Wallet-specific logic is not required: the connector exposes common methods (connect, disconnect, balance query, and the underlying TonConnect capabilities) that components can use directly.

The interface design of `@ant-design/web3-ton` refers to the [TON official documentation](https://docs.ton.org/) and `@tonconnect/sdk`. You can find more in-depth implementation details in the documentation. The RPC service (such as balance inquiry) uses [Tonconnect](http://toncenter.com), including the testnet and mainnet.

You can check the wallets supported by TON in the official [wallet list](https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json). Commonly used wallets supported by this adapter include:

- telegram-wallet
- Tonkeeper
- MyTonWallet
- OpenMask
- Tonhub
- DeWallet
- OKX (Make sure OKX wallet is up to date before using)

## Installation and Prerequisites

- Ensure TonConnect manifest is publicly accessible. In this template, a sample manifest is provided at [public/tonconnect-manifest.json](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/public/tonconnect-manifest.json). Use its URL as `manifestUrl` in the provider configuration.
- When enabling balance display, TON uses 9 decimals and symbol `TON`. The provider handles formatting automatically.
- For testnet usage, select `CHAIN.TESTNET`. Mainnet uses `CHAIN.MAINNET` by default.

## Basic Usage

<code src='./demos/basic.tsx'></code>

## Transaction on TON

Demonstrates sending a transaction on the TON testnet. <code src='./demos/transaction.tsx'></code>

### TonWeb3ConfigProvider

TonConnect-based configuration fields are supported by the provider. Refer to the SDK [options documentation](https://github.com/ton-connect/sdk/blob/main/packages/sdk/src/models/ton-connect-options.ts) for details.

| Property | Description | Type | Default | Reserved Field for SDK | Required |
| --- | --- | --- | --- | --- | --- |
| wallets | Supported wallet list | WalletMetadata\[\] | - | No | Yes |
| balance | Whether to display the balance after connection | `boolean` | `false` | No | - |
| locale | Multilingual settings | [Locale](https://github.com/ant-design/ant-design-web3/blob/main/packages/common/src/locale/en_US.ts) | - | No | - |
| reconnect | Whether to support automatic reconnection | `boolean` | `true` | No | - |
| chain | Connected network, supporting mainnet and testnet | [CHAIN](https://github.com/ton-connect/sdk/blob/main/packages/protocol/src/models/CHAIN.ts) | `CHAIN.MAINNET` | No | - |
| manifestUrl | Dapp identity provided when connecting the wallet | `string` | - | Yes | - |
| storage | Address for storing protocol data | `IStorage` | `localStorage` | Yes | - |
| eventDispatcher | Event dispatch | ` EventDispatcher<SdkActionEvent>` | `window.dispatchEvent` | Yes | - |
| walletsListSource | Source of wallet list | `string` | `https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json` | Yes | - |
| walletsListCacheTTLMs | Wallet list data refresh interval | `number` | `Infinity` | Yes | - |
| disableAutoPauseConnection | Whether to disable automatic pause/resume connection behavior | `boolean` | `false` | Yes | - |

#### Notes on configuration

- Wallet filtering: the provider queries available wallets from TonConnect and filters by `wallets` you specify. The `key` of each wallet metadata should match the wallet `appName` from the Ton wallet list.
- Reconnection: when `reconnect` is true, the provider attempts to restore the last session at initialization.
- Balance display: when `balance` is true, the provider automatically queries balance via TonCenter and displays it with symbol `TON` and 9 decimals.
- Manifest: some wallets require `manifestUrl` to be set to a valid HTTPS URL that hosts your TonConnect manifest.

## Network and API

- The connector exposes current network and a convenience `getBalance()` method backed by TonCenter (testnet or mainnet).
- When switching `chain`, API endpoints are switched automatically.

## Troubleshooting

- Wallet not listed: ensure the wallet `key` matches `appName` in the official wallet list and the extension/app is installed.
- OKX connection issues: update to the latest version of OKX wallet.
- Manifest errors: verify `manifestUrl` is reachable over HTTPS and contains valid `url`, `name`, and `iconUrl`.
- Testnet funding: use a faucet to obtain testnet TON before sending transactions.

## Advanced Usage

- For lower-level control, use the TON connector context hook to access TonConnect, account info, and configuration. See [useTonConnector](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/ton/src/hooks/useTonConnector.tsx).

## References

- TON: https://ton.org
- TonConnect SDK: https://github.com/ton-connect/sdk
- TonCenter API: https://toncenter.com

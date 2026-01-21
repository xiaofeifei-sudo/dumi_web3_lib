---
nav: Components
order: 8
group:
  title: Connect Blockchains
  order: 2
tag:
  title: Debugging
  color: warning
---

# TRON

Pelican Web3 provides `pelican-web3-lib-tron` to adapt the TRON ecosystem. It enables `pelican-web3-lib` components to connect to the TRON chain with minimal setup. You don't need to manage connection state manually — global state and interfaces are provided via [Web3ConfigProvider](../web3-config-provider/index.md). The Tron connector exposes common methods for signing messages and transactions that you can call directly.

The interface design of `pelican-web3-lib-tron` refers to the [TRON official documentation](https://developers.tron.network/docs/tronwallet-adapter) and `@tronweb3/tronwallet-adapters`. You can find more in-depth implementation details in the documentation.

You can check the wallets supported by TRON in the [tronwallet-adapter](https://github.com/web3-geek/tronwallet-adapter?tab=readme-ov-file#supported). Pelican Web3 provides presets for commonly used wallets, as follows:

- TronLink
- OkxWallet
- BitGet
- Bybit

Ensure a TRON wallet extension is installed and unlocked (e.g., TronLink). Most adapters inject `window.tron` and `window.tronWeb` which are used by the connector.

## Basic Usage

<code src='./demos/basic.tsx'></code>

## Sign message on TRON

<code src='./demos/message.tsx'></code>

## Send transaction on TRON

<code src='./demos/transaction.tsx'></code>

Tips:
- TRON tokens (e.g., USDT on TRON) often use 6 decimals. Adjust amounts accordingly.
- Use the connector’s provided methods for signing messages and transactions without manual state management.
- Wallet adapters should be available in the browser (extensions injected).

## API

### TronWeb3ConfigProvider

| Property | Description | Type | Default | Required |
| --- | --- | --- | --- | --- |
| wallets | Supported wallet list | WalletMetadata\[\] | - | - |
| autoConnect | Whether to connect automatically | `boolean` | `false` | - |
| locale | Multilingual settings | [Locale](https://github.com/ant-design/ant-design-web3/blob/main/packages/common/src/locale/en_US.ts) | - | - |
| onError | Error handler | [WalletError](https://github.com/web3-geek/tronwallet-adapter/blob/main/packages/adapters/abstract-adapter/src/errors.ts#L1) | - | - |

#### Usage Tips
- `autoConnect`: restore the last connection automatically if available.
- `onError`: capture adapter errors (user rejection, network errors, etc.).
- `wallets`: pass predefined adapters (e.g., `TronlinkWallet`, `OkxTronWallet`) to populate the connect modal.

## Troubleshooting
- Ensure the wallet extension is installed and unlocked (e.g., TronLink).
- If `window.tron` is undefined, refresh the page or reinstall the extension.
- For transaction failures, check network fees and token decimals.

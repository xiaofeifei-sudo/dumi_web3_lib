---
nav: Components
order: 2
group:
  title: Connect Blockchains
  order: 2
---

# Wagmi

Ant Design Web3 officially provides adapters for EVM chains via `pelican-web3-lib-wagmi` (wagmi + viem). It offers connection, wallet management, ENS, balance, and SIWE capabilities to `pelican-web3-lib` components through Web3ConfigProvider.

## Recommended configuration

<code src="./demos/recommend.tsx"></code>

The recommended configuration mainly includes:

- Use EIP6963 to auto‑discover injected wallets.
- Display ENS and balance.
- Add MetaMask, TokenPocket, Okx by default, and enable WalletConnect for mobile wallets.
- Provide quick connect entries to simplify user operations.
- Use a simplified interface in your components if needed.
- Manually configure QueryClient for customization.

## Customize Wagmi configuration

When you pass a custom wagmi config to `WagmiWeb3ConfigProvider`, it overrides the auto‑generated config.

<code src="./demos/wagmi-config.tsx"></code>

## EIP6963

Automatically add wallets based on [EIP6963](https://eips.ethereum.org/EIPS/eip-6963) to avoid conflicts when multiple wallets are installed.

<code src="./demos/eip6963.tsx"></code>

## Add more wallets

To reduce bundle size, configure `wallets` to import only what you need from `pelican-web3-lib-wagmi`.

<code src="./demos/more-wallets.tsx">Normal Mode</code>

<!-- ## Customize wallet information

<code src="./demos/custom-wallet.tsx"></code>

## Support switch chains

We have built‑in `Mainnet`. Other chains require configuring `chains` and importing resources similarly to wallets.

<code src="./demos/chains.tsx"></code>

## SIWE

SIWE means Sign‑In with Ethereum. Your website can verify user login via signatures. Below is a mocked backend demo; implement it in your project.

<code src="./demos/siwe/index.tsx"></code>

## Display ENS and Balance

You need to connect to an address with ENS and balance to see the effect.

<code src="./demos/name.tsx"></code>

## Use web3modal for WalletConnect

When using WalletConnect with official modal enabled, a QR dialog is shown.

<code src="./demos/web3modal.tsx"></code> -->


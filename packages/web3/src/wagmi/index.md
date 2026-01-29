---
nav: Components
order: 2
group:
  title: Connect Blockchains
  order: 2
---

# Wagmi

`pelican-web3-lib-evm` (wagmi + viem). It offers connection, wallet management, ENS, balance, and SIWE capabilities to `pelican-web3-lib` components through Web3ConfigProvider.

## Why Wagmi integration
- Aligns with wagmi/viem ecosystem for robust wallet and chain support.
- Keeps UI and blockchain logic separate: UI via `pelican-web3-lib`, providers via `pelican-web3-lib-evm`.
- Built‑in patterns for EIP6963, WalletConnect, ENS, balance, and SIWE to reduce boilerplate.

## Installation
- Install only the packages you need. Typical setup:

```bash
pnpm add pelican-web3-lib pelican-web3-lib-evm wagmi viem @tanstack/react-query antd
```

- Prerequisites:
  - WalletConnect requires a projectId.
  - Some wallets (e.g., Coinbase) may need RPC URLs or API keys.

## Recommended configuration

<code src="./demos/recommend.tsx"></code>

The recommended configuration mainly includes:

- Use EIP6963 to auto‑discover injected wallets.
- Display ENS and balance.
- Add MetaMask, TokenPocket, Okx by default, and enable WalletConnect for mobile wallets.
- Provide quick connect entries to simplify user operations.
- Use a simplified interface in your components if needed.
- Manually configure QueryClient for customization.

Code reference: [recommend.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/recommend.tsx)

## Provider props reference
- config: Use your own wagmi `createConfig` to take full control; when provided, defaults are overridden.
- chains: Pelican chain presets exposed by `pelican-web3-lib-evm` (e.g., Mainnet, Polygon). Determines available networks and chain switching.
- transports: Map `chain.id` to `http()` or custom transports to enable RPC access.
- eip6963: Set `autoAddInjectedWallets: true` to discover injected wallets automatically.
- wallets: Import only the wallet factories you need to keep bundle size small.
- walletConnect: Provide `{ projectId, useWalletConnectOfficialModal? }`. Enable the official modal to show QR for mobile.
- ens: Enable ENS resolution for connected address.
- balance: Fetch and display token/native balances when UI components support it.
- queryClient: Pass your `@tanstack/react-query` client for caching and customization.

## Customize Wagmi configuration

When you pass a custom wagmi config to `WagmiWeb3ConfigProvider`, it overrides the auto‑generated config.

<code src="./demos/wagmi-config.tsx"></code>

This pattern lets you:
- Reuse existing wagmi connectors such as `injected()` and `walletConnect()`.
- Control chains, transports and QR modal toggles in wagmi directly.

Code reference: [wagmi-config.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/wagmi-config.tsx)

## EIP6963

Automatically add wallets based on [EIP6963](https://eips.ethereum.org/EIPS/eip-6963) to avoid conflicts when multiple wallets are installed.

<code src="./demos/eip6963.tsx"></code>

Notes:
- Set `eip6963={{ autoAddInjectedWallets: true }}` to discover injected wallets (MetaMask, OKX, etc.).
- EIP6963 avoids provider collisions when users install multiple extensions.

Code reference: [eip6963.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/eip6963.tsx)

## Add more wallets

To reduce bundle size, configure `wallets` to import only what you need from `pelican-web3-lib-evm`.

<code src="./demos/more-wallets.tsx">Normal Mode</code>

Tips:
- Group wallets by `group` ("Popular", "More") to order visually.
- Mobile and QR‑based wallets generally require WalletConnect `projectId`.
- Some wallets (e.g., Coinbase) can be provided with RPC via external providers.

Code reference: [more-wallets.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/more-wallets.tsx)

## Customize wallet information

<code src="./demos/custom-wallet.tsx"></code>

You can define your own wallet metadata and connector via `UniversalWallet`:
- Provide name, icon, remark, group and a connector factory (e.g., `injected()`).
- Useful for internal/testing wallets or branded experiences.

Code reference: [custom-wallet.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/custom-wallet.tsx)

## Support switch chains

We have built‑in `Mainnet`. Other chains require configuring `chains` and importing resources similarly to wallets.

<code src="./demos/chains.tsx"></code>

How it works:
- Add pelican chain presets (e.g., Mainnet, Polygon, Base, local networks).
- Provide `transports` per chain id to enable RPC calls.
- Enable WalletConnect if you need QR flow on mobile.

Code reference: [chains.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/chains.tsx)

## SIWE

SIWE means Sign‑In with Ethereum. Your website can verify user login via signatures. Below is a mocked backend demo; implement it in your project.

<code src="./demos/siwe/index.tsx"></code>

Implementation flow:
- Backend exposes `getNonce` and `verifyMessage` endpoints.
- Frontend calls `getNonce`, builds a SIWE message with `createSiweMessage`, requests signature from user, and posts it to `verifyMessage`.
- Use `renderSignBtnText` or similar to customize UI copy during sign‑in.
- Replace `YOUR_WALLET_CONNECT_PROJECT_ID` with your own project id.

Code reference: [siwe/index.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/siwe/index.tsx)

## Display ENS and Balance

You need to connect to an address with ENS and balance to see the effect.

<code src="./demos/name.tsx"></code>

Notes:
- Turn on `ens` and `balance` on the provider; UI components read from context.
- Not all addresses have ENS names; test with known ones.

Code reference: [name.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/name.tsx)

## Display Token Balance

Pass a token to the provider to fetch ERC‑20 balance on the current chain.

<code src="./demos/token-balance.tsx"></code>

Notes:
- Provide a token asset (e.g., USDT) with contract addresses per chain.
- When a token is set, the balance reflects the ERC‑20 rather than native currency.

## Send Transactions

Use the unified `sendTransaction` method from context to send native or ERC‑20 transfers.

<code src="./demos/send-transaction.tsx"></code>

Notes:
- The example sends native tokens to the connected address itself.
- `sendTransaction` automatically uses the current chain from the provider.

### Send USDT (ERC‑20)

You can also send ERC‑20 tokens such as USDT by passing a token asset.

<code src="./demos/send-usdt.tsx"></code>

Notes:
- The demo uses the exported `USDT` token asset with per‑chain contract addresses.
- Amount is converted using the token `decimal` field before calling `sendTransaction`.

## Use web3modal for WalletConnect

When using WalletConnect with official modal enabled, a QR dialog is shown.

<code src="./demos/web3modal.tsx"></code>

Set `walletConnect={{ useWalletConnectOfficialModal: true }}` to use the official modal. Provide your `projectId`.

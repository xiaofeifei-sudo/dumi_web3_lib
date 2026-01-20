---
nav: Components
order: 5
group:
  title: Connect Blockchains
  order: 2
---

# Solana

 `pelican-web3-lib-solana` adapts `pelican-web3-lib` to the Solana ecosystem. It is a Web3 Solana adapter built on [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/). It provides Solana connectivity and wallet orchestration for all components in `pelican-web3-lib`.

 The adapter centralizes chain configuration, RPC selection, and wallet integration, so your UI components can stay framework-agnostic and focus on rendering. You configure chains and wallets once in a provider, and all downstream components automatically pick up the correct context.

 Key capabilities:
 - Unified wallet management with automatic detection of browser extensions where applicable.
 - Configurable RPC strategy with your own endpoints per network.
 - Seamless support for popular wallets (Phantom, OKX, TipLink, Mobile Wallet Adapter) and WalletConnect.
 - Consistent APIs for signing messages and transactions.
 - Optional balance display and multi-language support.

## Recommended configuration

We support rich configurations of wallets, protocols, and interaction methods. For most DApps, we recommend using the following configuration:

<code src="./demos/recommend.tsx"></code>

The recommended configuration mainly includes:

- Supports automatically adding detected plugin wallets.
- Supports displaying balance.
- Adds Phantom and OKX wallets by default, providing download guidance if the user has not installed a wallet.
- Configure `quickConnect` to provide quick connection entry to simplify user operations.
- Uses `simple` mode and disable group to simplify the interface.
- Uses a custom RPC provider to provide a better node connection experience.

 Why this setup:
 - Minimizes user effort by surfacing the most common wallets first and enabling one-click connect.
 - Keeps bundle size reasonable by importing only wallets you actually need.
 - Improves reliability with your own RPC selection logic (per-chain or per-environment).
 - Simplifies the UI for mainstream use-cases while still allowing you to opt-in to advanced modes later.

 Notes:
 - If you already run your own RPC or use a provider service, set `rpcProvider` to return the best endpoint per chain.
 - `quickConnect` defines prioritized entries users see in the first screen; keep it short to reduce friction.
 - `autoAddRegisteredWallets` leverages runtime detection to add extension wallets without extra code.

## Basic Usage

<code src="./demos/basic.tsx"></code>

 Typical flow:
 - Wrap your app with `SolanaWeb3ConfigProvider`, pass `chains`, `wallets`, and optional `rpcProvider`.
 - Render a connect button or a wallet selector component; the adapter wires state and actions.
 - Call wallet methods (sign message/transaction) from your business logic via injected hooks or props.

 Tips:
 - Keep chain definitions small and explicit (mainnet-beta, devnet, testnet) to avoid surprises.
 - Avoid hard-coding RPC URLs in components; centralize them in `rpcProvider`.
## Mobile Wallet Adapter

When `autoAddRegisteredWallets` is `true`, the `Mobile Wallet Adapter` wallet will also be automatically added on mobile.

<code src="./demos/mobile-wallet-adapter.tsx"></code>

 Mobile specifics:
 - Enables deep-link and mobile-native flows for supported wallets.
 - Works best when combined with `quickConnect` to present a concise mobile-first entry.
 - Ensure your app metadata (name, icon) is set correctly to improve the user experience during mobile handoff.
## Add more wallets

To reduce the size of the package you're including, you need to manually configure the `wallets` to import the relevant wallets. You can export the necessary resources from `pelican-web3-lib-assets` and `@solana/wallet-adapter-ADAPTER_YOUR_NEED`. If you don't find the resources you need, you can let us know, or configure it yourself or submit a Pull Request to us for support.

`@solana/wallet-adapter-ADAPTER_YOUR_NEED`:

Available adapters can be found here: [wallet-adapters](https://github.com/anza-xyz/wallet-adapter/blob/master/packages/wallets/wallets/src/index.ts)

<code src="./demos/more-wallets.tsx"></code>

 Guidance:
 - Import only the adapters you plan to surface; this keeps bundles smaller and improves load time.
 - Use the assets package to provide icons and install guides for each wallet.
 - Prefer stable, widely-used adapters to reduce user confusion and support overhead.
## WalletConnect

<code src="./demos/wallet-connect.tsx"></code>

 Configuration tips:
 - Provide your WalletConnect `projectId` and app metadata via `walletConnect`.
 - Make sure your chain list matches the Solana networks you expose to users.
 - Test both desktop and mobile handoff flows; some wallets differ in capability across platforms.
## Customize wallet information

When the built-in wallets do not meet your requirements, you can also customize the wallet information, and we welcome you to submit PRs to help us improve the built-in wallets.

<code src="./demos/custom.tsx"></code>

 Common customizations:
 - Custom icon, name, and install guide for a white-label or enterprise wallet.
 - Detection logic to decide whether to present a wallet as installed or suggest installation.
 - Priority ordering to ensure your preferred wallet appears first in the selector.
## Support switch chains

We have built-in support for the Solana mainnet (`mainnet-beta`). To support other networks, you need to configure the `chains` and import the relevant resources. The import process is similar to that for wallets.

<code src="./demos/networks.tsx"></code>

 Networks:
 - Typical networks are `mainnet-beta`, `devnet`, and `testnet`.
 - Pair each chain with an RPC endpoint via `rpcProvider` for reliability and performance.
 - If you offer multiple networks, present a clear selector and persist the user’s last choice.
## Call wallet methods

<code src="./demos/sign-message.tsx"></code>

 Behavior:
 - `signMessage` is commonly used for authentication or proving wallet ownership.
 - `signTransaction` lets you authorize transactions before sending them via `Connection`.
 - Always surface clear UX states: pending signature, signed, error, and retry.
## Display Balance

<code src="./demos/balance.tsx"></code>

 Notes:
 - Balance reading uses Solana RPC via `Connection`; consider caching to decrease network load.
 - Refresh the balance after transactions or at key UX milestones.
 - Show units clearly (SOL, lamports) and provide helpful formatting.
## Use TipLink

TipLink is a lightweight wallet. We support it through the built-in TipLinkWallet, which you can use directly.

You can also find more information about TipLink Wallet Adapter here: [TipLink Wallet Adapter](https://docs.tiplink.io/docs/products/wallet-adapter)

<code src="./demos/tiplink.tsx"></code>

 Why TipLink:
 - Frictionless onboarding for users without a traditional wallet.
 - Useful for giveaways, trials, and simple interactions where full wallet setup is unnecessary.
 - Encourage users to upgrade to a full wallet when they need advanced features.
## More components

You can use more components together. The content related to the chain in the component will be obtained from the adapter. Of course, the properties configured directly on the component have a higher priority.

<code src="./demos/more-components.tsx"></code>

 Guidance:
 - Keep cross-component state in the provider; let components bind to it via hooks/props.
 - Component-level overrides take precedence; use sparingly to avoid inconsistent UX.
 - Ensure error handling and empty states are consistent across components.
## API

### SolanaWeb3ConfigProvider

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| rpcProvider | RPC provider for connecting nodes | (chain?: [Chain](./types#chain)) => string | - | - |
| connectionConfig | Configuration for instantiating a Connection | [ConnectionConfig](https://solana-labs.github.io/solana-web3.js/v1.x/types/ConnectionConfig.html) | - | - |
| balance | Whether to display balance | `boolean` | - | - |
| chains | Chains | SolanaChainConfig\[\] | - | - |
| wallets | Wallets | WalletFactory\[\] | - | - |
| autoConnect | Whether to connect automatically | `boolean` | `false` | - |
| autoAddRegisteredWallets | Whether to automatically add registered plugin wallets | `boolean` | `false` | - |
| walletProviderProps | Transparent to WalletProvider | [WalletProviderProps](https://github.com/solana-labs/wallet-adapter/blob/master/packages/core/react/src/WalletProvider.tsx#L17) | - | - |
| locale | Multilingual settings | Locale | - | - |
| walletConnect | WalletConnect configs | [UniversalProviderOpts](https://github.com/WalletConnect/walletconnect-monorepo/blob/v2.0/providers/universal-provider/src/types/misc.ts#L9) | - | - |

 Notes on options:
 - `rpcProvider`: return an endpoint per chain; prefer HTTPS endpoints and reliable providers.
 - `connectionConfig`: tune commitment levels or timeouts according to your workload.
 - `autoConnect`: reconnects to the last-used wallet on load; keep off if you need explicit consent.
 - `autoAddRegisteredWallets`: enables extension detection; useful for desktop browsers.
 - `walletProviderProps`: pass through advanced Wallet Adapter settings where needed.
 - `locale`: provide localized labels and messages across components.
 - `walletConnect`: define `projectId`, metadata, and chains for WalletConnect flows.

---
nav: Components
order: 6
group:
  title: Connect Blockchains
  order: 2
---

# Sui

`pelican-web3-lib-sui` is the official adapter for Sui. Built on top of [@mysten/dapp-kit](https://www.npmjs.com/package/@mysten/dapp-kit) and [@mysten/sui](https://www.npmjs.com/package/@mysten/sui), it provides unified chain configuration, account data, balance, SuiNS resolution, and wallet connection for `pelican-web3-lib` components. You can use it directly with generic components such as ConnectButton.

- Use cases: connect Sui wallets, display balances, resolve SuiNS nicknames, and switch between official/custom networks.
- Design goals: simple defaults with optional advanced customization (networks, caching, wallet sources).

## Recommended configuration

For most Sui DApps, we recommend the following “ready-to-use” configuration:

<code src="./demos/recommend.tsx"></code>

This recommended setup includes:

- Automatically add detected standard (plugin) wallets from the browser.
- Display SUI account balance (optional).
- Enable SuiNS to resolve addresses into nicknames when available.
- Configure `quickConnect` to reduce user steps when connecting.
- Use the `simple` mode to remove wallet grouping and keep UI concise.

## Custom QueryClientProvider

If you need to customize caching and persistence, use `PersistQueryClientProvider` to override the default `QueryClientProvider`. Typical scenarios include:

- Preserving query results in offline/poor network conditions to reduce repeated requests.
- Controlling cache invalidation/refresh strategy with advanced React Query features.

<NormalInstallDependencies packageNames="@tanstack/query-sync-storage-persister @tanstack/react-query-persist-client" save="true"></NormalInstallDependencies>

<code src="./demos/query-client.tsx"></code>

Note: when persisting cache, set reasonable stale times and revalidation strategies to avoid showing outdated data.

## Networks

Sui mainnet `mainnet` is built-in. To enable other official networks (`testnet`, `devnet`, `localnet`) or to use custom nodes, configure `networkConfig`.

- `defaultNetwork` controls the initial connected network (defaults to `mainnet`).
- `networkConfig` provides a mapping from network keys to fullnode URLs, keys should match network identifiers (e.g., `mainnet`/`testnet`).

<code src="./demos/networks.tsx"></code>

## Unofficial networks

<code src="./demos/networks-unofficial.tsx"></code>

You can inject your own RPC/fullnode endpoints via `networkConfig` to support enterprise self-hosted nodes or third-party services. Please ensure:

- The node service is stable and responsive.
- The node’s capabilities match your app needs (read-only vs. includes transaction submissions).

## More Components

<code src="./demos/more-components.tsx"></code>

Beyond basic connection, you can use additional `pelican-web3-lib` components (e.g., account info cards, transaction status hints) to improve UX. All components share the same Provider stack to keep data sources and state management consistent.

## API

### SuiWeb3ConfigProvider

| Property       | Description                                                                 | Type            | Default   | Version |
| -------------- | --------------------------------------------------------------------------- | --------------- | --------- | ------- |
| balance        | Whether to display the SUI account balance                                  | boolean         | `false`   | -       |
| autoConnect    | Attempt auto connection when a compatible wallet is available               | boolean         | `false`   | -       |
| networkConfig  | Sui network configuration (map of network keys to fullnode URLs)            | NetworkConfig   | -         | -       |
| sns            | Enable SuiNS nickname resolution                                            | boolean         | `false`   | -       |
| defaultNetwork | Initial network to connect (e.g., `mainnet`/`testnet`/`devnet`/`localnet`)  | string          | `mainnet` | -       |
| wallets        | Additional (non-standard) wallets provided via WalletFactory                | WalletFactory[] | -         | -       |
| queryClient    | Custom QueryClient (falls back to injected or a new instance if not given)  | QueryClient     | -         | -       |
| locale         | Multilingual settings (affects formatting of numbers and text)              | Locale          | -         | -       |

Notes:
- Standard wallets (browser-injected plugin wallets) are auto-detected; you don’t need to add them via `wallets`.
- When using persistent QueryClient, set cache policies that fit your business requirements.

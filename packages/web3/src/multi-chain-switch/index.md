---
nav: Components
group:
  title: Advanced
  order: 4
cover: https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*agi7R62kJMQAAAAAAAAAAAAADlrGAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*DuEdT5NT9nwAAAAAAAAAAAAADlrGAQ/original
---

# Multi-Chain Switch

Enable seamless switching between different blockchain providers in a single app without page flickering or context resets. The key is the `ignoreConfig` prop: it lets multiple providers stay mounted side by side while ensuring that only one provider’s configuration is active at any time.

## Basic Usage

Mount all the chain-specific providers your app needs (e.g., EVM, Sui, Solana) and control which one is “active” by toggling `ignoreConfig`. Exactly one provider should be active at a time (i.e., not ignored), and all others should have `ignoreConfig={true}`. Switching the active chain only flips these flags; the component tree stays mounted, so the UI does not flicker.

<code src="./demos/multi-chain-switch.tsx"></code>

## How It Works

- `ignoreConfig={true}` excludes this provider’s configuration from the parent–child context merge, so it does not contribute values used by hooks/components.
- Multiple providers can be mounted simultaneously; only the active provider participates in configuration resolution.
- Switching chains is implemented by toggling `ignoreConfig` values. Because providers remain mounted, React avoids unmount/remount cycles and the UI does not flicker.
- The pattern is consistent across the chain-specific providers listed below.

## API

The `ignoreConfig` prop is available on:

- `Web3ConfigProvider`
- `WagmiWeb3ConfigProvider`
- `SuiWeb3ConfigProvider`
- `SolanaWeb3ConfigProvider`
- `TronWeb3ConfigProvider`
- `TonWeb3ConfigProvider`
- And other chain-specific providers

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| ignoreConfig | If true, this provider's configuration will be ignored when merging with parent context | `boolean` | `false` |

## Best Practices

1. Set `ignoreConfig={true}` on all inactive providers to avoid configuration conflicts.
2. Ensure exactly one provider is active; if multiple are active, configuration becomes ambiguous.
3. Use a single source of truth (state/store) to track the active chain and toggle `ignoreConfig` accordingly.
4. Keep all providers mounted; switch by flipping `ignoreConfig` so components aren’t remounted and expensive initialization is avoided.

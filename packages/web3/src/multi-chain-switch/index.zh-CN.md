---
nav: 组件
subtitle: 多链切换
group:
  title: 高级
  order: 4
cover: https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*agi7R62kJMQAAAAAAAAAAAAADlrGAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*DuEdT5NT9nwAAAAAAAAAAAAADlrGAQ/original
---

# 多链切换

在同一项目中实现不同链 Provider 的无缝切换，避免页面闪烁或上下文重置。核心在于使用 `ignoreConfig`：多个 Provider 可以同时挂载，但任一时刻仅有一个 Provider 的配置处于“激活”状态并对下游生效。

## 基本使用

在应用中并行挂载所有需要的链 Provider（如 EVM、Sui、Solana），通过切换 `ignoreConfig` 来控制哪个 Provider 处于“激活”。任何时刻应保证只有一个 Provider 未忽略（即不设置或设置 `ignoreConfig={false}`），其余 Provider 需设置为 `ignoreConfig={true}`。切换链时仅翻转这些标志位，组件树保持挂载状态，因而不会出现闪烁。

<code src="./demos/multi-chain-switch.tsx"></code>

## 工作原理

- 当 `ignoreConfig={true}` 时，该 Provider 的配置在与父级 context 合并时被排除，因此不会向 hooks/组件提供配置。
- 可以同时挂载多个 Provider；只有激活的 Provider 参与配置解析。
- 切换链通过翻转各 Provider 的 `ignoreConfig` 来实现。由于 Provider 保持挂载，React 不会发生卸载/重新挂载，UI 不会闪烁。
- 该模式对下列链特定 Provider 均适用。

## API

`ignoreConfig` 属性在以下组件中可用：

- `Web3ConfigProvider`
- `WagmiWeb3ConfigProvider`
- `SuiWeb3ConfigProvider`
- `SolanaWeb3ConfigProvider`
- `TronWeb3ConfigProvider`
- `TonWeb3ConfigProvider`
- 以及其他链特定的 Provider

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| ignoreConfig | 如果为 true，该 Provider 的配置在合并父级 context 时会被忽略 | `boolean` | `false` |

## 最佳实践

1. 始终在所有非激活的 Provider 上设置 `ignoreConfig={true}`，避免配置冲突。
2. 保证任一时刻仅有一个 Provider 处于激活；若同时激活多个，配置解析将不明确。
3. 使用单一数据源（状态/Store）管理当前激活的链，并据此切换各 Provider 的 `ignoreConfig`。
4. 保持所有 Provider 挂载，仅通过翻转 `ignoreConfig` 来切换，避免组件重挂载与昂贵的初始化。

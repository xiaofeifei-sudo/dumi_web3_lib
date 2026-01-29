---
nav: 组件
subtitle: 以太坊（Wagmi）
order: 2
group:
  title: 连接链
  order: 2
---

# Wagmi

 `pelican-web3-lib-evm`（wagmi + viem）来适配以太坊与各类 EVM L2，它通过 Web3ConfigProvider 为 `pelican-web3-lib` 的组件提供连接、钱包管理、ENS、余额与 SIWE 等能力。

## 为什么选用 Wagmi
- 与 wagmi/viem 生态对齐，获得更完备的钱包与链支持。
- 将 UI 与链交互解耦：UI 由 `pelican-web3-lib` 提供，链连接由 `pelican-web3-lib-evm` 提供。
- 内置 EIP6963、WalletConnect、ENS、余额与 SIWE 的最佳实践，减少样板代码。

## 安装
- 仅安装需要的包，常见安装如下：

```bash
pnpm add pelican-web3-lib pelican-web3-lib-evm wagmi viem @tanstack/react-query antd
```

- 先决条件：
  - 使用 WalletConnect 需要 projectId。
  - 某些钱包（如 Coinbase）可能需要 RPC 或 API Key。

## 推荐配置

<code src="./demos/recommend.tsx"></code>

该推荐配置主要包括：

- 使用 EIP6963 自动发现注入式钱包。
- 支持显示 ENS 与余额。
- 默认加入 MetaMask、TokenPocket、Okx，并启用 WalletConnect 以支持移动钱包。
- 提供快速连接入口以简化用户操作。
- 可自定义 QueryClient。

代码参考： [recommend.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/recommend.tsx)

## Provider 参数说明
- config：传入自定义 wagmi `createConfig` 可完全接管，且会覆盖默认配置。
- chains：由 `pelican-web3-lib-evm` 暴露的链预设（如 Mainnet、Polygon），用于控制可用网络与切链能力。
- transports：为每个 `chain.id` 提供 `http()` 或自定义 transport 以启用 RPC。
- eip6963：设置 `autoAddInjectedWallets: true` 自动发现注入式钱包。
- wallets：仅引入必要的钱包工厂以减少包体积。
- walletConnect：提供 `{ projectId, useWalletConnectOfficialModal? }`，启用官方弹窗可展示扫码二维码。
- ens：在 UI 组件支持的情况下启用 ENS 解析。
- balance：在 UI 组件支持的情况下展示余额。
- queryClient：传入 `@tanstack/react-query` 的客户端以获得缓存与自定义能力。

## 自定义 Wagmi 配置

当你向 `WagmiWeb3ConfigProvider` 传入自定义的 wagmi 配置时，会覆盖自动生成的默认配置。

<code src="./demos/wagmi-config.tsx"></code>

该方式允许你：
- 复用现有 wagmi 连接器（如 `injected()`、`walletConnect()`）。
- 在 wagmi 层面精细控制链、transports 与 QR 弹窗开关。

代码参考： [wagmi-config.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/wagmi-config.tsx)

## EIP6963

基于 [EIP6963](https://eips.ethereum.org/EIPS/eip-6963) 自动添加钱包，避免用户安装多个钱包时产生冲突。

<code src="./demos/eip6963.tsx"></code>

说明：
- 通过 `eip6963={{ autoAddInjectedWallets: true }}` 自动发现注入式钱包（如 MetaMask、OKX 等）。
- 面对多钱包并存时，EIP6963 可避免 provider 冲突。

代码参考： [eip6963.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/eip6963.tsx)

## 添加更多钱包

为降低包体积，请仅在 `wallets` 中加入必要的钱包工厂。

<code src="./demos/more-wallets.tsx">Normal Mode</code>

建议：
- 通过 `group`（如 "Popular"、"More"）对钱包分组以控制排序与展示。
- 移动端与扫码类钱包通常需要 WalletConnect 的 `projectId`。
- 部分钱包（如 Coinbase）可通过外部提供方传入 RPC。

代码参考： [more-wallets.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/more-wallets.tsx)

## 自定义钱包信息

<code src="./demos/custom-wallet.tsx"></code>

可以使用 `UniversalWallet` 定义自己的钱包元信息与连接器：
- 提供名称、图标、备注、分组以及连接器工厂（如 `injected()`）。
- 适用于内部/测试钱包或品牌化场景。

代码参考： [custom-wallet.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/custom-wallet.tsx)

## 支持切换链

内置 `Mainnet`，其它链需要在 `chains` 中配置并按钱包类似方式导入。

<code src="./demos/chains.tsx"></code>

工作机制：
- 添加 pelican 的链预设（如 Mainnet、Polygon、Base、本地链）。
- 为每个链 id 提供 `transports` 以启用 RPC。
- 如需移动端二维码流程，启用 WalletConnect。

代码参考： [chains.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/chains.tsx)

## SIWE

SIWE 是指 Sign‑In with Ethereum。你的网站可通过签名验证用户登录。示例包含 Mock 的后端供参考，需在你的项目中实现。

<code src="./demos/siwe/index.tsx"></code>

实现流程：
- 后端暴露 `getNonce` 与 `verifyMessage` 接口。
- 前端先调用 `getNonce`，再用 `createSiweMessage` 生成消息，请求用户签名后将签名提交到 `verifyMessage`。
- 可通过 `renderSignBtnText` 等方式自定义登录按钮文案。
- 将示例中的 `YOUR_WALLET_CONNECT_PROJECT_ID` 替换为你自己的项目 id。

代码参考： [siwe/index.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/siwe/index.tsx)

## 显示 ENS 和余额

需要连接包含 ENS 与余额的地址才能看到示例效果。

<code src="./demos/name.tsx"></code>

说明：
- 在 Provider 上开启 `ens` 与 `balance`，UI 组件会从上下文读取并展示。
- 并非所有地址都有 ENS 名称；请使用已知地址进行测试。

代码参考： [name.tsx](file:///Users/abc/WebstormProjects/dumi_web3_lib/packages/web3/src/wagmi/demos/name.tsx)

## 显示代币余额

向 Provider 传入 `token`，即可在当前链上查询该 ERC‑20 的余额。

<code src="./demos/token-balance.tsx"></code>

说明：
 - 提供代币资产（如 USDT），其中包含按链的合约地址。

## 发起交易

通过上下文中的 `sendTransaction` 方法，可以统一发起原生代币或 ERC‑20 转账。

<code src="./demos/send-transaction.tsx"></code>

说明：
- 示例演示将原生代币转账到当前连接地址自身。
- `sendTransaction` 会自动使用 Provider 当前链信息。

### 转账 USDT（ERC‑20）

通过传入代币资产（例如 `USDT`），可以发起 ERC‑20 转账。

<code src="./demos/send-usdt.tsx"></code>

说明：
- 示例使用导出的 `USDT` 代币资产（包含按链配置的合约地址）。
- 在调用 `sendTransaction` 前会根据代币 `decimal` 将金额转换为最小单位。
- 当设置了 `token` 时，余额显示为该代币的余额而非原生币。

## 使用 web3modal 连接 WalletConnect

当启用 WalletConnect 官方弹窗时，会显示二维码对话框。

<code src="./demos/web3modal.tsx"></code>

设置 `walletConnect={{ useWalletConnectOfficialModal: true }}` 可启用官方弹窗，同时提供你的 `projectId`。

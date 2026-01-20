---
nav: 组件
subtitle: 以太坊（Wagmi）
order: 2
group:
  title: 连接链
  order: 2
---

# Wagmi

Ant Design Web3 官方提供了 `pelican-web3-lib-wagmi`（wagmi + viem）来适配以太坊与各类 EVM L2，它通过 Web3ConfigProvider 为 `pelican-web3-lib` 的组件提供连接、钱包管理、ENS、余额与 SIWE 等能力。

## 推荐配置

<code src="./demos/recommend.tsx"></code>

该推荐配置主要包括：

- 使用 EIP6963 自动发现注入式钱包。
- 支持显示 ENS 与余额。
- 默认加入 MetaMask、TokenPocket、Okx，并启用 WalletConnect 以支持移动钱包。
- 提供快速连接入口以简化用户操作。
- 可自定义 QueryClient。

## 自定义 Wagmi 配置

当你向 `WagmiWeb3ConfigProvider` 传入自定义的 wagmi 配置时，会覆盖自动生成的默认配置。

<code src="./demos/wagmi-config.tsx"></code>

## EIP6963

基于 [EIP6963](https://eips.ethereum.org/EIPS/eip-6963) 自动添加钱包，避免用户安装多个钱包时产生冲突。

<code src="./demos/eip6963.tsx"></code>

## 添加更多钱包

为降低包体积，请仅在 `wallets` 中加入必要的钱包工厂。

<code src="./demos/more-wallets.tsx">Normal Mode</code>

## 自定义钱包信息

<code src="./demos/custom-wallet.tsx"></code>

## 支持切换链

内置 `Mainnet`，其它链需要在 `chains` 中配置并按钱包类似方式导入。

<code src="./demos/chains.tsx"></code>

## SIWE

SIWE 是指 Sign‑In with Ethereum。你的网站可通过签名验证用户登录。示例包含 Mock 的后端供参考，需在你的项目中实现。

<code src="./demos/siwe/index.tsx"></code>

## 显示 ENS 和余额

需要连接包含 ENS 与余额的地址才能看到示例效果。

<code src="./demos/name.tsx"></code>

## 使用 web3modal 连接 WalletConnect

当启用 WalletConnect 官方弹窗时，会显示二维码对话框。

<code src="./demos/web3modal.tsx"></code>


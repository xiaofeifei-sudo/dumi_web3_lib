---
nav: 组件
subtitle: 波场
order: 8
group:
  title: 连接链
  order: 2
tag:
  title: 调试中
  color: warning
---

# TRON

本模板提供 `pelican-web3-lib-tron` 以适配 TRON 生态，它为 `pelican-web3-lib` 的组件提供连接 TRON 链的能力。你无需手动管理连接状态——组件通过 [Web3ConfigProvider](../web3-config-provider/index.zh-CN.md) 获取全局状态与接口。Tron 适配器的 connector 暴露了“消息签名”“交易签名”等通用方法，开箱即用。

`pelican-web3-lib-tron` 的接口设计参考了 [TRON 官方文档](https://developers.tron.network/docs/tronwallet-adapter) 和 `@tronweb3/tronwallet-adapters`，你可以在文档中找到更加深层的实现原理。

Tron 支持的钱包可以在 [tronwallet-adapter](https://github.com/web3-geek/tronwallet-adapter?tab=readme-ov-file#supported) 中查看。Pelican Web3 提供了部分常用钱包的预设：

- TronLink
- OkxWallet
- BitGet
- Bybit

请确保你已安装并登录了 TRON 钱包扩展（如 TronLink）。大多数适配器会向浏览器注入 `window.tron` 与 `window.tronWeb`，供 connector 使用。

## 基本使用

<code src='./demos/basic.tsx'></code>

## 在 TRON 上为消息签名

<code src='./demos/message.tsx'></code>

## 在 TRON 上发起交易

<code src='./demos/transaction.tsx'></code>

## 支持切换链

<code src='./demos/chains.tsx'></code>

使用建议：
- TRON 常见代币（如 USDT-TRON）通常采用 6 位小数，请按需换算。
- 可通过 connector 提供的方法完成消息与交易签名，无需手动维护连接状态。
- 钱包适配器需要在浏览器中可用（由扩展注入）。

## API

### TronWeb3ConfigProvider

| 属性 | 描述 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | --- |
| wallets | 可用的钱包列表 | WalletMetadata\[\] | - | - |
| autoConnect | 是否自动连接 | `boolean` | `false` | - |
| locale | 多语言设置 | [Locale](https://github.com/ant-design/ant-design-web3/blob/main/packages/common/src/locale/zh_CN.ts) | - | - |
| onError | 异常回调 | [WalletError](https://github.com/web3-geek/tronwallet-adapter/blob/main/packages/adapters/abstract-adapter/src/errors.ts#L1) | - | - |

#### 使用建议
- `autoConnect`：在页面初始化时尝试恢复上次连接。
- `onError`：捕获适配器错误（用户拒绝、网络异常等）。
- `wallets`：传入预设适配器（如 `TronlinkWallet`、`OkxTronWallet`）用于连接弹窗展示。

## 常见问题
- 请确认已安装并解锁钱包扩展（如 TronLink）。
- 若 `window.tron` 未定义，可尝试刷新页面或重新安装扩展。
- 若交易失败，请检查网络费用与代币小数位换算。

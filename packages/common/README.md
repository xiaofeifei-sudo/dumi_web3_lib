# pelican-web3-lib-common · API 对接文档（Lark 完整版）

摘要
- Web3 通用基础包：提供核心类型定义、工具方法以及跨链统一的配置上下文（Web3ConfigProvider）。
- 适用于 EVM、Solana、Bitcoin、Sui 等多链场景，与上层 UI 组件和业务逻辑解耦。

## 安装

```bash
npm install pelican-web3-lib-common
```

## 导出结构
- Web3ConfigProvider：跨链通用配置上下文（账户、余额、钱包、链、国际化等）
- 类型与枚举：Account、Balance、Chain、WalletMetadata、Locale、ChainIds、ChainType 等
- 工具方法：
  - getWeb3AssetUrl / requestWeb3Asset（IPFS 与资源请求）
  - fillAddressWith0x / parseNumberToBigint（格式化与数值处理）
  - createGetBrowserLink / createGetTronBrowserLink（浏览器链接生成器）
  - devUseWarning / WarningContext（开发环境告警工具）
  - CoreUtil（移动端/环境检测、WalletConnect 深链拼接、打开链接等）

## Web3ConfigProvider

### Props（表格）
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| children | ReactNode | 否 | 子组件 |
| locale | Locale | 否 | 国际化文案（可 Partial 合并） |
| extendsContextFromParent | boolean | 否 | 是否继承父级上下文（默认 true） |
| ignoreConfig | boolean | 否 | 跳过本层配置合并，仅透传父级上下文 |
| account | Account | 否 | 当前账户 |
| chain | Chain | 否 | 当前链信息 |
| balance | Balance | 否 | 当前账户余额 |
| availableWallets | Wallet[] | 否 | 可选钱包列表 |
| availableChains | Chain[] | 否 | 可选链列表 |
| addressPrefix | string | false | 地址前缀（如 '0x' 或 false） |
| connect | (wallet?: Wallet, options?: ConnectOptions) => Promise<void | Account> | 否 | 连接方法 |
| disconnect | () => Promise<void> | 否 | 断开方法 |
| switchChain | (chain: Chain) => Promise<void> | 否 | 切链方法 |
| getNFTMetadata | ({ address, tokenId? }) => Promise<NFTMetadata> | 否 | NFT 元数据解析 |
| sign | SignConfig | 否 | 应用层签名配置 |

### 用法示例
```tsx
import { Web3ConfigProvider } from 'pelican-web3-lib-common';

export default () => (
  <Web3ConfigProvider
    locale={{
      Address: { copyTips: '复制地址', copiedTips: '已复制' },
      ConnectButton: { connect: '连接钱包', disconnect: '断开连接', copyAddress: '复制地址', copied: '已复制', walletAddress: '钱包地址', moreWallets: '更多钱包', sign: '签名' }
    }}
    availableWallets={[/* Wallet 列表 */]}
    availableChains={[/* Chain 列表 */]}
    addressPrefix="0x"
  >
    <div>你的 DApp</div>
  </Web3ConfigProvider>
);
```

## 类型与枚举

### 连接状态 ConnectStatus
| 枚举值 | 说明 |
| --- | --- |
| connected | 已连接 |
| disconnected | 未连接 |
| signed | 已签名（应用层认证成功） |

### 账户 Account
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| address | string | 是 | 地址（各链格式不同） |
| name | string | 否 | 显示名称 |
| avatar | string | 否 | 头像链接 |
| addresses | `0x${string}`[] | 否 | 多地址集合（EVM 可用） |
| status | ConnectStatus | 否 | 连接状态 |

### 链枚举（节选）
| 名称 | 值/说明 |
| --- | --- |
| ChainIds | Ethereum/Mainnet、Polygon、BSC、Arbitrum、Optimism、Sepolia、Holesky、Scroll、Base、Hardhat、Localhost 等 |
| SolanaChainIds | MainnetBeta、Devnet、Testnet |
| SuiChainIds | Mainnet、Testnet、Devnet、Localnet |
| TronChainIds | Mainnet、Shasta、Nile（十六进制字符串） |

### 链类型 ChainType
| 枚举值 | 说明 |
| --- | --- |
| EVM | 以太坊虚拟机 |
| SVM | Solana 虚拟机 |
| Bitcoin | 比特币 |
| Sui | Sui 链 |

### 链对象 Chain
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | ChainIds | number | TronChainIds | 是 | 链 ID |
| name | string | 是 | 链名称 |
| type | ChainType | 否 | 虚拟机类型 |
| icon | ReactNode | 否 | 链图标 |
| browser.icon | ReactNode | 否 | 浏览器图标 |
| browser.getBrowserLink | (address, type) => string | 否 | 生成浏览器链接（type：'address' | 'transaction'） |
| nativeCurrency | BalanceMetadata & { name: string } | 否 | 原生币信息 |

### 余额 Balance / BalanceMetadata
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | bigint | 否 | 余额（bigint） |
| coverAddress | boolean | 否 | 是否覆盖地址显示 |
| icon | ReactNode | 否 | 币种图标 |
| decimals | number | 否 | 精度 |
| symbol | string | 否 | 符号 |

### 钱包 WalletMetadata / Wallet
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| name | string | 是 | 钱包名称 |
| remark | string | 是 | 简介 |
| key | React.Key | 否 | 唯一键 |
| icon | ReactNode | string | 否 | 图标 |
| extensions | WalletExtensionItem[] | false | 否 | 浏览器扩展列表 |
| app | { link: string } | false | 否 | APP 下载链接 |
| group | string | 否 | 分组 |
| universalProtocol | { link: string } | 否 | 通用协议入口（如 WalletConnect） |
| supportChainTypes | ChainType[] | 否 | 支持链类型 |
| transferQRCodeFormatter | (params) => string | 否 | 扫码支付格式化 |
| deeplink | { urlTemplate: string } | 否 | 通用链接模板 |
| hasWalletReady | () => Promise<boolean> | 否 | 钱包是否就绪 |
| hasExtensionInstalled | () => Promise<boolean> | 否 | 扩展是否安装 |
| getQrCode | () => Promise<{ uri: string }> | 否 | 获取二维码（WalletConnect） |
| customQrCodePanel | boolean | 否 | 是否自定义二维码面板 |

### 国际化 Locale / RequiredLocale（必填结构）
| 区块 | 关键字段（节选） | 说明 |
| --- | --- | --- |
| ConnectButton | connect、disconnect、copyAddress、copied、walletAddress、moreWallets、sign | 连接按钮相关文案 |
| ConnectModal | title、guideTitle、qrCodePanelTitleForScan 等 | 连接弹窗相关文案 |
| NFTCard | actionText | NFT 卡片文案 |
| Address | copyTips、copiedTips | 地址相关文案 |
| TokenSelect | placeholder | 代币选择 |
| CryptoInput | placeholder、maxButtonText | 金额输入 |
| PayPanel | tips | 支付面板 |

### 触发控件 ConnectorTriggerProps（自定义按钮时可用）
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| account | Account | 当前账户 |
| loading | boolean | 加载态 |
| onConnectClick | (wallet?: Wallet) => void | 触发连接 |
| onDisconnectClick | () => void | 触发断开 |
| onSwitchChain | (chain: Chain) => Promise<void> | 切链 |
| availableChains | Chain[] | 可选链 |
| availableWallets | Wallet[] | 可选钱包 |
| chain | Chain | 当前链 |
| balance | Balance | 当前余额 |

## 工具方法

### 资源与 IPFS
```ts
import { getWeb3AssetUrl, requestWeb3Asset } from 'pelican-web3-lib-common';

getWeb3AssetUrl('ipfs://QmHash'); // https://ipfs.io/ipfs/QmHash
await requestWeb3Asset('ipfs://QmHash'); // 拉取并解析 JSON
```

### 地址与数值
```ts
import { fillAddressWith0x, parseNumberToBigint } from 'pelican-web3-lib-common';

fillAddressWith0x('abc'); // 0xabc
parseNumberToBigint(123); // 123n
```

### 浏览器链接生成器
```ts
import { createGetBrowserLink, createGetTronBrowserLink } from 'pelican-web3-lib-common';

const etherscan = createGetBrowserLink('https://etherscan.io');
etherscan('0x...', 'address'); // https://etherscan.io/address/0x...
etherscan('0xTX', 'transaction'); // https://etherscan.io/tx/0xTX

const tronscan = createGetTronBrowserLink('https://tronscan.org/#');
tronscan('TAddress', 'address'); // https://tronscan.org/#/address/TAddress
```

### 开发告警 devUseWarning
```ts
import { devUseWarning, WarningContext } from 'pelican-web3-lib-common';

const Demo = () => {
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('DemoComponent');
    warning.deprecated(false, 'oldProp', 'newProp', '请迁移到新属性');
    warning(false, 'usage', '用法不正确');
    warning(false, 'breaking', 'API 已移除');
  }
  return null;
};
```

### CoreUtil（环境与 WalletConnect 深链）
```ts
import { CoreUtil } from 'pelican-web3-lib-common';

CoreUtil.isMobile(); CoreUtil.isAndroid(); CoreUtil.isIos();
CoreUtil.openHref('https://site', '_blank');
const deepLink = CoreUtil.formatNativeUrl('metamask://', 'wcURI', 'MetaMask');
const universalLink = CoreUtil.formatUniversalUrl('https://t.me/app', 'wcURI', 'App');
```

## 常见问题与注意事项
- Provider 合并：多层 Provider 时，默认向上继承并合并 locale 等配置；ignoreConfig 为 true 时仅透传父级。
- 国际化：Locale 为 Partial，可逐步补齐；RequiredLocale 列出必填字段集合。
- 链浏览器类型：EVM 使用 'address'/'transaction'，Tron 的交易链接 key 为 'transaction'。
- 安全：不要在日志中输出私钥或敏感信息；请求 IPFS 资源时注意跨域与网关稳定性。

## 附录：飞书表格粘贴辅助（TSV/CSV）

### Web3ConfigProvider Props（CSV）
```csv
"字段","类型","必填","说明"
"children","ReactNode","否","子组件"
"locale","Locale","否","国际化文案（可 Partial 合并）"
"extendsContextFromParent","boolean","否","是否继承父级上下文（默认 true）"
"ignoreConfig","boolean","否","跳过本层配置合并，仅透传父级上下文"
"account","Account","否","当前账户"
"chain","Chain","否","当前链信息"
"balance","Balance","否","当前账户余额"
"availableWallets","Wallet[]","否","可选钱包列表"
"availableChains","Chain[]","否","可选链列表"
"addressPrefix","string | false","否","地址前缀（如 '0x' 或 false）"
"connect","(wallet?:Wallet,options?:ConnectOptions)=>Promise<void|Account>","否","连接方法"
"disconnect","()=>Promise<void>","否","断开方法"
"switchChain","(chain:Chain)=>Promise<void>","否","切链方法"
"getNFTMetadata","({address,tokenId?})=>Promise<NFTMetadata>","否","NFT 元数据解析"
"sign","SignConfig","否","应用层签名配置"
```

### Chain 对象（TSV）
```tsv
字段	类型	必填	说明
id	ChainIds|number|TronChainIds	是	链 ID
name	string	是	链名称
type	ChainType	否	虚拟机类型
icon	ReactNode	否	链图标
browser.icon	ReactNode	否	浏览器图标
browser.getBrowserLink	(address,type)=>string	否	生成浏览器链接（address|transaction）
nativeCurrency	BalanceMetadata & {name:string}	否	原生币信息
```

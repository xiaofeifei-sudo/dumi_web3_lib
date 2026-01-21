# pelican-web3-lib-assets · API 对接文档（Lark 完整版）

摘要
- 统一提供链（Chain）、钱包（WalletMetadata）、代币（Token）的展示与元数据，用于 React 项目的 UI 渲染与基础交互。
- 适配 Ant Design Web3 组件与示例，也可独立使用；本包仅提供“展示与元数据”，不包含连接与签名逻辑。

适用读者
- 前端开发者、DApp 工程师、Web3 组件集成者。

术语释义
- Chain：链对象，包含链标识、图标、原生代币与浏览器链接生成方法。
- Token：代币对象，包含跨链合约地址与图标。
- WalletMetadata：钱包展示元数据（图标、官网、扩展、分组、协议能力、二维码/DeepLink 模板）。

## 安装

```bash
npm install pelican-web3-lib-assets
```

本包为 sideEffects: false，支持良好的 tree-shaking。

## 导出结构与导入路径
- 顶层入口重导出：chains / wallets / tokens
- 推荐导入路径：
  - 链：
    ```ts
    import {
      Mainnet, Sepolia, Holesky, Polygon, BSC, BSCTestNet, Arbitrum, Optimism, Avalanche, Base,
      Scroll, ScrollSepolia, Hardhat, Localhost, TronMainnet, TronShastaNet, TronNileNet,
      Solana, SolanaDevnet, SolanaTestnet,
      suiMainnet, suiTestnet, suiDevnet, suiLocalnet
    } from 'pelican-web3-lib-assets/chains';
    ```
  - 代币：
    ```ts
    import { USDT, USDC, ETH, SUI, TUSD, DAI, LINK } from 'pelican-web3-lib-assets/tokens';
    ```
  - 钱包：
    ```ts
    import {
      metadata_MetaMask, metadata_WalletConnect, metadata_OkxWallet, metadata_CoinbaseWallet, metadata_RainbowWallet,
      metadata_Phantom, metadata_imToken, metadata_MobileConnect, metadata_Safeheron, metadata_TokenPocket,
      metadata_Trust, metadata_Unisat, metadata_Xverse, metadata_Backpack, metadata_Solflare, metadata_Suiet, metadata_Slush
    } from 'pelican-web3-lib-assets/wallets';
    ```

## API 模型

### Chain（链对象）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| id | 枚举 | 是 | 唯一链标识（EVM: ChainIds；Solana: SolanaChainIds；Tron: TronChainIds；Sui: SuiChainIds） | ChainIds.Mainnet |
| name | string | 是 | 链名称 | Ethereum |
| type | ChainType | 否 | 链类型（主要用于区分 EVM） | ChainType.EVM |
| icon | ReactElement | 建议 | 链图标（JSX 元素） | {Mainnet.icon} |
| nativeCurrency | object | 建议 | 原生代币信息 | { name: 'Ether', symbol: 'ETH', decimals: 18 } |
| nativeCurrency.icon | ReactElement | 否 | 原生币图标 | <EthereumFilled /> |
| browser | object | 否 | 区块浏览器展示与链接生成 | 见下 |
| browser.icon | ReactElement | 否 | 浏览器图标 | <EtherscanCircleColorful /> |
| browser.getBrowserLink | (address: string, type: string) => string | 否 | 生成浏览器链接（type 按链实现：address/tx/token 等） | Mainnet.browser.getBrowserLink('0x...','address') |

Browser（子结构）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| icon | ReactElement | 否 | 浏览器图标 | <PolygonCircleColorful /> |
| getBrowserLink | Function | 是 | 传入地址与类型返回浏览器链接 | https://etherscan.io/address/0x... |

代码参考：EVM [ethereum.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/ethereum.tsx)、Solana [solana.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/solana.tsx)、Tron [tron.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/tron.tsx)、Sui [sui.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/sui.tsx)

### Token（代币对象）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| name | string | 是 | 代币名称 | Tether USD |
| symbol | string | 是 | 代币符号 | USDT |
| decimal | number | 是 | 精度（小数位） | 6 |
| icon | ReactElement | 建议 | 代币图标（JSX 元素） | {USDT.icon} |
| availableChains | Array<AvailableChain> | 是（可空） | 跨链合约配置，原生资产可无合约地址 | 见下 |

AvailableChain（数组项）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| chain | Chain | 是 | 指向具体链对象 | Mainnet |
| contract | string | 否 | 该链合约地址；原生资产可为空 | 0xdac17f...（USDT@Mainnet） |

代码参考：USDT [usdt.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/tokens/usdt.tsx)、USDC [usdc.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/tokens/usdc.tsx)、ETH [eth.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/tokens/eth.tsx)

### WalletMetadata（钱包元数据）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| name | string | 是 | 钱包名称 | MetaMask |
| remark | string | 否 | 描述/备注 | MetaMask Wallet |
| icon | ReactElement | 是 | 钱包图标 | {metadata_MetaMask.icon} |
| app | { link: string } | 否 | 官网/下载链接 | https://metamask.io/ |
| extensions | Array<Extension> | 否 | 浏览器扩展信息 | 见下 |
| group | string | 否 | 展示分组 | Popular |
| universalProtocol | { link: string } | 否 | 通用协议入口（如 WalletConnect） | https://walletconnect.com/ |
| deeplink | { urlTemplate: string } | 否 | 深链模板（示例：Phantom） | https://phantom.com/ul/browse/${url}?ref=${ref} |
| supportChainTypes | Array<ChainType> | 否 | 支持的链类型 | [ChainType.EVM] |
| transferQRCodeFormatter | (params) => string | 否 | 生成支付/转账二维码（EIP-681 等） | 见下 |

Extension（数组项）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| key | string | 是 | 唯一键（浏览器名） | Chrome |
| browserIcon | ReactElement | 否 | 浏览器图标 | <ChromeCircleColorful /> |
| browserName | string | 是 | 浏览器名称 | Chrome |
| link | string | 是 | 扩展商店链接 | https://chromewebstore... |
| description | string | 否 | 扩展说明 | Access your wallet... |

transferQRCodeFormatter 参数
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| toAddress | string | 是 | 收款地址 | 0xRecipient |
| chainId | number | 是 | EVM 链 ID | 1 |
| amount | string | 是 | 金额：ETH 为 ETH 值，Token 为人类可读数量 | 0.01 |
| tokenAddress | string | 否 | 代币合约地址（Token 转账需提供） | 0xTokenAddress |
| decimal | number | 否 | 代币精度（Token 转账需提供） | 6 |

代码参考：MetaMask（二维码）[meta-mask.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/meta-mask.tsx)、imToken（二维码）[im-token.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/im-token.tsx)、WalletConnect [wallet-connect.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/wallet-connect.tsx)、Phantom（deeplink）[phantom.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/phantom.tsx)

## 导出清单

### Chains（链常量）
| 名称 | 网络/用途 | 类型 | 浏览器示例 |
| --- | --- | --- | --- |
| Mainnet | Ethereum 主网 | EVM | etherscan.io |
| Sepolia | Ethereum 测试网 | EVM | sepolia.etherscan.io |
| Holesky | Ethereum 测试网 | EVM | holesky.etherscan.io |
| Polygon | Polygon 主网 | EVM | polygonscan.com |
| BSC | BNB Smart Chain 主网 | EVM | bscscan.com |
| BSCTestNet | BNB Smart Chain 测试网 | EVM | bscscan.com |
| Arbitrum | Arbitrum One 主网 | EVM | arbiscan.io |
| Optimism | OP 主网 | EVM | optimistic.etherscan.io |
| Avalanche | Avalanche 主网 | EVM | snowtrace.io |
| Base | Base 主网 | EVM | basescan.org |
| Scroll | Scroll 主网 | EVM | scrollscan.com |
| ScrollSepolia | Scroll 测试网 | EVM | sepolia.scrollscan.com |
| Hardhat | 本地开发链 | EVM | 无 |
| Localhost | 本地链 | EVM | 无 |
| Solana | Solana 主网 | Solana | explorer.solana.com |
| SolanaDevnet | Solana Devnet | Solana | explorer.solana.com?cluster=devnet |
| SolanaTestnet | Solana Testnet | Solana | explorer.solana.com?cluster=testnet |
| TronMainnet | Tron 主网 | Tron | tronscan.org |
| TronShastaNet | Tron Shasta | Tron | shasta.tronscan.org |
| TronNileNet | Tron Nile | Tron | nile.tronscan.org |
| suiMainnet | Sui 主网 | Sui | suiscan.xyz/mainnet |
| suiTestnet | Sui 测试网 | Sui | suiscan.xyz/testnet |
| suiDevnet | Sui Devnet | Sui | suiscan.xyz/devnet |
| suiLocalnet | Sui Local | Sui | 无 |

### Tokens（代币常量）
| 名称 | 符号 | 精度 | 跨链支持示例 |
| --- | --- | --- | --- |
| USDT | USDT | 6 | TronMainnet、Mainnet、Polygon、BSC、Arbitrum、Optimism、BSCTestNet、Sepolia、TronNileNet |
| USDC | USDC | 6 | Mainnet、Sepolia、Polygon、Arbitrum、Avalanche、Optimism、Solana、SolanaDevnet、suiMainnet、suiTestnet、TronMainnet |
| ETH | ETH | 18 | Mainnet（原生）、BSC（跨链合约） |
| SUI | SUI | 9 | Sui 原生（availableChains 空） |
| TUSD | TUSD | 6 | Mainnet、TronMainnet、BSC |
| DAI | DAI | 6 | Mainnet、Sepolia |
| LINK | LINK | 18 | 参见 tokens/link.tsx |

### Wallets（钱包元数据常量）
| 标识常量 | 展示名 | 说明/能力 |
| --- | --- | --- |
| metadata_MetaMask | MetaMask | 支持 EIP-681 二维码；EVM |
| metadata_WalletConnect | WalletConnect | 通用协议入口 |
| metadata_OkxWallet | OKX Wallet | 浏览器扩展；EVM |
| metadata_CoinbaseWallet | Coinbase Wallet | 浏览器扩展 |
| metadata_RainbowWallet | Rainbow Wallet | 浏览器扩展 |
| metadata_Phantom | Phantom | 浏览器扩展；deeplink 模板 |
| metadata_imToken | imToken | 支持转账二维码；EVM |
| metadata_MobileConnect | Scan QR Code | 移动端扫码入口（与 WalletConnect 组合） |
| metadata_Safeheron | Safeheron | 浏览器扩展 |
| metadata_TokenPocket | TokenPocket | 浏览器扩展；EVM |
| metadata_Trust | Trust | 浏览器扩展 |
| metadata_Unisat | Unisat Wallet | 浏览器扩展 |
| metadata_Xverse | Xverse | 浏览器扩展 |
| metadata_Backpack | Backpack | 浏览器扩展 |
| metadata_Solflare | Solflare | 浏览器扩展 |
| metadata_Suiet | Suiet | 浏览器扩展 |
| metadata_Slush | Slush | 浏览器扩展 |

## 使用示例

### 渲染图标与名称
```tsx
import { Mainnet, Polygon } from 'pelican-web3-lib-assets/chains';
import { USDT, ETH } from 'pelican-web3-lib-assets/tokens';
import { metadata_MetaMask } from 'pelican-web3-lib-assets/wallets';

export default () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    {Mainnet.icon}
    {metadata_MetaMask.icon}
    {USDT.icon}
    <span>{ETH.name} ({ETH.symbol})</span>
  </div>
);
```

### 生成区块浏览器链接
```ts
import { Mainnet, SolanaDevnet, TronMainnet } from 'pelican-web3-lib-assets/chains';

const evmAddressUrl = Mainnet.browser.getBrowserLink('0x0000000000000000000000000000000000000000', 'address');
const solanaAddressUrl = SolanaDevnet.browser.getBrowserLink('9xQeWvG...', 'address'); // 自动带 ?cluster=devnet
const tronTxUrl = TronMainnet.browser.getBrowserLink('TXID_OR_ADDRESS', 'tx');
```

### 遍历代币跨链合约地址
```ts
import { USDT } from 'pelican-web3-lib-assets/tokens';

USDT.availableChains.forEach(({ chain, contract }) => {
  console.log(chain.name, contract || '(native)');
});
```

### 生成支付二维码（MetaMask / imToken）
```ts
import { metadata_MetaMask, metadata_imToken } from 'pelican-web3-lib-assets/wallets';

// MetaMask：ETH 普通转账（单位 ETH）
const q1 = metadata_MetaMask.transferQRCodeFormatter({
  toAddress: '0xRecipient',
  chainId: 1,
  amount: '0.01',
});

// MetaMask：Token 转账（单位为人类可读数量；内部按 decimal 校准）
const q2 = metadata_MetaMask.transferQRCodeFormatter({
  toAddress: '0xRecipient',
  chainId: 1,
  tokenAddress: '0xTokenAddress',
  decimal: 6,
  amount: '10',
});

// imToken：普通转账或 Token 转账（ethereum: 前缀格式）
const q3 = metadata_imToken.transferQRCodeFormatter({
  toAddress: '0xRecipient',
  chainId: 1,
  amount: '0.5',
});
```

## 常见问题与注意事项
- React 运行环境：本包使用 JSX 图标元素；请确保 React 版本满足 peer 依赖（>=17）。
- 浏览器链接类型：getBrowserLink 的第二个参数 type 在不同链实现中可能不同；EVM 常见 'address'/'tx'/'token'；Tron/Sui/Solana 已分别适配。
- 原生资产与合约地址：像 ETH@Mainnet 不需要合约地址；USDT/USDC 等在不同链的地址不同。
- 二维码规范：
  - MetaMask 的 transferQRCodeFormatter 兼容 EIP-681；
  - imToken 使用 ethereum: 前缀格式（见代码实现）。
- 与连接能力的关系：本包仅提供“展示元数据”；实际连接（如 WalletConnect 的 projectId 配置与二维码弹窗）需在对应 Provider 层完成（例如 Wagmi/EVM Provider 的 walletConnect.projectId）。
- Tree-shaking：sideEffects: false，建议按需导入子模块（chains/tokens/wallets）。
- 安全：不要在日志中输出私钥、助记词或敏感地址；二维码仅用于演示与手动扫描。

## 版本与兼容
- 当前版本：1.0.2（参考 [CHANGELOG.md](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/CHANGELOG.md)）
- 依赖：
  - pelican-web3-lib-common（类型与工具）
  - pelican-web3-lib-icons（图标集合）
- peerDependencies：
  - react >= 17.0.0
  - react-dom >= 17.0.0
- 构建：father build/dev；TypeScript ≥ 5.6；typings 输出到 dist/esm。

## 源码导航（定位链接）
- 包入口：[index.ts](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/index.ts)
- 链集合：[chains/index.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/index.tsx)
- EVM 链实现：[ethereum.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/ethereum.tsx)
- Solana 链实现：[solana.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/solana.tsx)
- Tron 链实现：[tron.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/tron.tsx)
- Sui 链实现：[sui.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/chains/sui.tsx)
- 代币集合：[tokens/index.ts](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/tokens/index.ts)
- USDT 元数据：[usdt.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/tokens/usdt.tsx)
- USDC 元数据：[usdc.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/tokens/usdc.tsx)
- ETH 元数据：[eth.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/tokens/eth.tsx)
- 钱包集合：[wallets/index.ts](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/index.ts)
- MetaMask（二维码）：[meta-mask.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/meta-mask.tsx)
- imToken（二维码）：[im-token.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/im-token.tsx)
- WalletConnect：[wallet-connect.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/wallet-connect.tsx)
- Phantom（deeplink）：[phantom.tsx](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/assets/src/wallets/phantom.tsx)

## 附录：飞书表格粘贴辅助（TSV/CSV）
为方便将模型表格粘贴到飞书文档，可使用以下 TSV/CSV。在 Excel/Sheets 中粘贴并复制整块，再粘到飞书通常更稳定。

### Chain 模型（TSV）
```tsv
字段	类型	必填	说明	示例
id	枚举	是	唯一链标识（EVM: ChainIds；Solana: SolanaChainIds；Tron: TronChainIds；Sui: SuiChainIds）	ChainIds.Mainnet
name	string	是	链名称	Ethereum
type	ChainType	否	链类型（主要用于区分 EVM）	ChainType.EVM
icon	ReactElement	建议	用于 UI 渲染的链图标	{Mainnet.icon}
nativeCurrency	object	建议	原生代币信息	{name:'Ether',symbol:'ETH',decimals:18}
nativeCurrency.icon	ReactElement	否	原生币图标（部分链提供）	<EthereumFilled />
browser	object	否	区块浏览器展示与链接生成	见下
browser.icon	ReactElement	否	浏览器图标	<EtherscanCircleColorful />
browser.getBrowserLink	(address:string,type:string)=>string	否	生成浏览器链接（type 按链实现：address/tx/token 等）	Mainnet.browser.getBrowserLink('0x...','address')
```

### Token 模型（TSV）
```tsv
字段	类型	必填	说明	示例
name	string	是	代币名称	Tether USD
symbol	string	是	代币符号	USDT
decimal	number	是	精度（小数位）	6
icon	ReactElement	建议	代币图标（JSX 元素）	{USDT.icon}
availableChains	Array<AvailableChain>	是（可空）	跨链合约配置，原生资产可无合约地址	见下
```

### WalletMetadata 模型（TSV）
```tsv
字段	类型	必填	说明	示例
name	string	是	钱包名称	MetaMask
remark	string	否	描述/备注	MetaMask Wallet
icon	ReactElement	是	钱包图标	{metadata_MetaMask.icon}
app	{link:string}	否	官网/下载链接	https://metamask.io/
extensions	Array<Extension>	否	浏览器扩展信息	见下
group	string	否	展示分组	Popular
universalProtocol	{link:string}	否	通用协议入口（如 WalletConnect）	https://walletconnect.com/
deeplink	{urlTemplate:string}	否	深链模板（示例：Phantom）	https://phantom.com/ul/browse/${url}?ref=${ref}
supportChainTypes	Array<ChainType>	否	支持的链类型	[ChainType.EVM]
transferQRCodeFormatter	(params)=>string	否	生成支付/转账二维码（EIP-681 等）	见下
```

### Chains 导出清单（CSV）
```csv
"名称","网络/用途","类型","浏览器示例"
"Mainnet","Ethereum 主网","EVM","etherscan.io"
"Sepolia","Ethereum 测试网","EVM","sepolia.etherscan.io"
"Holesky","Ethereum 测试网","EVM","holesky.etherscan.io"
"Polygon","Polygon 主网","EVM","polygonscan.com"
"BSC","BNB Smart Chain 主网","EVM","bscscan.com"
"BSCTestNet","BNB Smart Chain 测试网","EVM","bscscan.com"
"Arbitrum","Arbitrum One 主网","EVM","arbiscan.io"
"Optimism","OP 主网","EVM","optimistic.etherscan.io"
"Avalanche","Avalanche 主网","EVM","snowtrace.io"
"Base","Base 主网","EVM","basescan.org"
"Scroll","Scroll 主网","EVM","scrollscan.com"
"ScrollSepolia","Scroll 测试网","EVM","sepolia.scrollscan.com"
"Hardhat","本地开发链","EVM","无"
"Localhost","本地链","EVM","无"
"Solana","Solana 主网","Solana","explorer.solana.com"
"SolanaDevnet","Solana Devnet","Solana","explorer.solana.com?cluster=devnet"
"SolanaTestnet","Solana Testnet","Solana","explorer.solana.com?cluster=testnet"
"TronMainnet","Tron 主网","Tron","tronscan.org"
"TronShastaNet","Tron Shasta","Tron","shasta.tronscan.org"
"TronNileNet","Tron Nile","Tron","nile.tronscan.org"
"suiMainnet","Sui 主网","Sui","suiscan.xyz/mainnet"
"suiTestnet","Sui 测试网","Sui","suiscan.xyz/testnet"
"suiDevnet","Sui Devnet","Sui","suiscan.xyz/devnet"
"suiLocalnet","Sui Local","Sui","无"
```

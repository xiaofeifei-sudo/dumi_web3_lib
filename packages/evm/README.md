# pelican-web3-lib-evm

EVM（以太坊及兼容链）接入库。提供 Provider 组件、钱包工厂、链映射与通用资产，兼容 wagmi 与 viem。文档遵循 Lark 风格，覆盖每个用法与模型，避免依赖源码阅读即可完成对接。

## 安装
- 依赖（peer）：wagmi、viem、@tanstack/react-query
- 建议使用 pnpm 或 npm 安装

```bash
pnpm add pelican-web3-lib-evm wagmi viem @tanstack/react-query
```

## 导出结构
- Provider：WagmiWeb3ConfigProvider（含 WalletConnect、EIP-6963、SIWE 等配置）
- 钱包工厂：MetaMask、OKXWallet、TokenPocket、RainbowWallet、ImToken、CoinbaseWallet、MobileWallet、WalletConnect、Safeheron、UniversalWallet
- 类型接口：WalletFactory、WalletUseInWagmiAdapter、EIP6963Config、ChainAssetWithWagmiChain、SIWEConfig、CreateWalletOptions
- 链映射：Mainnet、Polygon、Arbitrum、Optimism、Avalanche、Base、Scroll、ScrollSepolia、Hardhat、Localhost、X1Testnet 等
- 资产导出：tokens（主流代币元数据）、wallets（钱包元数据）

## 快速开始
- 将 Provider 包裹在应用根节点或路由级节点
- 配置链（chains）、钱包（wallets）、WalletConnect（含 projectId）、EIP-6963、SIWE（可选）
- 开启 ENS、余额查询（可选）

```tsx
import React from 'react';
import { WagmiWeb3ConfigProvider } from 'pelican-web3-lib-evm';
import { Mainnet, Polygon } from 'pelican-web3-lib-evm';
import { MetaMask, WalletConnect } from 'pelican-web3-lib-evm';

export default function App() {
  return (
    <WagmiWeb3ConfigProvider
      chains={[Mainnet, Polygon]}
      wallets={[
        MetaMask(),
        WalletConnect({ useWalletConnectOfficialModal: true }),
      ]}
      walletConnect={{
        projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
        metadata: {
          name: 'Your DApp',
          description: 'Connect with WalletConnect',
          url: 'https://your.site',
          icons: ['https://your.site/icon.png'],
        },
        useWalletConnectOfficialModal: true,
      }}
      eip6963={true}
      ens
      balance
    >
      {/* your app */}
    </WagmiWeb3ConfigProvider>
  );
}
```

## Provider 用法
- 自动生成或复用 wagmi Config：
  - 未传入 config 时，根据 chains、wallets、walletConnect 自动生成
  - 传入 config 时默认补充 Mainnet 资产映射
- 支持多 Provider 合并与切换：
  - ignoreConfig: true 时忽略该 Provider 的配置，适合多链 Provider 切换避免闪烁
- QueryClient 自动合并：
  - 未传入 queryClient 时内部创建
- 余额与 ENS：
  - balance: true 时查询余额（符号/数值/精度/图标）
  - ens: true 时获取 ENS 名称与头像

核心属性说明（简述）：
- chains: 链资产与 wagmi 链映射集合
- wallets: 钱包工厂集合，用于生成连接器与钱包
- walletConnect: WalletConnect 配置或关闭（false）
- eip6963: 注入式钱包自动发现与生成
- siwe: Sign-In With Ethereum 登录配置
- transports: 自定义 RPC Transport（按链 id 映射）
- ignoreConfig: 多 Provider 场景下的合并控制

## 链映射
- 使用内置链资产映射，或自定义 ChainAssetWithWagmiChain
- 仅需在 Provider 的 chains 中传入映射集合即可
- 未在映射中出现的 wagmi 链会提示需配置

示例：
- Mainnet、Polygon、Arbitrum、Optimism、Avalanche、Base、Scroll、ScrollSepolia、Hardhat、Localhost、X1Testnet

## 钱包接入
- 工厂模式（WalletFactory）统一返回 WalletUseInWagmiAdapter
- create 方法接收连接器列表与可选项，返回具备以下能力的钱包：
  - getWagmiConnector(options): 根据连接方式与安装状态返回合适的连接器
  - hasExtensionInstalled(): 检测是否安装浏览器扩展
  - hasWalletReady(): 检测钱包是否就绪（扩展或 WalletConnect）
  - getQrCode(): WalletConnect 获取二维码（监听 display_uri 事件）
  - customQrCodePanel: 是否使用官方二维码弹窗

常用钱包工厂：
- MetaMask、OKXWallet、TokenPocket、RainbowWallet、ImToken：基于 Injected + WalletConnect（由 UniversalWallet 推断）
- CoinbaseWallet：自带连接器工厂
- MobileWallet：移动端能力封装（深链/跳转）
- WalletConnect：显式 WalletConnect 工厂，可独立启用官方二维码弹窗
- Safeheron：基于注入式连接器检测安装与就绪

## EIP‑6963（注入式钱包自动发现）
- eip6963 配置为 true 或对象时启用自动发现
- 自动将页面注入的 injected 连接器转换为钱包并追加到列表
- 适用于用户安装但未在 wallets 显式配置的钱包
- 自动发现的钱包具备 hasExtensionInstalled 和 hasWalletReady 能力

## SIWE（Sign‑In With Ethereum）
- siwe 配置对象包含 getNonce(address)、createMessage(params)、verifyMessage(message, signature)
- signIn 流程：
  - 获取 nonce
  - 生成消息（包含 domain、address、uri、nonce、version、chainId）
  - 发起签名并验证
  - 状态更新为 Signed
- 若抛出错误，可在上层捕获并提示用户重试或更换链/钱包

## WalletConnect 配置
- 必须配置 projectId，否则无法连接
- 可启用官方二维码弹窗（useWalletConnectOfficialModal）
- 支持 metadata、relayUrl、storageOptions、qrModalOptions 等
- 与钱包工厂同时生效：Provider 内生成 WalletConnect 连接器，工厂内提供二维码与弹窗控制

## RPC Transports
- 按链 id 映射 Transport（viem http）
- 未传入时默认为 Mainnet 的 http()
- 建议为业务相关链配置稳定的 RPC

## 能力矩阵（钱包）

| 钱包 | Injected 扩展检测 | WalletConnect | 二维码获取 | 官方二维码弹窗 | 移动端深链/跳转 |
| --- | --- | --- | --- | --- | --- |
| MetaMask | 是 | 是 | 是 | 受控 | 否 |
| OKXWallet | 是 | 是 | 是 | 受控 | 否 |
| TokenPocket | 是 | 是 | 是 | 受控 | 否 |
| RainbowWallet | 是 | 是 | 是 | 受控 | 否 |
| ImToken | 是 | 是 | 是 | 受控 | 否 |
| CoinbaseWallet | 是 | 是 | 是 | 受控 | 否 |
| Safeheron | 是 | 否 | 否 | 否 | 否 |
| WalletConnect | 否 | 是 | 是 | 受控 | 否 |
| MobileWallet | 否 | 是 | 是 | 受控 | 是 |

说明：
- “受控”表示可通过 useWalletConnectOfficialModal 或 Provider 的 walletConnect.useWalletConnectOfficialModal 控制
- Injected 检测通过 connector.getProvider() 判断

## API 模型（接口）

WalletFactory

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| name | string | 工厂名称 |
| connectors | string[] | 支持连接器名称列表 |
| create | function(connector[],options) | 创建钱包适配对象 |
| createWagmiConnector | function() | 创建 wagmi 连接器（可选） |

WalletUseInWagmiAdapter

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| getWagmiConnector | function(options) | 返回合适的连接器（二维码/扩展） |
| hasExtensionInstalled | function() | 是否安装扩展 |
| hasWalletReady | function() | 钱包是否就绪 |
| getQrCode | function() | WalletConnect 二维码获取（可选） |
| customQrCodePanel | boolean | 是否启用官方二维码弹窗 |

EIP6963Config

| 类型 | 说明 |
| --- | --- |
| boolean | 启用/关闭自动发现 |
| object | 通用 EIP‑6963 配置（UniversalEIP6963Config） |

ChainAssetWithWagmiChain

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 链 ID |
| name | string | 链名称 |
| icon | ReactNode | 链图标 |
| wagmiChain | object | 对应 wagmi 链对象 |

SIWEConfig

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| getNonce | function(address,chainId?) | 获取地址 nonce |
| createMessage | function(params) | 生成签名消息 |
| verifyMessage | function(message,signature) | 验证签名有效性 |

CreateWalletOptions

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| useWalletConnectOfficialModal | boolean | 是否启用官方二维码弹窗 |

WalletConnectOptions（Provider）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| projectId | string | WalletConnect 项目 ID（必填） |
| metadata | object | 应用元数据（名称/描述/URL/图标） |
| disableProviderPing | boolean | 禁用 ping（可选） |
| isNewChainsStale | boolean | 新链是否陈旧（可选） |
| relayUrl | string | 中继 URL（可选） |
| storageOptions | object | 存储配置（可选） |
| qrModalOptions | object | 二维码弹窗配置（可选） |
| useWalletConnectOfficialModal | boolean | 是否使用官方二维码弹窗 |

## 常见问题（FAQ）
- 无法连接 WalletConnect：请确保在 Provider 的 walletConnect 中配置了有效的 projectId<mccoremem id="01KFD2N4QMDC3GP5XKW3BNPHN9" />
- 钱包未显示：若已安装扩展但未在 wallets 显式配置，可启用 eip6963 自动发现
- 多链切换闪烁：在非激活 Provider 上设置 ignoreConfig: true，避免合并时闪烁
- ENS/余额为空：检查是否在 Provider 上启用 ens 与 balance，并确认 RPC 可用
- 移动端二维码：WalletConnect 工厂提供 getQrCode；如需官方弹窗设置 useWalletConnectOfficialModal

## 错误码（连接钱包）
- 下列错误码与标识便于在连接钱包、切换链、签名时定位问题来源

EIP‑1193（Provider 标准错误码）

| 错误码 | 名称 | 说明 |
| --- | --- | --- |
| 4001 | User Rejected Request | 用户拒绝请求（如连接、签名、切链等） |
| 4100 | Unauthorized | 未授权访问（当前账户/方法不允许） |
| 4200 | Unsupported Method | 不支持的方法（钱包未实现该 RPC） |
| 4900 | Disconnected | 提供者已断开连接（需重新初始化连接） |
| 4901 | Chain Disconnected | 当前链未连接（切换或重新连接到目标链） |
| 4902 | Switch Chain Error | 切换链发生错误（钱包不支持或参数不正确） |

EIP‑5792（Provider 能力相关错误码）

| 错误码 | 名称 | 说明 |
| --- | --- | --- |
| 5700 | Unsupported non‑optional capability | 钱包不支持一个未标记为可选的能力 |
| 5710 | Unsupported chain id | 钱包不支持请求的链 ID |
| 5720 | Duplicate ID | 存在重复的 Bundle ID |
| 5730 | Unknown bundle id | 未知的 Bundle ID（尚未提交或不正确） |
| 5740 | Bundle too large | 调用 Bundle 过大，钱包无法处理 |
| 5750 | Atomic‑ready wallet rejected upgrade | 钱包可升级支持原子性，但用户拒绝升级 |
| 5760 | Atomicity not supported | 钱包不支持原子执行，但请求要求原子性 |

JSON‑RPC 常见错误码（由钱包或节点返回，EIP‑1474）

| 错误码 | 说明 |
| --- | --- |
| -1 | 未知 RPC 错误（返回结构不含标准 code） |
| -32700 | JSON 解析错误（服务器解析 JSON 文本时失败） |
| -32600 | 无效请求（请求对象不符合 JSON‑RPC 规范） |
| -32601 | 方法不存在或不可用（节点或钱包不支持该 RPC） |
| -32602 | 参数无效（类型、顺序或数量错误） |
| -32603 | 内部错误（钱包/节点内部异常） |
| -32000 | 缺失或无效的参数（请补全或修正取值） |
| -32001 | 资源未找到（目标资源标识错误或暂不可用） |
| -32002 | 资源不可用（稍后重试或更换到可用资源） |
| -32003 | 交易创建失败（余额不足、nonce 冲突、gas 设置不当） |
| -32004 | 方法不支持（使用受支持方法或升级 Provider/节点） |
| -32005 | 请求超出限制（降低频率、分页或缩小返回数据） |
| -32006 | 不支持的 JSON‑RPC 版本（使用兼容版本） |
| -32042 | 方法不存在或不可用（与 -32601 含义相近） |

自定义错误码（EVM 适配层）

| 错误码 | 名称 | 说明 |
| --- | --- | --- |
| 5000 | ProviderNotFound | 未找到可用的钱包 Provider（未安装或未启用扩展/应用） |
| 5001 | ConnectorNotFound | 未找到可用的钱包连接器（配置缺失或钱包未支持） |
| 5002 | ConnectorChainMismatch | 连接器当前链与连接使用的链不一致 |
| 5003 | ChainNotConfigured | 请求的链未在当前应用中配置 |
| 5004 | ConnectorAlreadyConnected | 当前连接器已连接（避免重复连接或切换前需先断开） |
| 5005 | SwitchChainNotSupported | 当前钱包不支持程序化切链或切链失败 |
| 5012 | ConnectorUnavailableReconnecting | 连接器处于重连阶段，不可用（仅保证 id/name/type/uid 可用） |
| 5016 | ConnectorNotConnected | 连接器未连接（需要先在钱包中连接账户） |

说明：
- 以上错误码主要由 wagmi 的错误类型（如 ProviderNotFoundError、ConnectorNotFoundError 等）在适配层映射得到
- 便于前端统一根据 code 做文案与埋点统计，而无需感知具体实现库

WalletConnect 常见错误场景（标识/文案）

- PROJECT_ID_INVALID：projectId 无效或未配置，无法建立会话
- WC_MODAL_CLOSED：用户关闭二维码弹窗，连接中断
- WC_CONNECTION_TIMEOUT：会话建立超时（网络或中继服务不稳定）
- Peer Disconnected/Session Deleted：对端关闭或会话被删除，需要重新扫描二维码

处理建议
- 4001：提示用户确认操作或重试；必要时更换钱包
- 4100/4200：检查调用方法与权限；避免使用钱包不支持的 RPC
- 4900/4901：执行重新连接或切换到可用链，再重试操作
- 4902：确认钱包支持目标链与切链参数正确；必要时提示手动切换
- EIP‑5792：按能力错误提示调整能力选项或更换支持该能力的钱包
- JSON‑RPC：根据返回 message 提示具体原因（余额、gas、nonce、方法、版本/限制/资源等）
- 5000–5005/5012/5016：根据“自定义错误码（EVM 适配层）”表定位 Provider/Connector/链配置问题
- WalletConnect：校验 projectId 与网络状态；必要时重启二维码会话

库内行为（normalizeEvmError）
- 对标准错误码进行中文说明与操作建议，并附加上下文提示（操作/钱包/链）
- 当错误包含自定义错误码（5000+）时，输出对应中文说明，便于前端统一处理
- 当错误不包含标准 code 且为已知错误类型（含明确 name）时，优先按 name 映射到上述自定义错误码
- 当仍无法识别错误类型时使用 -1，并保留原始错误信息供排查

## Lark 表格粘贴提示
- 如直接粘贴 CSV 到 Lark 表格出现整段进入首格现象：
  - 先将 CSV 内容粘贴到 Excel 或 WPS
  - 使用“数据分列”或自动识别逗号分隔
  - 选中分列后的整块单元格复制到 Lark 表格

## 版本与发布
- 私有 npm 仓库：支持发布到 Verdaccio（示例：192.168.1.50:4873）
- 建议通过 CI/CD 管理版本与发布流程

## 注意
- Provider 与钱包工厂的配置需保持一致性（例如链集合、WalletConnect 项目 ID）
- 避免在生产环境使用不稳定的 RPC
- 文档未包含源码链接，所有用法均已在模型与示例中详细说明

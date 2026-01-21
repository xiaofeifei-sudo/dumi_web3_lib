# pelican-web3-lib-bitcoin · API 对接文档（Lark 完整版）

摘要
- 为 pelican-web3-lib 提供比特币适配能力，支持常见钱包（Xverse、Unisat、OKX、Phantom）连接与账户管理。
- 提供统一的适配器接口（BitcoinWallet）、Provider 容器（BitcoinWeb3ConfigProvider）、钱包工厂（UnisatWallet/XverseWallet/OkxWallet/PhantomWallet）、错误类型与工具方法。

适用读者
- 前端开发者、DApp 工程师、Web3 组件集成者（Bitcoin/Ordinals）。

## 安装

```bash
npm install pelican-web3-lib pelican-web3-lib-bitcoin
```

依赖与特性
- 内置 sats-connect（Xverse Provider）与浏览器钱包全局对象声明（Unisat/OKX/Phantom）。
- sideEffects: false，支持良好的 tree-shaking。

## 快速开始

```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import {
  BitcoinWeb3ConfigProvider,
  OkxWallet,
  UnisatWallet,
  XverseWallet,
} from 'pelican-web3-lib-bitcoin';

export default function App() {
  return (
    <BitcoinWeb3ConfigProvider
      wallets={[XverseWallet(), UnisatWallet(), OkxWallet()]}
      balance
      autoConnect
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </BitcoinWeb3ConfigProvider>
  );
}
```

### 直接使用 Hook
```tsx
import { useBitcoinWallet } from 'pelican-web3-lib-bitcoin';

export const Demo = () => {
  const { connect, account, getBalance, signMessage, sendTransfer, signPsbt, getInscriptions } = useBitcoinWallet();
  // 示例：连接钱包、查询余额、签名消息
  // await connect();
  // const b = await getBalance();
  // const sig = await signMessage('hello');
  return null;
};
```

## 导出结构
- 入口聚合：[src/index.ts](file:///Users/ning/Desktop/Template/Web3Template/ant-design-web3-main/packages/bitcoin/src/index.ts)
  - provider：BitcoinWeb3ConfigProvider
  - wallets：UnisatWallet、XverseWallet、OkxWallet、PhantomWallet
  - hooks：useBitcoinWallet
  - types：SignPsbtParams、SignPsbtOptions、TransferParams、Inscription 等
  - error：NoProviderError、NoAddressError、NoBalanceError、NoInscriptionError、NotImplementedError

## API 模型

### BitcoinWeb3ConfigProvider（Props）
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| wallets | WalletFactory[] | 否 | 钱包工厂列表（如 UnisatWallet()） |
| locale | Locale | 否 | 国际化语言配置（透传给通用 Web3ConfigProvider） |
| balance | boolean | 否 | 是否展示余额（会调用适配器 getBalance） |
| autoConnect | boolean | 否 | 是否在页面加载时自动连接最近使用的钱包 |

### BitcoinWallet（适配器接口）
| 方法/字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| name | string | 是 | 钱包名称 |
| provider | any | 否 | 底层 Provider |
| account | Account | 否 | 当前账户（ordinals 地址） |
| getBalance | () => Promise<Balance> | 是 | 获取余额 |
| connect | () => Promise<void> | 是 | 连接钱包 |
| signMessage | (message: string) => Promise<string> | 是 | 消息签名 |
| sendTransfer | (params: TransferParams) => Promise<string> | 是 | 比特币转账 |
| signPsbt | (params: SignPsbtParams) => Promise<SignPsbtResult> | 是 | PSBT 签名 |
| getInscriptions | (offset?: number, size?: number) => Promise<{ total: number; list: Inscription[] }> | 是 | 读取 Ordinals 铭文 |

### Types（签名与转账）
| 名称 | 字段 | 说明 |
| --- | --- | --- |
| SignPsbtOptions | signInputs?: Record<string, number[]>; broadcast?: boolean; signHash?: number | 指定签名输入、是否广播、sighash |
| SignPsbtParams | psbt: string; options?: SignPsbtOptions | PSBT 十六进制 + 可选参数 |
| TransferParams | to: string; sats: number; options?: { feeRate: number } | 转账参数（sats 为聪；Unisat 支持 feeRate） |
| Inscription | 见 global.d.ts 中 Unisat.Inscription | Ordinals 铭文结构 |

### 错误类型
| 名称 | 默认信息 | 场景说明 |
| --- | --- | --- |
| NoProviderError | No Bitcoin wallet installed | 未检测到钱包 Provider |
| NoAddressError | Can't get address from Bitcoin wallet | 无法获取地址（未授权 / 钱包异常） |
| NoBalanceError | Can't fetch the balance | 余额查询失败（第三方服务异常） |
| NoInscriptionError | Failed to get inscriptions | 铭文查询失败 |
| NotImplementedError | Not implemented | 能力尚未实现 |

### WalletFactory（钱包工厂）
| 导出函数 | 描述 | 适配器 |
| --- | --- | --- |
| UnisatWallet | 绑定 Unisat 元数据并生成适配器 | UnisatBitcoinWallet |
| XverseWallet | 绑定 Xverse 元数据并生成适配器 | XverseBitcoinWallet |
| OkxWallet | 绑定 OKX 元数据并生成适配器 | OkxBitcoinWallet |
| PhantomWallet | 绑定 Phantom 元数据并生成适配器 | PhantomBitcoinWallet |

### 常量与辅助
- 常量：MEMPOOL_API、HIRO_API、ORDINALS_URL（第三方服务地址）
- 辅助：getInscriptionContentById（将铭文地址解析为图片链接，Provider 中用于 NFT 展示）

## 能力矩阵（钱包差异）
| 能力 | Unisat | Xverse | OKX | Phantom |
| --- | --- | --- | --- | --- |
| 连接 connect | 支持 | 支持（sats-connect） | 支持 | 支持 |
| 余额 getBalance | 支持 | 支持（常用 payment 地址） | 支持 | 支持（区分 ordinals/payment） |
| 消息签名 signMessage | 支持 | 支持 | 支持 | 支持 |
| 转账 sendTransfer | 支持（feeRate 可选） | 支持 | 支持 | 支持 |
| PSBT 签名 signPsbt | 支持 | 支持 | 支持 | 支持（签名索引策略不同） |
| 铭文 getInscriptions | 支持 | 支持 | 支持 | 支持 |

## 使用示例

### Provider + UI
```tsx
import { ConnectButton, Connector } from 'pelican-web3-lib';
import { BitcoinWeb3ConfigProvider, UnisatWallet, XverseWallet, OkxWallet } from 'pelican-web3-lib-bitcoin';

export default function App() {
  return (
    <BitcoinWeb3ConfigProvider wallets={[XverseWallet(), UnisatWallet(), OkxWallet()]} balance autoConnect>
      <Connector>
        <ConnectButton />
      </Connector>
    </BitcoinWeb3ConfigProvider>
  );
}
```

### 连接、查询余额、转账、签名
```tsx
import { useBitcoinWallet } from 'pelican-web3-lib-bitcoin';

export const Actions = () => {
  const { connect, getBalance, sendTransfer, signMessage, signPsbt, getInscriptions } = useBitcoinWallet();

  // await connect();
  // const b = await getBalance();
  // const txId = await sendTransfer({ to: 'bc1p...', sats: 1000, options: { feeRate: 15 } });
  // const sig = await signMessage('hello');
  // const psbtSig = await signPsbt({ psbt: 'hex_psbt', options: { broadcast: false } });
  // const { total, list } = await getInscriptions(0, 10);
  return null;
};
```

### autoConnect 与钱包记忆
- Provider 会记忆最近一次选择的钱包，并在 autoConnect=true 时尝试自动连接。

### NFT（铭文）展示
- Provider 内部通过 getNFTMetadata 将 Ordinals 铭文地址解析为图片链接并传递给上层组件展示。

## 接入步骤（详细）
- 步骤 1：安装依赖与钱包扩展/应用
  - 浏览器安装 Unisat/OKX/Phantom 扩展；移动端/桌面安装 Xverse 并确保 sats-connect 可用。
- 步骤 2：选择并注册钱包工厂
  - 在 Provider 的 wallets 传入 [XverseWallet(), UnisatWallet(), OkxWallet(), PhantomWallet()]（按需选择）。
- 步骤 3：包裹 UI 并初始化
  - 启用 balance（显示余额）与 autoConnect（自动连接最近钱包），可选 locale（国际化）。
- 步骤 4：连接与断开
  - 使用 ConnectButton/Connector 控件，或自行调用 useBitcoinWallet().connect() 与 Provider 的 disconnect。
- 步骤 5：账户与余额
  - 调用 getBalance 获取余额；部分钱包区分 ordinals/payment 地址，余额通常基于 payment 地址。
- 步骤 6：交易与签名
  - sendTransfer 传入 to/sats（聪）与可选 feeRate；signMessage 用于消息签名；signPsbt 传入 PSBT（十六进制）与可选 options。
- 步骤 7：铭文读取
  - getInscriptions(offset, size) 返回 total 与 list；list 元素包含 inscriptionId、contentType、preview 等字段（详见下表）。
- 步骤 8：错误处理
  - 捕获 NoProviderError、NoAddressError 等错误，给出 UI 反馈与重试/切换钱包选项。

## 详细用法（按方法）
- connect()
  - 行为：请求用户授权并初始化账户与 Provider。
  - 异常：NoProviderError（未安装钱包）、用户拒绝授权。
- getBalance()
  - 返回：余额对象（单位与精度因钱包实现而异，一般为聪或归一化 BTC）。
  - 建议：UI 中同时展示 BTC 与 sats，或做格式化。
- sendTransfer({ to, sats, options })
  - to：收款地址；sats：聪；options：如 { feeRate } 控制矿工费（部分钱包支持）。
  - 返回：交易 ID（txId）。
- signMessage(message)
  - 返回：签名字符串；用于链下校验或后续业务流程。
- signPsbt({ psbt, options })
  - psbt：十六进制字符串；options：签名输入、是否广播、sighash 类型。
  - 返回：签名结果（结构因钱包不同而略有差异）。
- getInscriptions(offset = 0, size = 10)
  - 返回：{ total, list }；list 为铭文数组。
  - 铭文字段（示例）：
    - address、inscriptionId、inscriptionNumber、contentType、contentLength、preview、timestamp、location、output 等。

## 常见问题与注意事项
- 浏览器 Provider：Unisat（window.unisat）、OKX（window.okxwallet）、Phantom（window.phantom?.bitcoin），Xverse 通过 sats-connect 获取。
- 余额来源：使用 mempool.space API 或钱包提供的余额接口（不同适配器实现有所不同）。
- PSBT 与转账：不同钱包对选项支持差异较大（如 Unisat 支持 feeRate；Xverse 通过 sats-connect 处理）。
- 安全：不要在日志中输出私钥、助记词或敏感信息；签名请求应提示用户确认来源。
- 仅展示适配：本包仅适配 Bitcoin 钱包与基本能力；更高级逻辑请在业务层实现。

## 版本与兼容
- 当前版本：1.0.2
- 依赖：
  - pelican-web3-lib-common（类型与 Web3ConfigProvider）
  - pelican-web3-lib-icons（图标集合）
  - sats-connect（Xverse Provider）
- 构建：father build/dev；TypeScript ≥ 5.6；typings 输出到 dist/esm。

## 附录：飞书表格粘贴辅助（TSV/CSV）
为方便将模型表格粘贴到飞书文档，可使用以下 TSV/CSV。在 Excel/Sheets 中粘贴并复制整块，再粘到飞书通常更稳定。

### BitcoinWallet（TSV）
```tsv
字段/方法	类型	必填	说明
name	string	是	钱包名称
provider	any	否	底层 Provider
account	Account	否	当前账户（ordinals 地址）
getBalance	()=>Promise<Balance>	是	获取余额
connect	()=>Promise<void>	是	连接钱包
signMessage	(message:string)=>Promise<string>	是	消息签名
sendTransfer	(params:TransferParams)=>Promise<string>	是	比特币转账
signPsbt	(params:SignPsbtParams)=>Promise<SignPsbtResult>	是	PSBT 签名
getInscriptions	(offset?:number,size?:number)=>Promise<{total:number;list:Inscription[]}>	是	读取 Ordinals 铭文
```

### Provider Props（CSV）
```csv
"字段","类型","必填","说明"
"wallets","WalletFactory[]","否","钱包工厂列表（如 UnisatWallet()）"
"locale","Locale","否","国际化语言配置"
"balance","boolean","否","是否展示余额（调用适配器 getBalance）"
"autoConnect","boolean","否","是否在页面加载时自动连接最近使用的钱包"
```

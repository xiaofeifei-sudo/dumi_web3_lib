/**
 * 公共类型与枚举定义
 * - 覆盖账户、链、余额、钱包、国际化、签名等核心领域模型
 * - 供各链实现与 UI 组件复用
 */
// biome-ignore lint/suspicious/noConstEnum: <explanation>
export const enum ConnectStatus {
  // 已连接
  Connected = 'connected',
  // 未连接
  Disconnected = 'disconnected',
  // 已签名（应用层认证成功）
  Signed = 'signed',
}

/// 账户信息
export interface Account {
  // 地址（不同链可能格式不同）
  address: string;
  // 显示名称（可选）
  name?: string;
  // 头像链接或节点（可选）
  avatar?: string;
  // 多地址集合（EVM 类链可使用 0x 前缀）
  addresses?: [`0x${string}`, ...`0x${string}`[]] | readonly `0x${string}`[];
  // 连接状态（可选）
  status?: ConnectStatus;
}

/// 链IDS
export enum ChainIds {
  // 以太坊主网
  Mainnet = 1,
  // Polygon
  Polygon = 137,
  // BNB Smart Chain
  BSC = 56,

  // BNB Smart Chain Testnet
  BSCTestNet = 97,

  // Arbitrum One
  Arbitrum = 42_161,
  // Optimism
  Optimism = 10,
  // Goerli 测试网
  Goerli = 5,
  // Avalanche
  Avalanche = 43_114,
  // OKX X1 测试网
  X1Testnet = 195,
  // Sepolia 测试网
  Sepolia = 11_155_111,
  // Holesky 测试网
  Holesky = 17_000,
  // Scroll 主网
  Scroll = 534_352,
  // Scroll Sepolia
  ScrollSepolia = 534_351,
  // Hardhat 本地
  Hardhat = 31_337,
  // 本地链
  Localhost = 1_337,
  // Base 主网
  Base = 8453,
}

/// Solana 链IDS
export enum SolanaChainIds {
  // Solana 主网 Beta
  MainnetBeta = 2,
  // 开发网
  Devnet = 3,
  // 测试网
  Testnet = 4,
}


/// Sui 链IDS
export enum SuiChainIds {
  // 主网
  Mainnet = 1,
  // 测试网
  Testnet = 2,
  // 开发网
  Devnet = 3,
  // 本地网
  Localnet = 4,
}


/**
 * 波场链IDS
 */
export enum TronChainIds {
  Mainnet = '0x2b6653dc',
  Shasta = '0x94a9059e',
  Nile = '0xcd8690dc'
}



/// 浏览器链接类型
export type BrowserLinkType = 'address' | 'transaction';

/// 余额元数据
export type BalanceMetadata = {
  // 币种图标
  icon?: React.ReactNode;
  // 精度（decimals）
  decimals?: number;
  // 符号（如 ETH、SOL）
  symbol?: string;
};

/// 链类型
export enum ChainType {
  /**
   * 以太坊虚拟机及其兼容链
   */
  EVM = 'EVM',

  /**
   * Solana 虚拟机
   */
  SVM = 'SVM',

  /**
   * 比特币链
   */
  Bitcoin = 'Bitcoin',

  /**
   * Sui 链
   */
  Sui = 'Sui',
}

/// 链信息
export interface Chain {
  // 链 ID（预置枚举或自定义数值）
  id: ChainIds | number | TronChainIds | any;
  // 链名称
  name: string;
  // 虚拟机类型
  type?: ChainType;
  // 链图标
  icon?: React.ReactNode;
  // 区块浏览器配置
  browser?: {
    icon?: React.ReactNode;
    getBrowserLink?: (address: string, type: BrowserLinkType) => string;
  };
  // 原生币信息（带币种元数据）
  nativeCurrency?: BalanceMetadata & {
    name: string;
  };
}

/// 非同质化代币（NFT）元数据
export interface NFTMetadata {
  // 名称与描述
  name?: string;
  description?: string;
  // 图片链接
  image?: string;
  // 链上/生成器相关信息
  dna?: string;
  edition?: string | number;
  date?: number;
  attributes?: {
    trait_type?: string;
    value?: string;
  }[];
  // 编译器或生成器来源
  compiler?: string;
}

/// 连接选项
export interface ConnectOptions {
  // 连接方式：浏览器扩展/二维码/打开移动端
  connectType?: 'extension' | 'qrCode' | 'openMobile';
}

/**
 * Web3 Provider 通用接口
 * - 抽象跨链、跨钱包的统一能力
 * - 用于 UI 层与业务逻辑的解耦
 */
export interface UniversalWeb3ProviderInterface {
  // 当前已连接账户
  account?: Account;
  // 当前已连接链
  chain?: Chain;
  // 当前账户余额
  balance?: Balance;
  // 余额获取状态
  balanceLoading?: BalanceStatusConfig;
  // 实时获取余额（可选传入代币）
  getBalance?: (params?: { token?: Token }) => Promise<Balance | undefined>;

  // 可用钱包与可用链（用于选择面板）
  availableWallets?: Wallet[];
  availableChains?: Chain[];

  // 是否从父级继承上下文
  extendsContextFromParent?: boolean;

  /** 例如 `0x` 前缀 */
  addressPrefix?: string | false;

  // biome-ignore lint/suspicious/noConfusingVoidType: by design
  connect?: (wallet?: Wallet, options?: ConnectOptions) => Promise<void | Account>;
  disconnect?: () => Promise<void>;
  switchChain?: (chain: Chain) => Promise<void>;

  // 对于比特币链，tokenId 不适用（为 undefined）
  getNFTMetadata?: (params: { address: string; tokenId?: bigint }) => Promise<NFTMetadata>;

  sendTransaction?: (params: TransferParams) => Promise<`0x${string}`>;

  // 应用层签名配置
  sign?: SignConfig;
}

export interface Wallet extends WalletMetadata {
  _standardWallet?: any;
  _isMobileWallet?: boolean;

  // 是否就绪/是否安装扩展
  hasWalletReady?: () => Promise<boolean>;
  hasExtensionInstalled?: () => Promise<boolean>;
  // 获取二维码（如 WalletConnect）
  getQrCode?: () => Promise<{ uri: string }>;
  customQrCodePanel?: boolean;
}

/**
 * @desc 浏览器扩展程序信息
 */
export type WalletExtensionItem = {
  /**
   * @desc 支持的浏览器的 key
   */
  key: 'Chrome' | 'Firefox' | 'Edge' | 'Safari' | (string & {});
  /**
   * @desc 浏览器扩展程序的链接
   */
  link: string;
  /**
   * @desc 浏览器扩展程序的图标
   */
  browserIcon: React.ReactNode | string;
  /**
   * @desc 浏览器扩展程序的名称
   */
  browserName: string;
  /**
   * @desc 浏览器扩展程序的描述
   */
  description: string;
};

/**
 * @desc 钱包
 */
export type WalletMetadata = {
  /**
   * @desc 钱包名称
   */
  name: string;
  /**
   * @desc 钱包简介
   */
  remark: string;
  /**
   * @desc 钱包的 key
   */
  key?: React.Key;
  /**
   * @desc 钱包图标
   */
  icon?: string | React.ReactNode;
  /**
   * @desc 该钱包支持的浏览器扩展程序列表
   */
  extensions?: false | WalletExtensionItem[];
  /**
   * @desc 该钱包是否支持 APP 调用
   */
  app?:
    | false
    | {
        link: string;
      };
  /**
   * @desc 钱包所属分组名称
   */
  group?: string;
  /**
   * @desc 是否是通用协议
   */
  universalProtocol?: {
    link: string;
  };
  /**
   * @desc 支持的链虚拟机类型
   */
  supportChainTypes?: ChainType[];
  /**
   * @desc 快捷扫码的参数是否支持
   */
  transferQRCodeFormatter?: (params: Record<string, any>) => string;
  /**
   * @desc 钱包支持的 Universal Link 配置
   */
  deeplink?: {
    /**
     * @desc Universal Link 的 URL 模板，用于构建钱包的通用链接
     * @example "https://phantom.com/ul/browse/${url}?ref=${ref}"
     */
    urlTemplate: string;
  };
  /**
   * @desc 钱包是否支持切换链
   */
  supportSwitchChain?: boolean;
};

/// 余额信息
export type Balance = BalanceMetadata & {
  // 余额（bigint 表示）
  value?: bigint;
  // 是否覆盖地址显示（如仅显示余额）
  coverAddress?: boolean;
};

/// 连接器触发组件属性
export interface ConnectorTriggerProps {
  // 触发组件所需的上下文属性
  account?: Account;
  loading?: boolean;
  onConnectClick?: (wallet?: Wallet) => void;
  onDisconnectClick?: () => void;
  onSwitchChain?: (chain: Chain) => Promise<void>;
  availableChains?: Chain[];
  availableWallets?: Wallet[];
  chain?: Chain;
  balance?: Balance;
}


/// 通用 EIP-6963 配置
export interface UniversalEIP6963Config {
  // 是否自动添加注入的钱包（EIP-6963）
  autoAddInjectedWallets?: boolean;
}


/// 令牌信息
export type Token = {
  // 名称与符号
  name: string;
  symbol: string;
  // 图标节点
  icon: React.ReactNode;
  // 小数位
  decimal: number;
  // 不同链的合约地址
  availableChains: {
    chain: Chain;
    contract?: string;
  }[];
};

export type TransferParams = {
  to: string;
  value?: number | bigint;
  token?: Token;
};

/// 签名配置
export interface SignConfig {
  // 必填方法
  signIn: (address: string) => Promise<void>;
  signOut?: () => Promise<void>;

  // signOutOnDisconnect?: boolean; // 断开连接时自动登出（默认 true）
  // signOutOnAccountChange?: boolean; // 账户变更时自动登出（默认 true）
  // signOutOnNetworkChange?: boolean; // 网络变更时自动登出（默认 true）
}

/// 连接状态
export type ConnectingStatus = 'signing' | 'connecting';


/// 连接状态配置
export type ConnectingStatusConfig =
  | boolean
  | {
      status: ConnectingStatus;
    };
/// 余额获取状态
export type BalanceStatus = 'fetching';


/// 余额获取状态配置
export type BalanceStatusConfig =
  | boolean
  | {
      status: BalanceStatus;
    };

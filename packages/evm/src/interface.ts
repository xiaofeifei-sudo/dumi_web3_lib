import type {
  Chain,
  ConnectOptions,
  UniversalEIP6963Config,
  Wallet,
  WalletMetadata,
} from 'pelican-web3-lib-common';
import type { Chain as WagmiChain } from 'viem';
import type { CreateSiweMessageParameters } from 'viem/siwe';
import type { Connector, CreateConnectorFn } from 'wagmi';

/**
 * WalletUseInWagmiAdapter
 * 在 pelican-web3 Wallet 基础上扩展，用于返回 wagmi 的 Connector
 * - getWagmiConnector: 根据连接选项返回连接器，用于实际连接链
 */
export interface WalletUseInWagmiAdapter extends Wallet {
  getWagmiConnector?: (options?: ConnectOptions) => Promise<Connector | undefined>;
}

/**
 * EthereumWallet
 * EVM 钱包工厂函数类型，输入元数据返回 WalletFactory
 */
export type EthereumWallet = (metadata?: Partial<WalletMetadata>) => WalletFactory;

/**
 * CreateWalletOptions
 * 创建钱包时的可选项
 * - useWalletConnectOfficialModal: 是否启用官方二维码弹窗
 */
export interface CreateWalletOptions {
  useWalletConnectOfficialModal?: boolean;
}

/**
 * WalletFactory
 * 钱包工厂接口：
 * - name: 工厂名称
 * - connectors: 支持的连接器名称列表（如 Injected、WalletConnect 等）
 * - create: 基于连接器与选项创建可用于适配 wagmi 的钱包
 * - createWagmiConnector: 直接创建 wagmi 连接器函数（适用于 WalletConnect/Coinbase 等）
 */
export interface WalletFactory {
  name?: string;
  connectors: Connector['name'][];
  create: (
    connector?: readonly Connector[],
    options?: CreateWalletOptions,
  ) => WalletUseInWagmiAdapter;
  createWagmiConnector?: () => CreateConnectorFn;
}

/**
 * EIP6963Config
 * 注入式钱包自动发现与处理的配置：
 * - boolean: 开启/关闭
 * - UniversalEIP6963Config: 详细配置
 */
export type EIP6963Config = boolean | UniversalEIP6963Config;

/**
 * ChainAssetWithWagmiChain
 * 将通用 Chain 结构与 wagmi 的 Chain 进行关联
 */
export type ChainAssetWithWagmiChain = Chain & { wagmiChain?: WagmiChain };

/**
 * SIWEConfig
 * Sign-In With Ethereum 配置：
 * - getNonce: 根据地址获取 nonce
 * - createMessage: 生成待签名消息
 * - verifyMessage: 验证签名是否有效
 */
export interface SIWEConfig {
  getNonce: (address: string, chainId?: number) => Promise<string>;
  createMessage: (args: CreateSiweMessageParameters) => string;
  verifyMessage: (message: string, signature: string) => Promise<boolean>;
}

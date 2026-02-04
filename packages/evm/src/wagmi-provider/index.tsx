/**
 * wagmi-provider/index.tsx
 * 提供基于 wagmi + TanStack Query + PelicanWeb3 的完整上下文 Provider，
 * 在 React 应用中统一管理账户、链、钱包、余额与 SIWE 登录能力。
 *
 * 设计要点：
 * - 支持用户传入自定义 wagmi Config 或自动生成；
 * - 支持 WalletConnect 官方二维码弹窗与自定义参数；
 * - 支持多链配置与自定义 transports（RPC）；
 * - 通过 PelicanWeb3ConfigProvider 合并底层配置与业务能力；
 * - 可通过 ignoreConfig 在多 Provider 切换时避免页面闪烁。
 *
 * 使用示例：
 * <WagmiWeb3ConfigProvider walletConnect={{ projectId: 'your_project_id' }}>
 *   <App />
 * </WagmiWeb3ConfigProvider>
 *
 * 自定义 Config 示例（高级用法）：
 * 
 * ```tsx
 * import { WagmiWeb3ConfigProvider } from '@pelican-web3/evm';
 * import { createConfig, http } from 'wagmi';
 * import { mainnet, sepolia } from 'wagmi/chains';
 * import { walletConnect } from 'wagmi/connectors';
 * 
 * // 1) 自定义 connectors（示例：仅启用 WalletConnect，关闭官方二维码）
 * const connectors = [
 *   walletConnect({
 *     projectId: 'your_project_id',
 *     showQrModal: false,
 *     metadata: {
 *       name: 'Your dApp',
 *       description: 'Your dApp description',
 *       url: 'https://your.app',
 *       icons: ['https://your.app/icon.png'],
 *     },
 *   }),
 * ];
 * 
 * // 2) 自定义 RPC transports（按链 ID 映射）
 * const transports = {
 *   [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/<YOUR_KEY>'),
 *   [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/<YOUR_KEY>'),
 * };
 * 
 * // 3) 创建自定义 wagmi Config
 * const customConfig = createConfig({
 *   chains: [mainnet, sepolia],
 *   connectors,
 *   transports,
 * });
 * 
 * // 4) 在 Provider 中直接传入 config（优先使用该配置）
 * function Root() {
 *   return (
 *     <WagmiWeb3ConfigProvider
 *       config={customConfig}
 *       // 其他可选能力，例如 SIWE、多钱包等
 *       // siwe={{ ... }}
 *       // wallets={[...]}
 *     >
 *       <App />
 *     </WagmiWeb3ConfigProvider>
 *   );
 * }
 * ```
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Transport, Chain as WagmiChain } from 'viem';
import { createConfig, http, WagmiProvider } from 'wagmi';
import type { Config, State } from 'wagmi';
import { holesky, mainnet, scrollSepolia, sepolia, } from 'wagmi/chains';
import type { WalletConnectParameters } from 'wagmi/connectors';

// Built in popular chains
import { Mainnet } from '../chains';
import type {
  ChainAssetWithWagmiChain,
  EIP6963Config,
  SIWEConfig,
  WalletFactory,
} from '../interface';
import { PelicanWeb3ConfigProvider } from './config-provider';
import type { Token } from 'pelican-web3-lib-common';
import { wcConnector } from '../connector/walletConnect';

/**
 * WalletConnectOptions
 * WalletConnect 自定义选项
 * - useWalletConnectOfficialModal: 是否启用官方二维码弹窗
 * 其余选项与 wagmi 的 WalletConnectParameters 对齐
 */
export interface WalletConnectOptions
  extends Pick<
    WalletConnectParameters,
    | 'disableProviderPing'
    | 'isNewChainsStale'
    | 'projectId'
    | 'metadata'
    | 'relayUrl'
    | 'storageOptions'
    | 'qrModalOptions'
  > {
  useWalletConnectOfficialModal?: boolean;
}

/**
 * WagmiWeb3ConfigProviderProps
 * - config: 自定义的 wagmi Config（存在时优先使用）
 * - wallets: 钱包工厂列表（用于生成连接器与钱包）
 * - chains: 链资产与 wagmi 链的映射
 * - ens: 是否启用 ENS
 * - queryClient: TanStack Query 客户端
 * - balance: 是否查询余额
 * - eip6963: EIP-6963 配置
 * - initialState: wagmi 初始状态
 * - reconnectOnMount: 组件挂载时是否自动重连
 * - walletConnect: WalletConnect 配置或关闭
 * - transports: 各链的 RPC Transport 配置
 * - siwe: SIWE 登录配置
 * - ignoreConfig: 是否在多 Provider 合并时忽略当前配置以避免闪烁
 */
export interface WagmiWeb3ConfigProviderProps {
  config?: Config;
  wallets?: WalletFactory[];
  chains?: ChainAssetWithWagmiChain[];
  ens?: boolean;
  queryClient?: QueryClient;
  balance?: boolean;
  /**
   * 指定 ERC-20 代币以查询余额（传入后优先显示该代币余额）
   */
  token?: Token;
  eip6963?: EIP6963Config;
  initialState?: State;
  reconnectOnMount?: boolean;
  walletConnect?: false | WalletConnectOptions;
  transports?: Record<number, Transport>;
  siwe?: SIWEConfig;
  /**
   * 如果为 true，在与父级 context 合并时会忽略该 Provider 的配置。
   * 适用于存在多个链 Provider 并在它们之间切换的场景，可避免页面闪烁。
   * 只有当前激活的 Provider 不应设置该标记。
   */
  ignoreConfig?: boolean;
}

/**
 * WagmiWeb3ConfigProvider
 * 负责创建或复用 wagmi Config，并结合 QueryClient 与 PelicanWeb3ConfigProvider
 * 提供完整的 Web3 上下文（账户、链、钱包、余额、SIWE 等）。
 */
export function WagmiWeb3ConfigProvider({
  children,
  config,
  wallets = [],
  chains = [],
  ens,
  queryClient,
  balance,
  eip6963,
  walletConnect,
  transports,
  siwe,
  ignoreConfig,
  ...restProps
}: React.PropsWithChildren<WagmiWeb3ConfigProviderProps>): React.ReactElement {
  // 用户提供自定义 config 时，默认补充 Mainnet
  // 用户未提供 config 时，自动生成 config，链采用用户传入的链集合
  const chainAssets: ChainAssetWithWagmiChain[] = config
    ? [Mainnet, ...chains]
    : chains?.length
      ? chains
      : [Mainnet];
  /**
   * 根据 WalletConnect、链与钱包列表生成唯一标识，
   * 当依赖项变化时用于判断是否需要重建 wagmi 配置。
   */
  const generateConfigFlag = () => {
    return `${JSON.stringify(walletConnect)}-${chains.map((item) => item.id).join(',')}-${wallets.map((item) => item.name).join(',')}`;
  };

  /**
   * 自动生成 wagmi Config：
   * - 构建 connectors（WalletConnect + 自定义钱包）
   * - 映射链配置与 RPC transports（默认 mainnet http）
   * - 返回包含唯一标识 flag 的对象，便于变更检测
   */
  const generateConfig = () => {
    // 自动生成 wagmi 配置
    const connectors = [];
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (walletConnect && walletConnect.projectId) {
      // 根据用户设置决定是否使用 WalletConnect 官方二维码弹窗
      connectors.push(
        wcConnector({
          ...walletConnect,
          showQrModal: walletConnect.useWalletConnectOfficialModal ?? false,
        }),
      );
    }
    // 追加通过钱包工厂创建的自定义连接器
    wallets.forEach((wallet) => {
      // 兼容未实现 createWagmiConnector 的钱包工厂
      const connector = wallet.createWagmiConnector?.();
      if (connector) {
        connectors.push(connector);
      }
    });


  //   connectors.push(
  //     coinbaseWallet({
  //   appName: "PelicanWeb3 Demo",
  //   appLogoUrl: "",
  //   version: "3",
  // headlessMode: true,
  // })
  //   )

    

    // 创建 wagmi 配置：链映射 + RPC transports + connectors
    const autoGenerateConfig = createConfig({
      chains: chainAssets.map((chain) => chain.wagmiChain) as [WagmiChain, ...WagmiChain[]],
      transports: transports ?? {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [holesky.id]: http(),
        [scrollSepolia.id]: http(),
      },
      connectors,
    });
    return {
      // flag 用于和依赖项进行比较，决定是否重建 config
      flag: generateConfigFlag(),
      config: autoGenerateConfig,
    };
  };

  /**
   * autoConfig 存储自动生成的 wagmi 配置与唯一标识。
   * 初始化时若存在用户传入的 config 则直接复用，否则按当前参数生成。
   */
  const [autoConfig, setAutoConfig] = React.useState<{
    flag?: string;
    config: Config;
  }>(() => {
    if (config) {
      return {
        config,
      };
    }
    return generateConfig();
  });

  /**
   * 合并（或延迟创建）TanStack Query 客户端。
   * 若外部未传入 queryClient，则按需创建一个默认实例以复用。
   */
  const mergedQueryClient = React.useMemo(() => {
    return queryClient ?? new QueryClient();
  }, [queryClient]);

  /**
   * 监听依赖项变化并在必要时重建 wagmi 配置。
   * 若用户显式提供了 config，则不进行自动重建（保持外部控制）。
   */
  React.useEffect(() => {
    if (config) {
      return;
    }
    const flag = generateConfigFlag();
    if (flag !== autoConfig.flag) {
      // 需要重新创建 wagmi 配置
      setAutoConfig(generateConfig());
    }
  }, [config, wallets, chains, walletConnect]);

  /**
   * 统一获得当前生效的 wagmi 配置（优先使用外部传入）。
   */
  const wagmiConfig = config || autoConfig.config;

  return (
    <WagmiProvider config={wagmiConfig} {...restProps}>
      <QueryClientProvider client={mergedQueryClient}>
        <PelicanWeb3ConfigProvider
          siwe={siwe}
          chainAssets={chainAssets}
          walletFactories={wallets}
          ens={ens}
          balance={balance}
          token={restProps?.token}
          eip6963={eip6963}
          wagimConfig={wagmiConfig}
          // 仅当 WalletConnect 为对象且用户开启 useWalletConnectOfficialModal 时启用官方二维码弹窗
          useWalletConnectOfficialModal={
            typeof walletConnect === 'object' && walletConnect?.useWalletConnectOfficialModal
          }
          // 多 Provider 场景下用于避免合并配置导致的闪烁
          ignoreConfig={ignoreConfig}
        >
          {children}
        </PelicanWeb3ConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

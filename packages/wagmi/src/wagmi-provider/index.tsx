import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Locale } from 'pelican-web3-lib-common';
import type { Transport, Chain as WagmiChain } from 'viem';
import { createConfig, http, WagmiProvider } from 'wagmi';
import type { Config, State } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { walletConnect as wagmiWalletConnect } from 'wagmi/connectors';
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
 * - locale: 本地化配置
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
  locale?: Locale;
  wallets?: WalletFactory[];
  chains?: ChainAssetWithWagmiChain[];
  ens?: boolean;
  queryClient?: QueryClient;
  balance?: boolean;
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
  locale,
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
  const generateConfigFlag = () => {
    return `${JSON.stringify(walletConnect)}-${chains.map((item) => item.id).join(',')}-${wallets.map((item) => item.name).join(',')}`;
  };

  const generateConfig = () => {
    // 自动生成 wagmi 配置
    const connectors = [];
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (walletConnect && walletConnect.projectId) {
      connectors.push(
        wagmiWalletConnect({
          ...walletConnect,
          showQrModal: walletConnect.useWalletConnectOfficialModal ?? false,
        }),
      );
    }
    wallets.forEach((wallet) => {
      const connector = wallet.createWagmiConnector?.();
      if (connector) {
        connectors.push(connector);
      }
    });
    const autoGenerateConfig = createConfig({
      chains: chainAssets.map((chain) => chain.wagmiChain) as [WagmiChain, ...WagmiChain[]],
      transports: transports ?? {
        [mainnet.id]: http(),
      },
      connectors,
    });
    return {
      flag: generateConfigFlag(),
      config: autoGenerateConfig,
    };
  };

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

  const mergedQueryClient = React.useMemo(() => {
    return queryClient ?? new QueryClient();
  }, [queryClient]);

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

  const wagmiConfig = config || autoConfig.config;

  return (
    <WagmiProvider config={wagmiConfig} {...restProps}>
      <QueryClientProvider client={mergedQueryClient}>
        <PelicanWeb3ConfigProvider
          locale={locale}
          siwe={siwe}
          chainAssets={chainAssets}
          walletFactories={wallets}
          ens={ens}
          balance={balance}
          eip6963={eip6963}
          wagimConfig={wagmiConfig}
          useWalletConnectOfficialModal={
            typeof walletConnect === 'object' && walletConnect?.useWalletConnectOfficialModal
          }
          ignoreConfig={ignoreConfig}
        >
          {children}
        </PelicanWeb3ConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

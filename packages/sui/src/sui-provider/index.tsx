/**
 * Sui 顶层 Web3 Provider 组合
 * - 组合 QueryClientProvider / SuiClientProvider / WalletProvider
 * - 暴露 SuiWeb3ConfigProviderProps，统一管理网络、钱包与本包的配置
 * - 支持自动连接、网络配置覆盖、默认网络、SuiNS、忽略配置合并等
 */
import React, { useContext } from 'react';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientContext, QueryClientProvider } from '@tanstack/react-query';
import type { Locale } from 'pelican-web3-lib-common';

import type { SuiChain } from '../../../assets/src/chains/sui';
import { suiDevnet, suiLocalnet, suiMainnet, suiTestnet } from '../../../assets/src/chains/sui';
import type { WalletFactory } from '../wallets/types';
import { PelicanWeb3ConfigProvider } from './config-provider';

export interface SuiWeb3ConfigProviderProps {
  /** 是否展示余额 */
  balance?: boolean;
  /** 本地化语言 */
  locale?: Locale;
  /** 是否自动连接钱包 */
  autoConnect?: boolean;
  /** SuiClientProvider 的网络配置，未提供时使用 mainnet 默认配置 */
  networkConfig?: ReturnType<typeof createNetworkConfig>['networkConfig'];
  /** 是否启用 SuiNS 解析 */
  sns?: boolean;
  /** 默认网络（mainnet/testnet/devnet/localnet），默认 mainnet */
  defaultNetwork?: string;
  /** 非标准钱包工厂列表 */
  wallets?: WalletFactory[];
  /** 可选的 QueryClient，未提供时自动创建 */
  queryClient?: QueryClient;
  /**
   * If true, this provider's configuration will be ignored when merging with parent context.
   * This is useful when you have multiple chain providers and want to switch between them
   * without causing page flickering. Only the active provider should not have this flag set.
   */
  /** 是否忽略合并到上层 Web3Config（多链场景） */
  ignoreConfig?: boolean;
}

export const SuiWeb3ConfigProvider: React.FC<
  React.PropsWithChildren<SuiWeb3ConfigProviderProps>
> = ({
  autoConnect,
  balance,
  locale,
  networkConfig,
  defaultNetwork = 'mainnet',
  queryClient,
  sns,
  wallets,
  ignoreConfig,
  children,
}) => {
  const [network, setNetwork] = React.useState(defaultNetwork);

  const injectedQueryClient = useContext(QueryClientContext);
  const mergedQueryClient = React.useMemo(() => {
    return queryClient ?? injectedQueryClient ?? new QueryClient();
  }, [injectedQueryClient, queryClient]);

  const mergedNetworkConfig = React.useMemo<NonNullable<typeof networkConfig>>(() => {
    return (
      networkConfig ??
      createNetworkConfig({
        mainnet: { url: getFullnodeUrl('mainnet') },
      }).networkConfig
    );
  }, [networkConfig]);

  /** 把内置四个网络与注入的 networkConfig 对齐并过滤 */
  const networks = React.useMemo(() => {
    const networkConfigKeys = Object.keys(mergedNetworkConfig);
    const networkConfigs = [suiMainnet, suiTestnet, suiDevnet, suiLocalnet];

    return networkConfigKeys
      .map((networkKey) => networkConfigs.find((item) => item.network === networkKey))
      .filter((item): item is SuiChain => !!item);
  }, [mergedNetworkConfig]);

  /** 当前激活网络对应的链对象 */
  const currentNetwork = React.useMemo(() => {
    return networks?.find((item) => item.network === network);
  }, [network, networks]);

  return (
    <QueryClientProvider client={mergedQueryClient}>
      <SuiClientProvider networks={mergedNetworkConfig} network={network}>
        <WalletProvider autoConnect={autoConnect}>
          <PelicanWeb3ConfigProvider
            locale={locale}
            availableChains={networks}
            availableWallets={wallets}
            currentChain={currentNetwork}
            balance={balance}
            sns={sns}
            onCurrentChainChange={setNetwork}
            ignoreConfig={ignoreConfig}
          >
            {children}
          </PelicanWeb3ConfigProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

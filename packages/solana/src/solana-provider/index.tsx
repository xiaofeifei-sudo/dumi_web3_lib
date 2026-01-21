import { useMemo, useState, type FC, type PropsWithChildren } from 'react';
import { WalletConnectionError } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
  type ConnectionProviderProps,
  type WalletProviderProps,
} from '@solana/wallet-adapter-react';
import type { UniversalProviderOpts } from '@walletconnect/universal-provider';
import { Solana, SolanaDevnet, SolanaTestnet } from 'pelican-web3-lib-assets';
import type { Locale } from 'pelican-web3-lib-common';

import { solana, type SolanaChainConfig } from '../chains';
import { isAdapterWalletFactory, isWalletConnectFactory } from '../utils';
import type { WalletFactory } from '../wallets/types';
import { PelicanWeb3ConfigProvider } from './config-provider';
import { useWalletConnectProvider } from './useWalletConnectProvider';

export interface SolanaWeb3ConfigProviderProps {
  /** 组件国际化配置（中文、英文等） */
  locale?: Locale;
  /** 可用链列表（默认包含 Solana 主网/开发网/测试网） */
  chains?: SolanaChainConfig[];
  /** 钱工厂列表（用于生成 UI 层使用的钱包结构） */
  wallets?: WalletFactory[];
  /** 是否开启余额查询（使用当前连接的 RPC） */
  balance?: boolean;

  /** 是否自动追加已注册的标准钱包（避免重复配置） */
  autoAddRegisteredWallets?: boolean;

  /** 自定义 RPC 节点提供器（按链返回节点地址） */
  rpcProvider?: (chain?: SolanaChainConfig) => string;

  //#region Solana ConnectionProvider 专用配置
  connectionConfig?: ConnectionProviderProps['config'];
  //#endregion

  //#region Solana WalletProvider 专用配置
  /** 是否自动连接上次使用的钱包 */
  autoConnect?: WalletProviderProps['autoConnect'];
  /** 透传到 WalletProvider 的其它参数（不包含 wallets/autoConnect/children） */
  walletProviderProps?: Omit<WalletProviderProps, 'wallets' | 'autoConnect' | 'children'>;
  //#endregion

  /** WalletConnect 初始化参数（包含项目 ID 等） */
  walletConnect?: UniversalProviderOpts;
  /**
   * 若为 true：合并上下文时忽略当前 Provider 的配置
   * 适用于多个链 Provider 并存、需要在不同 Provider 间切换以避免页面闪烁的场景
   * 通常仅「非激活」的 Provider 才设置为 true
   */
  ignoreConfig?: boolean;
}

export const SolanaWeb3ConfigProvider: FC<PropsWithChildren<SolanaWeb3ConfigProviderProps>> = ({
  locale,
  chains = [solana],
  wallets: walletFactories = [],
  balance,
  rpcProvider,
  connectionConfig,
  autoConnect,
  walletConnect,
  autoAddRegisteredWallets,
  ignoreConfig,
  children,
  walletProviderProps,
}) => {
  const [currentChain, setCurrentChain] = useState<SolanaChainConfig | undefined>(chains[0]);
  const [connectionError, setConnectionError] = useState<WalletConnectionError>();
  const walletConnectProviderGetter = useWalletConnectProvider(walletConnect);

  const endpoint = useMemo(() => {
    if (typeof rpcProvider === 'function') {
      return rpcProvider(currentChain);
    }

    return (currentChain ?? solana).rpcUrls.default;
  }, [rpcProvider, currentChain]);

  const availableWallets = walletFactories.map((factory) =>
    factory.create(walletConnectProviderGetter),
  );

  // 仅筛选出包含 adapter 的钱包工厂
  const walletAdapters = useMemo(
    () =>
      walletFactories
        .filter(isAdapterWalletFactory)

        .map((w) => {
          if (isWalletConnectFactory(w)) {
            w.adapter.setWalletConnectProviderGetter(walletConnectProviderGetter);
            w.adapter.setWalletConnectConfigGetter(() => ({
              walletConnect,
              currentChain,
              rpcEndpoint: endpoint,
            }));
          }

          return w.adapter;
        }),
    [currentChain, endpoint, walletConnect, walletConnectProviderGetter, walletFactories],
  );

  const connectionProviderProps = useMemo(() => {
    return {
      endpoint,
      config: connectionConfig ?? { commitment: 'confirmed' },
    } as ConnectionProviderProps;
  }, [endpoint, connectionConfig]);

  return (
    <ConnectionProvider {...connectionProviderProps}>
      <WalletProvider
        wallets={walletAdapters}
        autoConnect={autoConnect}
        {...walletProviderProps}
        onError={(error, adapter) => {
          if (error instanceof WalletConnectionError) {
            setConnectionError(error);
          }

          walletProviderProps?.onError?.(error, adapter);
        }}
      >
        <PelicanWeb3ConfigProvider
          locale={locale}
          chainAssets={[Solana, SolanaDevnet, SolanaTestnet]}
          availableWallets={availableWallets}
          balance={balance}
          currentChain={currentChain}
          onCurrentChainChange={(chain) => setCurrentChain(chain)}
          availableChains={chains}
          connectionError={connectionError}
          autoAddRegisteredWallets={autoAddRegisteredWallets}
          ignoreConfig={ignoreConfig}
        >
          {children}
        </PelicanWeb3ConfigProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

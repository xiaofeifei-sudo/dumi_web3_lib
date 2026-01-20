import React, { useMemo, useState, type PropsWithChildren } from 'react';
import type { WalletError } from '@tronweb3/tronwallet-abstract-adapter';
import { BybitWalletAdapter } from '@tronweb3/tronwallet-adapter-bybit';
import { OkxWalletAdapter } from '@tronweb3/tronwallet-adapter-okxwallet';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapter-tronlink';
import type { Locale, Wallet } from 'pelican-web3-lib-common';

import { PelicanWeb3ConfigProvider } from './config-provider';

export interface TronWeb3ConfigProviderProps {
  wallets?: Wallet[];
  onError?: (error: Error) => void;
  autoConnect?: boolean;
  locale?: Locale;
  walletProviderProps?: Omit<React.PropsWithChildren<TronWeb3ConfigProviderProps>, 'children'>;
  /**
   * 如果为 true，在与父级上下文合并时将忽略该 Provider 的配置。
   * 当存在多个链的 Provider 并需要在它们之间切换时，这很有用，
   * 可避免页面闪烁。仅当前处于激活状态的 Provider 不应该设置该标志。
   */
  ignoreConfig?: boolean;
}

export const TronWeb3ConfigProvider: React.FC<PropsWithChildren<TronWeb3ConfigProviderProps>> = ({
  wallets,
  onError,
  locale,
  autoConnect,
  ignoreConfig,
  children,
  walletProviderProps,
}) => {
  const [connectionError, setConnectionError] = useState<WalletError>();

  const adapters = useMemo(() => {
    const tronLinkAdapter = new TronLinkAdapter();
    const okxWalletAdapter = new OkxWalletAdapter();
    const bybitWalletAdapter = new BybitWalletAdapter();

    return [okxWalletAdapter, tronLinkAdapter, bybitWalletAdapter];
  }, []);

  return (
    <WalletProvider
      onError={(error) => {
        setConnectionError(error);
        onError?.(error);
      }}
      adapters={adapters}
      autoConnect={autoConnect}
      {...walletProviderProps}
    >
      <PelicanWeb3ConfigProvider
        locale={locale}
        connectionError={connectionError}
        availableWallets={wallets}
        ignoreConfig={ignoreConfig}
      >
        {children}
      </PelicanWeb3ConfigProvider>
    </WalletProvider>
  );
};

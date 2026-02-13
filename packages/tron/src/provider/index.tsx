/**
 * TRON 网络 Web3 配置 Provider
 * 负责实例化钱包适配器、统一错误处理并向下游组件提供配置信息。
 */
import React, { useMemo, useState, type PropsWithChildren } from 'react';
import type { WalletError } from '@tronweb3/tronwallet-abstract-adapter';
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapter-walletconnect';
import type { WalletConnectAdapterConfig } from '@tronweb3/tronwallet-adapter-walletconnect';
import type { Wallet, Token, CustomToken } from 'pelican-web3-lib-common';

import { PelicanWeb3ConfigProvider } from './config-provider';
import { normalizeTronError } from '../errors';
import type { Chain } from 'pelican-web3-lib-common';
import { TronLinkAdapter } from '../adapters/tronlink';
import { OkxWalletAdapter } from '../adapters/okxwallet';
import { WalletProvider } from '../hooks';
import { TokenPocketAdapter } from '../adapters/tokenpocket';
import { TrustAdapter } from '../adapters/trust';
import { MetaMaskAdapter } from '../adapters/metamask_tron';
import { LedgerAdapter, type LedgerAdapterConfig } from '../adapters/ledger';
import { BinanceWalletAdapter } from '../adapters/binance';
import { FoxWalletAdapter } from '../adapters/foxwallet';
import { GateWalletAdapter } from '../adapters/gatewallet';
import { GuardaAdapter } from '../adapters/guarda';
import { BybitWalletAdapter } from '../adapters/bybit';
import { BitKeepAdapter } from '../adapters/bitkeep';
import { TomoWalletAdapter } from '../adapters/tomowallet';

/** Tron Web3 配置项 */
export interface TronWeb3ConfigProviderProps {
  wallets?: Wallet[]; // 可供 UI 展示或过滤的钱包清单（非适配器实例）
  onError?: (error: Error) => void; // 统一错误回调，错误将被标准化后回传
  reconnectOnMount?: boolean; // 页面就绪时是否尝试重连上次使用的钱包
  balance?: boolean;
  /**
   * 指定 TRC-20 代币以查询余额（传入后优先显示该代币余额）
   */
  token?: Token;
  customToken?: CustomToken;
  walletProviderProps?: Omit<React.PropsWithChildren<TronWeb3ConfigProviderProps>, 'children'>; // 透传给 WalletProvider 的属性（不含 children）
  walletConnect?: WalletConnectAdapterConfig;
  ledgerAdapterConfig?: LedgerAdapterConfig;
  /**
   * 统一的适配器配置对象
   * - 会在创建各钱包适配器时作为构造入参的一部分传入
   * - 不同适配器共享同一份配置对象即可
   */
  adapterConfig?: Record<string, any>;
  /**
   * 如果为 true，在与父级上下文合并时将忽略该 Provider 的配置。
   * 当存在多个链的 Provider 并需要在它们之间切换时，这很有用，
   * 可避免页面闪烁。仅当前处于激活状态的 Provider 不应该设置该标志。
   */
  ignoreConfig?: boolean;
  initialChain?: Chain;
}

/// 提供 TRON 网络的 Web3 配置上下文
export const TronWeb3ConfigProvider: React.FC<PropsWithChildren<TronWeb3ConfigProviderProps>> = ({
  wallets,
  onError,
  reconnectOnMount,
  balance,
  token,
  customToken,
  ignoreConfig,
  initialChain,
  children,
  walletProviderProps,
  walletConnect,
  ledgerAdapterConfig,
  adapterConfig,
}) => {
  const [connectionError, setConnectionError] = useState<WalletError>(); // 保存最近一次连接相关错误，用于在下层展示

  const adapters = useMemo(() => {
    // 实例化并缓存 TRON 钱包适配器，避免重复创建
    const tronLinkAdapter = new TronLinkAdapter({
      openTronLinkAppOnMobile: true,
      openUrlWhenWalletNotFound: true,
      checkTimeout: 2000,
      ...(adapterConfig ?? {}),
    });
    const okxWalletAdapter = new OkxWalletAdapter({
      openUrlWhenWalletNotFound: true,
      checkTimeout: 2000,
      openAppWithDeeplink: true,
      ...(adapterConfig ?? {}),
    });
    const bybitWalletAdapter = new BybitWalletAdapter({
      checkTimeout: 2000,
      openUrlWhenWalletNotFound: true,
      openAppWithDeeplink: true,
      ...(adapterConfig ?? {}),
    });
    const tokenPocketAdapter = new TokenPocketAdapter({
      openUrlWhenWalletNotFound: true,
      checkTimeout: 2000,
      openAppWithDeeplink: true,
      ...(adapterConfig ?? {}),
    });
    const bitKeepAdapter = new BitKeepAdapter({
      checkTimeout: 2000,
      openUrlWhenWalletNotFound: true,
      openAppWithDeeplink: true,
      ...(adapterConfig ?? {}),
    });
    const ledgerAdapter = new LedgerAdapter(
      adapterConfig ? { ...(ledgerAdapterConfig ?? {}), ...adapterConfig } : ledgerAdapterConfig,
    );
    const gateWalletAdapter = new GateWalletAdapter({
      checkTimeout: 2000,
      openUrlWhenWalletNotFound: true,
      openAppWithDeeplink: true,
      ...(adapterConfig ?? {}),
    });
    const foxWalletAdapter = new FoxWalletAdapter({
      checkTimeout: 2000,
      openUrlWhenWalletNotFound: true,
      openAppWithDeeplink: true,
      ...(adapterConfig ?? {}),
    });
    const trustAdapter = new TrustAdapter({
      openUrlWhenWalletNotFound: true,
      checkTimeout: 2000,
      openAppWithDeeplink: true,
      ...(adapterConfig ?? {}),
    });
    const binanceWalletAdapter = new BinanceWalletAdapter({
      openUrlWhenWalletNotFound: true,
      checkTimeout: 2000,
      ...(adapterConfig ?? {}),
    });
    const tomoWalletAdapter = new TomoWalletAdapter({
      checkTimeout: 3000,
      openUrlWhenWalletNotFound: true,
      ...(adapterConfig ?? {}),
    });
    const guardaAdapter = new GuardaAdapter({
      checkTimeout: 2000,
      openUrlWhenWalletNotFound: true,
      ...(adapterConfig ?? {}),
    });
    const metaMaskTronAdapter = new MetaMaskAdapter();
    const walletConnectAdapter = walletConnect
      ? new WalletConnectAdapter({
          ...walletConnect,
          options: {
            relayUrl: 'wss://relay.walletconnect.com',
            ...(walletConnect.options ?? {}),
            ...(adapterConfig ?? {}),
          },
        })
      : null;

    // 适配器顺序会影响优先连接与展示；可按需调整
    const list = [
      tronLinkAdapter,
      okxWalletAdapter,
      bybitWalletAdapter,
      ledgerAdapter,
      tokenPocketAdapter,
      bitKeepAdapter,
      gateWalletAdapter,
      foxWalletAdapter,
      trustAdapter,
      tomoWalletAdapter,
      binanceWalletAdapter,
      guardaAdapter,
      metaMaskTronAdapter,
    ];
    return walletConnectAdapter ? [walletConnectAdapter, ...list] : list;
  }, [walletConnect, ledgerAdapterConfig, adapterConfig]);

  return (
    <WalletProvider
      onError={(error) => {
        // 捕获适配器层错误并转为统一错误对象
        setConnectionError(error);
        const normalized = normalizeTronError(error, { action: 'connect' });
        onError?.(normalized);
      }}
      adapters={adapters} // 传入钱包适配器列表
      reconnectOnMount={reconnectOnMount}
      {...walletProviderProps}
    >
      <PelicanWeb3ConfigProvider
        connectionError={connectionError} // 连接错误供业务层使用
        availableWallets={wallets} // 可用钱包清单
        balance={balance}
        token={token}
        customToken={customToken}
        ignoreConfig={ignoreConfig} // 是否忽略自身配置以避免闪烁
        initialChain={initialChain}
      >
        {children}
      </PelicanWeb3ConfigProvider>
    </WalletProvider>
  );
};

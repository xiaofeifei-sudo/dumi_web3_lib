/**
 * TRON 网络 Web3 配置 Provider
 * 负责实例化钱包适配器、统一错误处理并向下游组件提供配置信息。
 */
import React, { useMemo, useState, type PropsWithChildren } from 'react';
import type { WalletError } from '@tronweb3/tronwallet-abstract-adapter';
import { BybitWalletAdapter } from '@tronweb3/tronwallet-adapter-bybit';
import { OkxWalletAdapter } from '@tronweb3/tronwallet-adapter-okxwallet';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapter-tronlink';
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapter-walletconnect';
import type { WalletConnectAdapterConfig } from '@tronweb3/tronwallet-adapter-walletconnect';
import { TokenPocketAdapter } from '@tronweb3/tronwallet-adapter-tokenpocket';
import { BitKeepAdapter } from '@tronweb3/tronwallet-adapter-bitkeep';
import { LedgerAdapter } from '@tronweb3/tronwallet-adapter-ledger';
import type { LedgerAdapterConfig } from '@tronweb3/tronwallet-adapter-ledger';
import { GateWalletAdapter } from '@tronweb3/tronwallet-adapter-gatewallet';
import { FoxWalletAdapter } from '@tronweb3/tronwallet-adapter-foxwallet';
import { TrustAdapter } from '@tronweb3/tronwallet-adapter-trust';
import { TomoWalletAdapter } from '@tronweb3/tronwallet-adapter-tomowallet';
import { BinanceWalletAdapter } from '@tronweb3/tronwallet-adapter-binance';
import { GuardaAdapter } from '@tronweb3/tronwallet-adapter-guarda';
import { MetaMaskAdapter } from '@tronweb3/tronwallet-adapter-metamask-tron';
import type { Wallet, Token } from 'pelican-web3-lib-common';

import { PelicanWeb3ConfigProvider } from './config-provider';
import { normalizeTronError } from '../errors';
import type { Chain } from 'pelican-web3-lib-common';

/** Tron Web3 配置项 */
export interface TronWeb3ConfigProviderProps {
  wallets?: Wallet[]; // 可供 UI 展示或过滤的钱包清单（非适配器实例）
  onError?: (error: Error) => void; // 统一错误回调，错误将被标准化后回传
  autoConnect?: boolean; // 是否在页面就绪时自动尝试连接上次使用的钱包
  balance?: boolean;
  /**
   * 指定 TRC-20 代币以查询余额（传入后优先显示该代币余额）
   */
  token?: Token;
  walletProviderProps?: Omit<React.PropsWithChildren<TronWeb3ConfigProviderProps>, 'children'>; // 透传给 WalletProvider 的属性（不含 children）
  walletConnect?: WalletConnectAdapterConfig;
  ledgerAdapterConfig?: LedgerAdapterConfig;
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
  autoConnect,
  balance,
  token,
  ignoreConfig,
  initialChain,
  children,
  walletProviderProps,
  walletConnect,
  ledgerAdapterConfig,
}) => {
  const [connectionError, setConnectionError] = useState<WalletError>(); // 保存最近一次连接相关错误，用于在下层展示

  const adapters = useMemo(() => {
    // 实例化并缓存 TRON 钱包适配器，避免重复创建
    const tronLinkAdapter = new TronLinkAdapter();
    const okxWalletAdapter = new OkxWalletAdapter();
    const bybitWalletAdapter = new BybitWalletAdapter();
    const tokenPocketAdapter = new TokenPocketAdapter();
    const bitKeepAdapter = new BitKeepAdapter();
    const ledgerAdapter = new LedgerAdapter(ledgerAdapterConfig);
    const gateWalletAdapter = new GateWalletAdapter();
    const foxWalletAdapter = new FoxWalletAdapter();
    const trustAdapter = new TrustAdapter();
    const tomoWalletAdapter = new TomoWalletAdapter();
    const binanceWalletAdapter = new BinanceWalletAdapter();
    const guardaAdapter = new GuardaAdapter();
    const metaMaskTronAdapter = new MetaMaskAdapter();
    const walletConnectAdapter = walletConnect
      ? new WalletConnectAdapter({
          ...walletConnect,
          options: {
            relayUrl: 'wss://relay.walletconnect.com',
            ...(walletConnect.options ?? {}),
          },
        })
      : null;

    // 适配器顺序会影响优先连接与展示；可按需调整
    const list = [
      okxWalletAdapter,
      tronLinkAdapter,
      bybitWalletAdapter,
      tokenPocketAdapter,
      bitKeepAdapter,
      ledgerAdapter,
      gateWalletAdapter,
      foxWalletAdapter,
      trustAdapter,
      tomoWalletAdapter,
      binanceWalletAdapter,
      guardaAdapter,
      metaMaskTronAdapter,
    ];
    return walletConnectAdapter ? [walletConnectAdapter, ...list] : list;
  }, [walletConnect, ledgerAdapterConfig]);

  return (
    <WalletProvider
      onError={(error) => {
        // 捕获适配器层错误并转为统一错误对象
        setConnectionError(error);
        const normalized = normalizeTronError(error, { action: 'connect' });
        onError?.(normalized);
      }}
      adapters={adapters} // 传入钱包适配器列表
      autoConnect={autoConnect} // 自动连接配置
      {...walletProviderProps}
    >
      <PelicanWeb3ConfigProvider
        connectionError={connectionError} // 连接错误供业务层使用
        availableWallets={wallets} // 可用钱包清单
        balance={balance}
        token={token}
        ignoreConfig={ignoreConfig} // 是否忽略自身配置以避免闪烁
        initialChain={initialChain}
      >
        {children}
      </PelicanWeb3ConfigProvider>
    </WalletProvider>
  );
};

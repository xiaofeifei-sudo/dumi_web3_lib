import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  WalletReadyState,
  type AdapterName,
  type WalletError,
} from '@tronweb3/tronwallet-abstract-adapter';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import type { Account, Wallet } from 'pelican-web3-lib-common';
import { Web3ConfigProvider } from 'pelican-web3-lib-common';

import { hasWalletReady } from '../utils';
import { normalizeTronError } from '../errors';

/// 提供 TRON 网络的 Web3 配置上下文的属性接口
interface PelicanWeb3ConfigProviderProps {
  availableWallets?: Wallet[];
  connectionError?: WalletError;
  /**
   * 如果为 true，在与父级上下文合并时将忽略该 Provider 的配置。
   * 当存在多个链的 Provider 并需要在它们之间切换时，这很有用，
   * 可避免页面闪烁。仅当前处于激活状态的 Provider 不应该设置该标志。
   */
  ignoreConfig?: boolean;
}

/// 连接异步操作的类型定义
interface ConnectAsync {
  promise: Promise<Account>;
  resolve: (account?: Account) => void;
  reject: (reason: any) => void;
  walletName?: AdapterName | null;
}

/// 提供 TRON 网络的 Web3 配置上下文
export const PelicanWeb3ConfigProvider: React.FC<
  React.PropsWithChildren<PelicanWeb3ConfigProviderProps>
> = ({ availableWallets, connectionError, ignoreConfig, children }) => {
  const { address, wallet, wallets, connected, connect, disconnect, select } = useWallet();
  const connectAsyncRef = useRef<ConnectAsync>();

  const [account, setAccount] = useState<Account>();

  useEffect(() => {
    if (address) {
      setAccount({
        address,
      });
    }
  }, [address]);


  /// 合并所有可用钱包和适配器
  const allWallets = useMemo<Wallet[]>(() => {
    const providedWallets = availableWallets?.map<Wallet>((w) => {
      const adapter = wallets?.find((item) => item.adapter.name === w.name)?.adapter;

      return {
        ...w,
        adapter,
        hasExtensionInstalled: async () => {
          return adapter?.readyState === WalletReadyState.Found;
        },

        hasWalletReady: async () => {
          return (
            adapter?.readyState === WalletReadyState.Found ||
            adapter?.readyState === WalletReadyState.Loading
          );
        },
      };
    });
    return providedWallets || [];
  }, [availableWallets, wallets]);

  /// 处理连接错误
  useEffect(() => {
    if (connectionError) {
      const normalized = normalizeTronError(connectionError, {
        action: 'connect',
        walletName: connectAsyncRef.current?.walletName ?? wallet?.adapter?.name,
      });
      connectAsyncRef.current?.reject(normalized);
      connectAsyncRef.current = undefined;
    }
  }, [connectionError]);

  // 获取账户地址
  useEffect(() => {
    if (!(address && connected)) {
      setAccount(undefined);
      return;
    }

    setAccount({
      address: address,
    });
  }, [address, connected, wallet?.adapter?.name]);


  /// 处理连接成功
  useEffect(() => {
    if (!connectAsyncRef.current) {
      return;
    }

    if (connected) {
      connectAsyncRef.current.resolve({ address: address! });
      connectAsyncRef.current = undefined;
    }
  }, [connected]);

  // 连接/断开钱包
  useEffect(() => {
    if (wallet?.adapter?.name) {
      // 如果钱包尚未就绪，需要清除已选钱包
      if (!hasWalletReady(wallet.adapter.readyState)) {
        select(null as any);
        return;
      }
      connect().catch((err) => {
        const normalized = normalizeTronError(err, {
          action: 'connect',
          walletName: wallet?.adapter?.name,
        });
        connectAsyncRef.current?.reject(normalized);
        connectAsyncRef.current = undefined;
      });
    } else {
      if (connected) {
        disconnect();
      }
    }
  }, [wallet?.adapter?.name, connected]);

  return (
    <Web3ConfigProvider
      account={account}
      addressPrefix=""
      availableWallets={allWallets}
      connect={async (_wallet) => {
        let resolve: any;
        let reject: any;
        const promise = new Promise<Account>((res, rej) => {
          resolve = res;
          reject = rej;
        });
        const walletName = (_wallet?.name as AdapterName) ?? null;
        connectAsyncRef.current = { promise, resolve, reject, walletName };
        try {
          select(walletName);
        } catch (err) {
          const normalized = normalizeTronError(err, { action: 'connect', walletName });
          reject(normalized);
          connectAsyncRef.current = undefined;
        }
        return promise;
      }}
      disconnect={async () => {
        try {
          await disconnect();
        } catch (error) {
          const normalized = normalizeTronError(error, {
            action: 'disconnect',
            walletName: wallet?.adapter?.name,
          });
          throw normalized;
        }
      }}
      ignoreConfig={ignoreConfig}
    >
      {children}
    </Web3ConfigProvider>
  );
};

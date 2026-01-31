import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  WalletReadyState,
  WalletDisconnectedError,
  type AdapterName,
  type WalletError,
} from '@tronweb3/tronwallet-abstract-adapter';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import type { Account, Wallet, Token, TransferParams, CustomToken } from 'pelican-web3-lib-common';
import { Web3ConfigProvider, type BalanceStatusConfig, formatBalance } from 'pelican-web3-lib-common';
import type { Chain } from 'pelican-web3-lib-common';
import { TronMainnet, TronNileNet, TronShastaNet } from 'pelican-web3-lib-assets';
import { TronChainIds } from 'pelican-web3-lib-common';

import { hasWalletReady, getNetworkInfoByTronWeb, resolveTronWeb, switchTronChain } from '../utils';
import { normalizeTronError } from '../errors';
import { getBalance as getTronBalance } from './methods/getBalance';
import { sendTransaction as sendTronTransaction } from './methods/sendTransaction';

/// 提供 TRON 网络的 Web3 配置上下文的属性接口
interface PelicanWeb3ConfigProviderProps {
  availableWallets?: Wallet[];
  connectionError?: WalletError;
  balance?: boolean;
  /**
   * 指定 TRC-20 代币以查询余额（传入后优先显示该代币余额）
   * - 根据当前链自动匹配合约地址
   * - 未匹配到合约时回退为原生余额
   */
  token?: Token;
  /**
   * 如果为 true，在与父级上下文合并时将忽略该 Provider 的配置。
   * 当存在多个链的 Provider 并需要在它们之间切换时，这很有用，
   * 可避免页面闪烁。仅当前处于激活状态的 Provider 不应该设置该标志。
   */
  ignoreConfig?: boolean;
  initialChain?: Chain;
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
> = ({ availableWallets, connectionError, ignoreConfig, balance, token, children, initialChain }) => {
  const { address, wallet, wallets, connected, connect, disconnect, select, signTransaction } = useWallet();
  const connectAsyncRef = useRef<ConnectAsync>();

  const [account, setAccount] = useState<Account>();
  const [currentChain, setCurrentChain] = useState<Chain | undefined>(initialChain ?? TronMainnet);
  const availableChains = useMemo<Chain[]>(() => [TronMainnet, TronShastaNet, TronNileNet], []);
  const [balanceData, setBalanceData] = useState<bigint>();
  const [tokenDecimals, setTokenDecimals] = useState<number | undefined>();

  useEffect(() => {
    if (address) {
      setAccount({
        address,
      });
    }
  }, [address]);


  useEffect(() => {
    let timer: any;
    const fetchBalance = async () => {
      try {
        if (!(balance && address && wallet?.adapter && connected)) {
          setBalanceData(undefined);
          setTokenDecimals(undefined);
          return;
        }
        const tronWeb: any = resolveTronWeb(wallet.adapter);
        if (!tronWeb) {
          setBalanceData(undefined);
          setTokenDecimals(undefined);
          return;
        }
        const result = await getTronBalance(tronWeb, address, currentChain, token);
        if (!result) {
          setBalanceData(undefined);
          setTokenDecimals(undefined);
          return;
        }
        setBalanceData(result.value as bigint);
        setTokenDecimals(result.decimals);
      } catch (error) {
        const normalized = normalizeTronError(error, {
          action: 'other',
          walletName: wallet?.adapter?.name,
        });
        console.error(normalized);
        setBalanceData(undefined);
        setTokenDecimals(undefined);
      }
    };

    if (balance && address && wallet?.adapter && connected) {
      fetchBalance();
      timer = setInterval(fetchBalance, 5000);
    } else {
      setBalanceData(undefined);
      setTokenDecimals(undefined);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [balance, address, wallet?.adapter, connected, currentChain, token?.symbol, token?.availableChains]);


  useEffect(() => {
      /// 检测当前钱包连接的 TRON 网络
    const detectNetwork = async () => {
      try {
        const tronWeb: any = resolveTronWeb(wallet?.adapter);
        if (!tronWeb || !connected) return;
          const currentWallet = availableWallets?.find(
            (item) => item.name === wallet?.adapter?.name,
          );
        const { chainId } = await getNetworkInfoByTronWeb(tronWeb);
        const map: Record<string, Chain> = {
          [TronChainIds.Mainnet]: TronMainnet,
          [TronChainIds.Shasta]: TronShastaNet,
          [TronChainIds.Nile]: TronNileNet,
        };
        const target = map[chainId];
        if (!currentChain) {
          setCurrentChain((initialChain as any) ?? target ?? TronMainnet);
        }
        if (initialChain) {
          if (!target || (target as any)?.id !== (initialChain as any)?.id) {
            try {
              await switchTronChain(wallet?.adapter, initialChain, currentWallet);
              setCurrentChain(initialChain);
              return;
            } catch (error) {
              try {
                await disconnect();
              } catch {}
              const normalized = normalizeTronError(error, {
                action: 'switch_chain',
                walletName: wallet?.adapter?.name,
                network: (initialChain as any)?.name ?? (initialChain as any)?.id,
              });
              console.error(normalized);
              return;
            }
          } else {
            setCurrentChain(initialChain);
            return;
          }
        }
        if (target) {
          setCurrentChain(target);
        }
      } catch (e) {
        const normalized = normalizeTronError(e, {
          action: 'other',
          walletName: wallet?.adapter?.name,
        });
        console.error(normalized);
      }
    };
    if (wallet?.adapter) {
      detectNetwork();
    }
  }, [connected, initialChain]);

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

  
  const currency = currentChain?.nativeCurrency;
  const isTokenBalance = tokenDecimals !== undefined && !!token;
  const balanceDecimals = isTokenBalance
    ? tokenDecimals ?? token?.decimal
    : currency?.decimals;
  const balanceFormatted =
    balanceData !== undefined && balanceDecimals !== undefined
      ? formatBalance(balanceData, balanceDecimals)
      : undefined;

  /// 确保 TronWeb 实例和地址已连接
  const ensureTronWebAndAddress = () => {
    if (!connected || !wallet?.adapter || !address) {
      throw new WalletDisconnectedError();
    }
    const tronWeb: any = resolveTronWeb(wallet.adapter);
    if (!tronWeb) {
      throw new WalletDisconnectedError();
    }
    return { tronWeb, address, adapter: wallet.adapter };
  };

  /// 余额获取状态
  const balanceLoading = useMemo(
    () => (balance && !!address && balanceData === undefined) as BalanceStatusConfig,
    [balance, address, balanceData],
  );

  return (
    <Web3ConfigProvider
      account={account}
      addressPrefix=""
      availableWallets={allWallets}
      availableChains={availableChains}
      chain={currentChain}
      getBalance={async (params?: { token?: Token; customToken?: CustomToken }) => {
        const context = ensureTronWebAndAddress();
        return getTronBalance(
          context.tronWeb,
          context.address,
          currentChain,
          params?.token ?? token,
          params?.customToken,
        );
      }}
      sendTransaction={async (params: TransferParams) => {
        try {
          const context = ensureTronWebAndAddress();
          return await sendTronTransaction(
            context.tronWeb,
            context.address,
            currentChain,
            signTransaction,
            params,
          );
        } catch (error) {
          const normalized = normalizeTronError(error, {
            action: 'other',
            walletName: wallet?.adapter?.name,
          });
          throw normalized;
        }
      }}
      balance={
        balance
          ? {
              symbol: isTokenBalance ? token?.symbol : currency?.symbol,
              value: balanceData,
              decimals: balanceDecimals,
              icon: isTokenBalance ? token?.icon : currency?.icon,
              formatted: balanceFormatted,
            }
          : undefined
      }
      balanceLoading={balanceLoading}
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
      switchChain={async (newChain: Chain) => {
        const context = ensureTronWebAndAddress();
        const currentWallet = availableWallets?.find(
          (item) => item.name === wallet?.adapter?.name,
        );
        try {
          await switchTronChain(context.adapter, newChain, currentWallet);
          setCurrentChain(newChain);
          return;
        } catch (error: any) {
          const normalized = normalizeTronError(error, {
            action: 'switch_chain',
            walletName: wallet?.adapter?.name,
            network: (newChain as any)?.network ?? newChain?.name,
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

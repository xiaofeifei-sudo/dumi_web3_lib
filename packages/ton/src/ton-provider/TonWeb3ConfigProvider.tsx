import React, { useEffect, type PropsWithChildren } from 'react';
import type { CHAIN, TonConnectOptions, Wallet } from '@tonconnect/sdk';

import { TonWalletFactory } from '../wallets/factory';
import type { TonBasicWallet, TonWalletMetadata } from '../wallets/type';
import TonConfigProvider from './config-provider';
import TonConnectSdk, { type TonConnectSdkConfigType } from './TonConnectSdk';

/**
 * TON 连接上下文类型
 * - tonConnectSdk：TonConnect SDK 实例（用于连接、查询余额等）
 * - tonSelectWallet：当前已连接的钱包信息
 * - setTonSelectWallet：设置/清除当前选择的钱包
 * - connectConfig：TonConnect 初始化配置（包含链、manifestUrl 等）
 */
interface TonConnectorContextProps {
  tonConnectSdk: TonConnectSdk | null;
  tonSelectWallet: Wallet | null;
  setTonSelectWallet: (sdk: Wallet | null) => void;
  connectConfig: TonConnectSdkConfigType;
}

export const TonConnectorContext = React.createContext<TonConnectorContextProps | null>(null);

/**
 * TonWeb3ConfigProvider 组件的入参
 * - balance：是否展示余额
 * - wallets：可用的钱包列表（元数据）
 * - chain：连接的链（主网/测试网）
 * - reconnect：是否在初始化时尝试恢复上次连接状态
 * - ignoreConfig：当为 true 时，合并上层上下文时忽略当前配置（用于多链切换避免闪烁）
 */
export interface TonWeb3ConfigProviderProps extends TonConnectOptions {
  balance?: boolean;
  wallets: TonWalletMetadata[];
  chain?: CHAIN;
  reconnect?: boolean;
  /**
   * 当为 true 时，合并父级上下文时将忽略此 Provider 的配置。
   * 适用于存在多个链 Provider 时进行切换，避免页面闪烁；仅应对“非激活”的 Provider 设置该标记。
   */
  ignoreConfig?: boolean;
}

/**
 * 提供 TON 链的全局配置与连接能力的 Provider
 * - 初始化 TonConnectSdk，并可选择自动恢复连接
 * - 过滤并映射可用钱包，注入到通用 Web3ConfigProvider 中
 */
export const TonWeb3ConfigProvider: React.FC<PropsWithChildren<TonWeb3ConfigProviderProps>> = ({
  children,
  ...restProps
}) => {
  const { balance, wallets, chain, reconnect = true, ignoreConfig } = restProps;

  const [tonConnectSdk, setTonConnectSdk] = React.useState<TonConnectSdk | null>(null);
  const [tonSelectWallet, setTonSelectWallet] = React.useState<Wallet | null>(null);
  const [tonWallets, setTonWallets] = React.useState<TonBasicWallet[]>([]);

  useEffect(() => {
    if (!tonConnectSdk) {
      const tonSdk = new TonConnectSdk({ ...restProps, chain });
      if (reconnect) {
        tonSdk.restoreConnection();
      }
      tonSdk.onStatusChange((s) => {
        setTonSelectWallet(s);
      });
      setTonConnectSdk(tonSdk);
    }
  }, [tonConnectSdk, restProps, reconnect, chain]);

  React.useEffect(() => {
    if (tonConnectSdk && wallets?.length) {
      tonConnectSdk.getWallets().then((res) => {
        const availableWallets = wallets.filter(
          (w) => res.findIndex((t) => t.appName === w.key) >= 0,
        );
        setTonWallets(
          availableWallets.map((w) => {
            const tonBasicWallet = res.find((t) => t.appName === w.key)!;
            return {
              ...w,
              ...tonBasicWallet,
            };
          }),
        );
      });
    }
  }, [wallets, tonConnectSdk]);

  return (
    <TonConnectorContext.Provider
      value={{ tonConnectSdk, tonSelectWallet, setTonSelectWallet, connectConfig: restProps }}
    >
      <TonConfigProvider
        wallets={tonWallets.map((w) => TonWalletFactory(w).create())}
        balance={balance}
        ignoreConfig={ignoreConfig}
      >
        {children}
      </TonConfigProvider>
    </TonConnectorContext.Provider>
  );
};

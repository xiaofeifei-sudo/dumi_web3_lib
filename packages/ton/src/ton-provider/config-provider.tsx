import React, { useEffect, type PropsWithChildren } from 'react';
import { toUserFriendlyAddress } from '@tonconnect/sdk';
import { Web3ConfigProvider, type Account, type Balance } from 'pelican-web3-lib-common';
import { TonCircleColorful } from 'pelican-web3-lib-icons';

import { useTonConnector } from '../hooks';
import type { TonWallet } from '../wallets/type';
import type { TonWeb3ConfigProviderProps } from './TonWeb3ConfigProvider';

/**
 * TON 配置 Provider 的入参
 * - wallets：可用的钱包实例列表
 * - ignoreConfig：是否在合并父级上下文时忽略当前配置（用于多链场景）
 */
interface TonConfigProviderProps
  extends Omit<TonWeb3ConfigProviderProps, 'wallets' | 'connectConfig'> {
  wallets?: TonWallet[];
  /**
   * 当为 true 时，合并父级上下文时忽略当前 Provider 的配置。
   * 该选项适用于多链 Provider 并存的场景，防止非激活 Provider 引起页面闪烁。
   */
  ignoreConfig?: boolean;
}

/**
 * 将 TON 连接能力映射为通用 Web3ConfigProvider
 * - 自动查询并展示余额（可配置）
 * - 维护当前账号地址（人类可读地址）
 * - 提供连接/断开方法
 */
const TonConfigProvider: React.FC<PropsWithChildren<TonConfigProviderProps>> = ({
  children,
  locale,
  balance: showBalance,
  wallets,
  ignoreConfig,
}) => {
  const { connector, tonSelectWallet, setTonSelectWallet } = useTonConnector();
  const [balance, setBalance] = React.useState<Balance>();
  const [account, setAccount] = React.useState<Account>();

  useEffect(() => {
    if (!showBalance || !connector) return;
    connector?.getBalance().then((res) => {
      setBalance({
        value: BigInt(res),
      });
    });
  }, [connector, showBalance, tonSelectWallet]);

  useEffect(() => {
    if (tonSelectWallet) {
      setAccount({
        address: toUserFriendlyAddress(tonSelectWallet.account.address),
      });
    } else {
      setAccount(undefined);
    }
  }, [tonSelectWallet]);

  return (
    <Web3ConfigProvider
      addressPrefix={false}
      locale={locale}
      availableWallets={wallets}
      balance={
        balance
          ? { ...balance, decimals: 9, icon: <TonCircleColorful />, symbol: 'TON' }
          : undefined
      }
      account={account}
      connect={async (wallet) => {
        const walletInfo = wallets?.find((w) => w.appName === wallet?.key);
        connector?.connect(walletInfo!);
      }}
      disconnect={async () => {
        await connector?.disconnect();
        if (!connector?.connected) {
          setTonSelectWallet?.(null);
        }
      }}
      ignoreConfig={ignoreConfig}
    >
      {children}
    </Web3ConfigProvider>
  );
};

export default TonConfigProvider;

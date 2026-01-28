// 说明：BitcoinWeb3ConfigProvider 负责钱包适配器的创建、选择与自动连接
// - 在 children 外层注入 BitcoinAdapterContext 和通用 Web3ConfigProvider
import {type FC, type PropsWithChildren, useEffect, useState} from 'react';
import type {Wallet} from 'pelican-web3-lib-common';

import {BitcoinAdapterContext, type BitcoinWallet, useBitcoinWallet} from '../adapter';
import type {WalletFactory, WalletWithAdapter} from '../wallets/types';
import {useLatestWallet} from '../wallets/useLatestWallet';
import {BitcoinConfigProvider} from './config-provider';

export interface BitcoinWeb3ConfigProviderProps {
  // 可用钱包工厂列表，工厂生成具体适配器
  wallets?: WalletFactory[];
  // 是否展示余额（调用适配器的 getBalance）
  balance?: boolean;
  // 是否在页面加载时自动连接最近使用的钱包
  autoConnect?: boolean;
}

export const BitcoinWeb3ConfigProvider: FC<PropsWithChildren<BitcoinWeb3ConfigProviderProps>> = ({
                                                                                                   children,
                                                                                                   wallets: initWallets = [],
                                                                                                   balance = false,
                                                                                                   autoConnect,
                                                                                                 }) => {
  // 当前选择的适配器（钱包）
  const [adapter, setAdapter] = useState<BitcoinWallet>({} as BitcoinWallet);
  // 所有可用的钱包（包含元数据与适配器）
  const [wallets, setWallets] = useState<WalletWithAdapter[]>([]);
  const {name: adapterName} = useBitcoinWallet();

  const {latestWalletNameRef, cacheSelectedWallet} = useLatestWallet();

  useEffect(() => {
    if (initWallets.length === 0) return;
    // 工厂模式创建各钱包的适配器实例
    setWallets(initWallets.map((w) => w.create()));
  }, [initWallets]);

  const selectWallet = async (wallet?: Wallet | null) => {
    if (!wallet) {
      // disconnect
      if (adapter) setAdapter({} as BitcoinWallet);
      cacheSelectedWallet();
      return;
    }

    // 查找并连接目标钱包的适配器
    const provider = wallets.find((w) => w.name === wallet.name)?.adapter;
    await provider?.connect();
    // @ts-ignore provider is not undefined
    setAdapter(provider);
    // 记忆最近一次选择的钱包，便于下次自动连接
    cacheSelectedWallet(wallet.name);
  };

  // auto connect
  useEffect(() => {
    if (autoConnect && latestWalletNameRef.current && !adapterName) {
      const wallet = wallets.find((w) => w.name === latestWalletNameRef.current);
      if (wallet) {
        selectWallet(wallet);
      }
    }
  }, [wallets]);

  return (
    <BitcoinAdapterContext.Provider value={adapter}>
      <BitcoinConfigProvider
        selectWallet={selectWallet}
        wallets={wallets}
        balance={balance}
      >
        {children}
      </BitcoinConfigProvider>
    </BitcoinAdapterContext.Provider>
  );
};

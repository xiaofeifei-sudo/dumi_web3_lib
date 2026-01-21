// 说明：缓存用户最近一次选择的钱包到 localStorage，支持自动连接
import React, { useEffect, useRef } from 'react';

export const LATEST_WALLET_STORAGE_KEY = 'pelican-web3-lib-bitcoin:latest-wallet';

type UseLatestWalletResult = {
  latestWalletNameRef: React.MutableRefObject<string | undefined>;
  cacheSelectedWallet: (walletName?: string) => void;
};

export const useLatestWallet = (): UseLatestWalletResult => {
  const latestWalletNameRef = useRef<string>();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      latestWalletNameRef.current =
        window.localStorage.getItem(LATEST_WALLET_STORAGE_KEY) ?? undefined;
    }
  }, []);

  const cacheSelectedWallet = (walletName?: string) => {
    latestWalletNameRef.current = walletName;

    if (typeof window !== 'undefined' && window.localStorage) {
      if (walletName) {
        // 写入最近使用的钱包
        window.localStorage.setItem(LATEST_WALLET_STORAGE_KEY, walletName);
      } else {
        // 清除缓存
        window.localStorage.removeItem(LATEST_WALLET_STORAGE_KEY);
      }
    }
  };

  return {
    latestWalletNameRef,
    cacheSelectedWallet,
  };
};

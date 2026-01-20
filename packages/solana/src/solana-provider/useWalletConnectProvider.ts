import { useCallback, useEffect, useRef, useState } from 'react';
import type { UniversalProviderOpts } from '@walletconnect/universal-provider';

import type { IUniversalProvider } from '../types';

export const useWalletConnectProvider = (walletConnect?: UniversalProviderOpts) => {
  const [promiseResolves, setPromiseResolves] = useState<((value: IUniversalProvider) => void)[]>(
    [],
  );
  /** 避免重复初始化 Universal Provider 的标记 */
  const [mounted, setMounted] = useState(false);

  const [walletConnectProvider, setWalletConnectProvider] = useState<IUniversalProvider | null>(
    null,
  );
  const promiseResolvesRef = useLatest(promiseResolves);

  /* v8 ignore next 9 */
  const getWalletConnectProvider = useCallback(async () => {
    /** 若已初始化则直接返回当前 Provider */
    if (walletConnectProvider) return Promise.resolve(walletConnectProvider);

    /** 若尚未初始化则通过 Promise 返回 Provider，待异步初始化完成后 resolve */
    const promise = new Promise<IUniversalProvider>((resolve) => {
      setPromiseResolves((prev) => [...prev, resolve]);
    });

    return promise;
  }, [walletConnectProvider]);

  useEffect(() => {
    if (mounted || !walletConnect) return;

    setMounted(true);

    import('@walletconnect/universal-provider').then(async ({ UniversalProvider }) => {
      /* v8 ignore next 7 */
      const provider = await UniversalProvider.init(walletConnect);

      setWalletConnectProvider(provider);

      /** 逐个触发之前挂起的 resolve，通知 Provider 可用 */
      promiseResolvesRef.current.forEach((resolve) => {
        resolve(provider);
      });
    });
  }, [mounted, promiseResolvesRef, walletConnect]);

  useEffect(() => {
    return () => {
      setMounted(false);
    };
  }, []);

  return getWalletConnectProvider;
};

function useLatest<T>(value: T) {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
}

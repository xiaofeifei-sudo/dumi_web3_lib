import type { UniversalProvider } from '@walletconnect/universal-provider';

/** WalletConnect Universal Provider 的实例类型（init 后异步返回） */
export type IUniversalProvider = Awaited<ReturnType<(typeof UniversalProvider)['init']>>;

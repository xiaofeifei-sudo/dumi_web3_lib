/**
 * Web3 配置上下文（ConfigContext）
 * - 用于在组件树中共享账户、链、余额、钱包列表、语言等信息
 * - 通过 ignoreConfig 控制当前 Provider 是否参与与父级配置的合并
 */
import React from 'react';

import type { Locale, RequiredLocale, UniversalWeb3ProviderInterface } from '../types';

export interface Web3ConfigProviderProps extends UniversalWeb3ProviderInterface {
  children?: React.ReactNode;
  locale?: Locale;
  /**
   * 若为 true：合并上下文时忽略当前 Provider 的配置
   * 适用于多个链 Provider 并存、需要在不同 Provider 间切换以避免页面闪烁的场景
   * 通常仅「非激活」的 Provider 才设置为 true
   */
  ignoreConfig?: boolean;
}

export interface ConfigConsumerProps extends UniversalWeb3ProviderInterface {
  locale?: Locale;
}

export const ConfigContext = React.createContext<ConfigConsumerProps>({});

/**
 * Web3ConfigProvider
 * - 负责在多层 Provider 场景下合并与传递配置
 * - 支持 ignoreConfig 跳过本层配置合并（用于多链切换避免闪屏）
 * - 支持 extendsContextFromParent 控制是否继承父级上下文
 */
import React from 'react';

import { ConfigContext, type ConfigConsumerProps, type Web3ConfigProviderProps } from './context';

const ProviderChildren: React.FC<
  ConfigConsumerProps & {
    children?: React.ReactNode;
    parentContext?: ConfigConsumerProps;
    ignoreConfig?: boolean;
  }
> = (props) => {
  const { children, parentContext, ignoreConfig, ...rest } = props;

  // 当 ignoreConfig 为 true：跳过合并，仅透传父级上下文
  if (ignoreConfig) {
    const passThroughConfig = parentContext ? { ...parentContext } : {};
    return (
      <ConfigContext.Provider value={passThroughConfig as ConfigConsumerProps}>
        {children}
      </ConfigContext.Provider>
    );
  }

  // 正常合并逻辑（ignoreConfig 为 false 或未设置）
  const config = { ...parentContext };

  // 从待合并属性中排除 ignoreConfig 与 extendsContextFromParent
  const skipKeys = ['ignoreConfig', 'extendsContextFromParent'];
  Object.keys(rest).forEach((key) => {
    // biome-ignore lint/suspicious/noExplicitAny: skip keys need to check string
    if (skipKeys.includes(key as any)) {
      return;
    }
    const typedKey = key as keyof typeof rest;
    if (rest[typedKey] !== undefined) {
      (config as any)[typedKey] = rest[typedKey];
    }
  });

  return (
    <ConfigContext.Provider value={config as ConfigConsumerProps}>
      {children}
    </ConfigContext.Provider>
  );
};

const Web3ConfigProvider: React.FC<Web3ConfigProviderProps> = (props) => {
  const { extendsContextFromParent = true, ignoreConfig, ...restProps } = props;
  const parentContext = React.useContext(ConfigContext);
  const context = extendsContextFromParent ? parentContext : undefined;

  return (
    <ProviderChildren
      {...restProps}
      parentContext={context}
      extendsContextFromParent={extendsContextFromParent}
      ignoreConfig={ignoreConfig}
    />
  );
};

export { Web3ConfigProvider, type Web3ConfigProviderProps };

export * from './context';

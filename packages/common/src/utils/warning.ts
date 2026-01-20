/**
 * 开发环境告警工具集
 * - 基于 rc-util 的 warning 封装统一的组件前缀与行为
 * - 提供 Deprecated/Usage/Breaking 等类型的告警
 * - 通过 WarningContext 控制严格模式行为（strict=false 时收集去重后的弃用告警）
 */
/* v8 ignore start */
import * as React from 'react';
import rcWarning, { resetWarned as rcResetWarned } from 'rc-util/lib/warning';

export function noop() {}

let deprecatedWarnList: Record<string, string[]> | null = null;

/**
 * 重置已记录的告警信息
 * - 清空本地弃用告警列表
 * - 同步重置 rc-util 的告警状态
 */
export function resetWarned() {
  deprecatedWarnList = null;
  rcResetWarned();
}

type Warning = (valid: boolean, component: string, message?: string) => void;

// eslint-disable-next-line
let warning: Warning = noop;
if (process.env.NODE_ENV !== 'production') {
  warning = (valid, component, message) => {
    rcWarning(valid, `[ant-design-web3: ${component}] ${message}`);

    // React 17 的 StrictMode 会注入 console，导致告警不抛出，测试环境下需重置
    if (process.env.NODE_ENV === 'test') {
      resetWarned();
    }
  };
}

type BaseTypeWarning = (
  valid: boolean,
  /**
   * - deprecated：API 未来将移除，目前仍可用
   * - usage：API 使用方式不正确
   * - breaking：破坏性变更（API 已移除）
   */
  type: 'deprecated' | 'usage' | 'breaking',
  message?: string,
) => void;

type TypeWarning = BaseTypeWarning & {
  deprecated: (valid: boolean, oldProp: string, newProp: string, message?: string) => void;
};

export interface WarningContextProps {
  strict?: boolean;
}

export const WarningContext = React.createContext<WarningContextProps>({});

/**
 * 这是一个仅用于开发环境的 Hook，但未命名为 `useWarning`
 * 使用时应始终置于 `if (process.env.NODE_ENV !== 'production')` 条件分支内
 */
export const devUseWarning: (component: string) => TypeWarning =
  process.env.NODE_ENV !== 'production'
    ? (component) => {
        const { strict } = React.useContext(WarningContext);

        const typeWarning: TypeWarning = (valid, type, message) => {
          if (!valid) {
            if (strict === false && type === 'deprecated') {
              const existWarning = deprecatedWarnList;

              if (!deprecatedWarnList) {
                deprecatedWarnList = {};
              }

              deprecatedWarnList[component] = deprecatedWarnList[component] || [];
              if (!deprecatedWarnList[component].includes(message || '')) {
                deprecatedWarnList[component].push(message || '');
              }

              // 首次出现弃用告警时输出汇总信息
              if (!existWarning) {
                // eslint-disable-next-line no-console
                console.warn(
                  '[ant-design-web3] There exists deprecated usage in your code:',
                  deprecatedWarnList,
                );
              }
            } else {
              warning(valid, component, message);
            }
          }
        };

        typeWarning.deprecated = (valid, oldProp, newProp, message) => {
          typeWarning(
            valid,
            'deprecated',
            `\`${oldProp}\` is deprecated. Please use \`${newProp}\` instead.${
              message ? ` ${message}` : ''
            }`,
          );
        };

        return typeWarning;
      }
    : () => {
        const noopWarning: TypeWarning = () => {};

        noopWarning.deprecated = noop;

        return noopWarning;
      };

export default warning;

/**
 * ConnectModal 辅助工具方法
 *
 * mergeReactNodeProps
 * - 合并字符串/节点型 props，支持对字符串进行包装
 *
 * defaultGroupOrder
 * - 分组默认排序：Popular 优先、More 置后，其余按字母序
 *
 * isDarkTheme
 * - 根据 token 的填充与背景计算明暗程度
 *
 * getPlatform
 * - 从公共工具中复用平台判断（浏览器环境）
 */
import type React from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import type { GlobalToken } from 'antd';

export const mergeReactNodeProps = (
  node: React.ReactNode,
  defaultNode: React.ReactNode,
  resolveString?: (node: string) => React.ReactNode,
) => {
  if (node === null || node === false) return node;
  if (typeof node === 'string' && resolveString) return resolveString(node);
  return node ?? defaultNode;
};

export const defaultGroupOrder = (a: string, b: string) => {
  if (a === 'Popular' && b !== 'Popular') {
    return -1;
  }
  if (a === 'More' && b !== 'More') {
    return 1;
  }
  return a.localeCompare(b);
};

export const isDarkTheme = (token: GlobalToken) => {
  const hsv = new TinyColor(token.colorFill).onBackground(token.colorBgElevated).toHsv();
  return hsv.v < 0.5;
};

export { getPlatform } from '../../../utils';

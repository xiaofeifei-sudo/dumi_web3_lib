/**
 * useMode 模式判定
 * - 根据 props.mode 与当前断点判定是否使用简易模式
 * - auto 模式下当 md 断点不存在（窄屏）时启用 simple
 */
import { Grid } from 'antd';

import { type ConnectModalProps } from '../interface';

export default function useMode(mode: ConnectModalProps['mode'] = 'auto') {
  const { md } = Grid.useBreakpoint();
  const isSimple = mode === 'simple' || (mode === 'auto' && !md);
  return {
    isSimple,
    md,
  };
}

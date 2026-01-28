/**
 * PluginTag 浏览器插件状态标签
 * - 根据是否安装钱包扩展显示绿色状态点与「浏览器插件」按钮
 * - 禁用状态表示未检测到扩展或未安装
 *
 * 逻辑
 * - judgeExtensionInstalled：先校验钱包可用，再检测扩展安装状态
 * - Badge dot：使用绿色点标记已安装状态
 */
import React, { useCallback } from 'react';
import { Badge, Button } from 'antd';

import { connectModalContext } from '../context';
import type { Wallet } from '../interface';

const PluginTag: React.FC<{ wallet: Wallet; hoveredWallet?: Wallet }> = ({ wallet }) => {
  const [extensionInstalled, setExtensionInstalled] = React.useState<boolean>(false);
  const { localeMessage, prefixCls } = React.useContext(connectModalContext);

  const judgeExtensionInstalled = useCallback(async () => {
    const hasWalletReady = await wallet.hasWalletReady?.();
    if (hasWalletReady) {
      const hasInstalled = await wallet.hasExtensionInstalled?.();
      setExtensionInstalled(!!hasInstalled);
    }
  }, [wallet]);

  React.useEffect(() => {
    judgeExtensionInstalled();
  }, [judgeExtensionInstalled]);

  return wallet.hasExtensionInstalled ? (
    <Badge dot={extensionInstalled} color="#52c41a">
      <Button className={`${prefixCls}-plugin-tag`} size="small" disabled={!extensionInstalled}>
        {"浏览器插件"}
      </Button>
    </Badge>
  ) : null;
};

export default PluginTag;

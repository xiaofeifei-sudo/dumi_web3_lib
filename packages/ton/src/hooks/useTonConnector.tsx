import React from 'react';

import { TonConnectorContext } from '../ton-provider/TonWeb3ConfigProvider';

/**
 * 获取 TON 连接上下文的便捷 Hook
 * 返回：
 * - connector：TonConnectSdk 实例
 * - account：当前账户信息
 * - tonSelectWallet：当前选择的钱包
 * - setTonSelectWallet：设置/清除选择的钱包
 * - connectConfig：TonConnect 初始化配置
 */
export const useTonConnector = () => {
  const provider = React.useContext(TonConnectorContext);
  return {
    connector: provider?.tonConnectSdk,
    account: provider?.tonConnectSdk?.account,
    tonSelectWallet: provider?.tonSelectWallet,
    setTonSelectWallet: provider?.setTonSelectWallet,
    connectConfig: provider?.connectConfig,
  };
};

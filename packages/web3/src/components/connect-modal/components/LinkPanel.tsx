/**
 * LinkPanel 连接过程面板
 * - 展示钱包图标与涟漪动画，提示当前连接/签名状态
 * - 当外部不再提供 connecting 时，自动回到初始化列表
 */
import React, { useContext } from 'react';
import { Avatar } from 'antd';

import { connectModalContext } from '../context';
import { ConnectingStatus } from '../interface';
import MainPanelHeader from './MainPanelHeader';
import WalletIcon from './WalletIcon';

const LinkPanel: React.FC = () => {
  const { connecting, updatePanelRoute, localeMessage, prefixCls, selectedWallet } =
    useContext(connectModalContext);

  React.useEffect(() => {
    if (!connecting) {
      updatePanelRoute('init', true);
    }
  }, [connecting]);

  const status: ConnectingStatus =
    typeof connecting === 'object' ? connecting.status : 'connecting';

  return (
    <>
      <MainPanelHeader />
      <div className={`${prefixCls}-link-panel`}>
        <div className={`${prefixCls}-ripple-container`}>
          <div className={`${prefixCls}-ripple`} />
          <div className={`${prefixCls}-ripple`} />
          <div className={`${prefixCls}-ripple`} />
          <Avatar size={56} icon={<WalletIcon wallet={selectedWallet!} />} />
        </div>
        <div className={`${prefixCls}-wallet-connecting`}>
          {status === 'connecting' ? "连接中" : "签名中"}
        </div>
      </div>
    </>
  );
};

export default LinkPanel;

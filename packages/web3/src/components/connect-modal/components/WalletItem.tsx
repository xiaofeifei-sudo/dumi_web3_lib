/**
 * WalletItem 钱包列表项
 * - 展示钱包图标与名称，支持二维码按钮与插件提示
 *
 * 行为说明
 * - showPluginTag：根据是否安装扩展与是否走通用链接决定是否展示「浏览器插件」标签
 * - 二维码按钮：阻止冒泡，仅在未禁用时触发 onQrCodeSelect
 * - 选中态：依据 wallet.key 或 wallet.name 与 selectedWallet 比较
 */
import React, { useState } from 'react';
import { QrcodeOutlined } from '@ant-design/icons';
import { Button, List, Space, Typography } from 'antd';
import classNames from 'classnames';
import mobile from 'is-mobile';

import type { Wallet } from '../interface';
import PluginTag from './PluginTag';
import WalletIcon from './WalletIcon';

export interface WalletItemProps {
  wallet: Wallet;
  prefixCls: string;
  selectedWallet?: Wallet;
  onSelect: (wallet: Wallet) => void;
  onQrCodeSelect: (wallet: Wallet) => void;
  showQrPlaceholder?: boolean;
  disabled?: boolean;
}

const WalletItem: React.FC<WalletItemProps> = ({
  wallet,
  prefixCls,
  selectedWallet,
  onSelect,
  onQrCodeSelect,
  showQrPlaceholder,
  disabled = false,
}) => {
  const useUniversalLink: boolean = !!(mobile() && wallet.deeplink);
  const [showPluginTag, setShowPluginTag] = useState(!useUniversalLink);
  // Check if the wallet is ready (installed) to determine whether to show the plugin tag
  React.useEffect(() => {
    const checkWalletInstalled = async () => {
      const isWalletInstalled = await wallet.hasExtensionInstalled?.();
      const hidePluginTag = !isWalletInstalled && useUniversalLink;
      setShowPluginTag(!hidePluginTag);
    };
    checkWalletInstalled();
  }, [wallet, useUniversalLink]);

  return (
    <List.Item
      className={classNames(`${prefixCls}-wallet-item`, {
        selected:
          wallet.key !== undefined
            ? selectedWallet?.key === wallet.key
            : selectedWallet?.name === wallet.name,
        disabled,
      })}
      onClick={disabled ? undefined : () => onSelect(wallet)}
    >
      <div className={`${prefixCls}-content`}>
        <WalletIcon wallet={wallet} />
        <Typography.Text ellipsis={{ tooltip: true }} className={`${prefixCls}-name`}>
          {wallet.name}
        </Typography.Text>
      </div>
      <Space>
        {showPluginTag && <PluginTag wallet={wallet} />}
        {wallet.getQrCode ? (
          <Button
            size="small"
            className={`${prefixCls}-qr-btn`}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                onQrCodeSelect(wallet);
              }
            }}
            disabled={disabled}
          >
            <QrcodeOutlined />
          </Button>
        ) : (
          showQrPlaceholder && <div className={`${prefixCls}-qr-icon-empty`} />
        )}
      </Space>
    </List.Item>
  );
};

export default WalletItem;

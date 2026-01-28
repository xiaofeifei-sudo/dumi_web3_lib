/**
 * ConnectButtonInner 组件
 * - 负责按钮的具体形态渲染：普通按钮或带下拉的快速连接按钮
 * - 根据已安装钱包动态生成快速连接列表，并注入到 Dropdown.Button
 *
 * 关键点
 * - showQuickConnect 为 true 且识别到至少一个钱包时，展示「主按钮 + 更多钱包」下拉
 * - firstInstallWallet：优先使用第一个可用的钱包作为主点击目标
 * - availableWallets 支持 universalProtocol 的钱包追加到快速连接列表
 * - preContent：在按钮左侧插入自定义内容（如链选择器）
 */
import React, { useContext, useEffect, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import type { Wallet } from 'pelican-web3-lib-common';
import type { ButtonProps, MenuProps } from 'antd';
import { Button, ConfigProvider, Dropdown, Space } from 'antd';
import classNames from 'classnames';


export interface ConnectButtonInnerProps extends ButtonProps {
  /** @internal */
  __hashId__: string;
  preContent: React.ReactNode;
  showQuickConnect?: boolean;
  availableWallets?: Wallet[];
  onConnectClick?: (wallet?: Wallet) => void;
}

export const ConnectButtonInner: React.FC<ConnectButtonInnerProps> = (props) => {
  const {
    preContent,
    showQuickConnect,
    availableWallets,
    content,
    children,
    onClick,
    onConnectClick,
    __hashId__,
    className,
    ...restProps
  } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('web3-connect-button');
  const [firstInstallWallet, setFirstInstallWallet] = useState<Wallet | undefined>(undefined);
  const [items, setItems] = useState<MenuProps['items']>([]);

  const getWalletIcon = (wallet: Wallet) => {
    const icon = wallet.icon;

    return (
      <span className={classNames(__hashId__, `${prefixCls}-quick-connect-icon`)}>
        {typeof icon === 'string' ? <img src={icon} alt={`${wallet.name} Icon`} /> : icon}
      </span>
    );
  };

  // 生成快速连接下拉项：
  // - 过滤出已安装扩展的钱包
  // - 追加 universalProtocol 的通用协议钱包
  // - 记录第一个钱包为主按钮点击目标，其余作为下拉项
  const generateQuickConnectItems = async (wallets: Wallet[] = []) => {
    if (!showQuickConnect) {
      setFirstInstallWallet(undefined);
      setItems([]);
      return;
    }
    const filterNotInstallWallets = await Promise.all(
      wallets.map(async (wallet) => {
        try {
          if (await wallet.hasExtensionInstalled?.()) {
            return wallet;
          }
        } catch (e) {
          console.error(`Check wallet ${wallet.name} hasExtensionInstalled error:`, e);
        }
        return null;
      }),
    );
    const installedWallets: Wallet[] = filterNotInstallWallets.filter(
      (item) => item !== null,
    ) as Wallet[];

    // Add universal protocol wallets to the list
    const allQuickWallets = installedWallets.concat(
      wallets.filter((item) => item.universalProtocol && !installedWallets.includes(item)),
    );

    setFirstInstallWallet(allQuickWallets.shift());
    const newItems = allQuickWallets.map((item) => {
      return {
        key: item.name,
        icon: getWalletIcon(item),
        label: item.name,
        onClick: () => {
          onConnectClick?.(item);
        },
      };
    });

    newItems.push({
      key: '__more__',
      icon: <MoreOutlined />,
      label: "更多钱包",
      onClick: () => {
        onConnectClick?.();
      },
    });
    setItems(newItems);
  };

  useEffect(() => {
    generateQuickConnectItems(availableWallets);
  }, [availableWallets, showQuickConnect]);

  // 根据快速连接模式选择渲染：
  // - 有 firstInstallWallet 时使用 Dropdown.Button（主按钮连接 + 下拉更多）
  // - 否则使用普通 Button
  const buttonContent =
    showQuickConnect && firstInstallWallet ? (
      <Dropdown.Button
        {...restProps}
        menu={{
          items,
        }}
        className={classNames(className, `${prefixCls}-quick-connect`)}
        onClick={(e) => {
          onClick?.(e);
          onConnectClick?.(firstInstallWallet);
        }}
      >
        {children}
        {getWalletIcon(firstInstallWallet)}
      </Dropdown.Button>
    ) : (
      <Button
        {...restProps}
        className={className}
        onClick={(e) => {
          onClick?.(e);
          onConnectClick?.();
        }}
      >
        {children}
      </Button>
    );

  // 支持在按钮前插入 preContent（如链选择器），并保持紧凑布局
  return preContent ? (
    <Space.Compact>
      {preContent}
      {buttonContent}
    </Space.Compact>
  ) : (
    buttonContent
  );
};

ConnectButtonInner.displayName = 'ConnectButtonInner';

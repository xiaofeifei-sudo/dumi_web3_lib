/**
 * ConnectButton 组件
 * - 用于展示 Web3 钱包连接状态与快捷操作（复制地址、断开连接、切链等）
 * - 支持可选的链选择器、用户资料弹窗、动作菜单以及登录签名流程
 *
 * 关键概念
 * - account: 当前账户信息（地址、名称、头像、连接状态）
 * - chain: 当前链信息（名称、图标）
 * - balance: 资产价格展示（可与地址同时展示或覆盖地址）
 * - sign: 登录签名配置，连接后可进行一次性签名
 *
 * 常用交互
 * - 点击按钮：未连接时触发连接；已连接时打开资料弹窗或执行签名
 * - 下拉菜单：复制地址、断开连接，以及可扩展的自定义菜单项
 * - Tooltip：悬浮显示地址并支持一键复制
 */
import React, { useContext, useMemo, useState } from 'react';
import { CopyOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { ConnectStatus, type Chain, type Wallet } from 'pelican-web3-lib-common';
import type { ButtonProps } from 'antd';
import { Avatar, ConfigProvider, Divider, Dropdown, message, Spin } from 'antd';
import classNames from 'classnames';

import { CryptoPrice } from '../crypto-price';
import { useProvider } from '../../hooks';
import { fillWithPrefix, writeCopyText } from '../../utils';
import { ChainSelect } from './chain-select';
import type { ChainSelectProps } from './chain-select';
import { ConnectButtonInner } from './connect-button-inner';
import {
  type ConnectButtonProps,
  type ConnectButtonTooltipProps,
  type MenuItemType,
} from './interface';
import type { ProfileModalProps } from './profile-modal';
import { ProfileModal } from './profile-modal';
import { useStyle } from './style';
import { ConnectButtonTooltip } from './tooltip';

export const ConnectButton: React.FC<ConnectButtonProps> = (props) => {
  const {
    chainSelect = true,
    onConnectClick,
    onDisconnectClick,
    availableChains,
    availableWallets,
    onSwitchChain,
    tooltip,
    chain,
    account,
    avatar,
    profileModal = true,
    onMenuItemClick,
    actionsMenu = false,
    loading,
    onClick,
    balance,
    balanceLoading,
    className,
    quickConnect,
    addressPrefix: addressPrefixProp,
    sign,
    signBtnTextRender,
    children,
    ...restProps
  } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const { addressPrefix: addressPrefixContext } = useProvider();
  const prefixCls = getPrefixCls('web3-connect-button');
  const [profileOpen, setProfileOpen] = useState(false);
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const [messageApi, contextHolder] = message.useMessage();
  const [showMenu, setShowMenu] = useState(false);

  // balance 配置兼容：允许以对象或布尔传入；当 coverAddress=true 时用价格覆盖地址展示
  const { coverAddress = true } = typeof balance !== 'object' ? { coverAddress: true } : balance;
  const isBalanceLoading =
    typeof balanceLoading === 'boolean'
      ? balanceLoading
      : !!(balanceLoading && (balanceLoading as any).status === 'fetching');
  // 是否需要执行登录签名：仅在已连接状态且 sign.signIn 存在时启用
  const needSign = !!(sign?.signIn && account?.status === ConnectStatus.Connected && account);
  // 按钮主文案：优先 children，其次显示账户信息与价格
  let buttonText: React.ReactNode = children || "连接钱包";
  if (account) {
    buttonText = (
      <>
        {(!balance || !coverAddress) &&
          (account?.name
            ? account.name
            : fillWithPrefix(
                `${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
                addressPrefixProp,
                addressPrefixContext,
              ))}
        {balance && !coverAddress && <Divider type="vertical" />}
        {balance &&
          (isBalanceLoading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Spin size="small" />
            </span>
          ) : (
            <CryptoPrice icon {...balance} />
          ))}
      </>
    );
  }

  // 按钮属性与点击逻辑：
  // - 已连接且开启 profileModal 时，点击按钮会打开资料弹窗
  // - needSign=true 时点击按钮触发签名流程（异常通过 message 提示）
  const buttonProps: ButtonProps = {
    style: props.style,
    size: props.size,
    type: props.type,
    ghost: props.ghost,
    loading,
    className: classNames(className, prefixCls, hashId),
    onClick: async (e) => {
      setShowMenu(false);
      if (account && !profileOpen && profileModal && !needSign) {
        setProfileOpen(true);
      }
      onClick?.(e);

      try {
        if (needSign) {
          await sign?.signIn?.(account?.address);
        }
      } catch (error: any) {
        messageApi.error(error.message);
      }
    },
    ...restProps,
  };

  // 链选择器属性：用于在按钮左侧选择网络
  const chainProps: ChainSelectProps = {
    hashId,
    onSwitchChain,
    currentChain: chain,
    chains: availableChains as Chain[],
    buttonProps: {
      size: props.size,
      type: props.type,
    },
  };

  // 资料弹窗配置：展示头像、地址（带前缀）、价格等
  const chainIcon = account?.avatar ?? chain?.icon;
  const profileModalProps: ProfileModalProps = {
    open: profileOpen,
    __hashId__: hashId,
    onDisconnect: () => {
      setProfileOpen(false);
      onDisconnectClick?.();
    },
    onClose: () => {
      setProfileOpen(false);
    },
    address: account?.address,
    name: account?.name,
    avatar: {
      className: chainIcon
        ? `${prefixCls}-chain-icon`
        : `${prefixCls}-chain-icon ${prefixCls}-default-icon`,
      src: chainIcon,
      icon: !chainIcon && <UserOutlined />,
      ...avatar,
    },
    balance,
    modalProps: typeof profileModal === 'object' ? profileModal : undefined,
    addressPrefix: addressPrefixProp,
    size: props.size,
  };

  // 左侧链选择器渲染：仅当开启且有多个可选链时显示
  const chainSelectRender =
    chainSelect && availableChains && availableChains.length > 1 ? (
      <ChainSelect {...chainProps} />
    ) : null;

  // 登录签名模式下的按钮文案处理：可定制 signBtnTextRender
  if (needSign) {
    buttonText = signBtnTextRender ? (
      signBtnTextRender(buttonText, account)
    ) : (
      <>
        {"签名: "}
        {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
      </>
    );
  }

  // 按钮内部结构：文本与头像并排，支持 Divider 分隔
  const buttonInnerText = (
    <div className={`${prefixCls}-content`}>
      <div className={`${prefixCls}-content-inner`}>
        <div className={`${prefixCls}-text`}>{buttonText}</div>
        {(account?.avatar || avatar) && (
          <>
            <Divider type="vertical" />
            <div className={`${prefixCls}-avatar`}>
              <Avatar {...{ src: account?.avatar ?? avatar?.src, ...avatar }} />
            </div>
          </>
        )}
      </div>
    </div>
  );

  // 包装按钮为可选的「快速连接」模式与链选择器前缀
  const buttonContent = (
    <ConnectButtonInner
      {...buttonProps}
      preContent={chainSelectRender}
      showQuickConnect={quickConnect && !account}
      availableWallets={availableWallets}
      onConnectClick={(wallet?: Wallet) => {
        if (!account) {
          onConnectClick?.(wallet);
        }
      }}
      __hashId__={hashId}
    >
      {buttonInnerText}
    </ConnectButtonInner>
  );

  // 默认动作菜单项：复制地址、断开连接
  const defaultMenuItems: MenuItemType[] = useMemo(
    () => [
      {
        label: "复制地址",
        key: 'copyAddress',
        onClick: () => {
          setProfileOpen(false);
          if (account?.address) {
            writeCopyText(account?.address).then(() => {
              messageApi.success("复制成功");
            });
          }
        },
        icon: <CopyOutlined />,
      },
      {
        label: "断开连接",
        key: 'disconnect',
        onClick: () => {
          setProfileOpen(false);
          onDisconnectClick?.();
        },
        icon: <LoginOutlined />,
      },
    ],
    [account?.address, messageApi, onDisconnectClick],
  );

  // 合并外部动作菜单：支持完全覆盖 items 或在默认项后追加 extraItems
  const mergedMenuItems = useMemo<MenuItemType[]>(() => {
    if (!actionsMenu) {
      return [];
    }

    if (typeof actionsMenu === 'boolean') {
      return account ? defaultMenuItems : [];
    }

    if (actionsMenu.items) {
      return actionsMenu.items;
    }

    const combinedItems = account
      ? actionsMenu.extraItems
        ? [...actionsMenu.extraItems, ...defaultMenuItems]
        : defaultMenuItems
      : actionsMenu.extraItems || [];

    return combinedItems;
  }, [actionsMenu, defaultMenuItems, account]);

  // 当有合并后的菜单项时以 Dropdown 包裹按钮
  const content =
    mergedMenuItems.length > 0 ? (
      <Dropdown
        open={showMenu}
        onOpenChange={setShowMenu}
        menu={{
          items: mergedMenuItems,
          onClick: onMenuItemClick,
        }}
      >
        {buttonContent}
      </Dropdown>
    ) : (
      buttonContent
    );

  // Tooltip 复制能力：布尔或对象模式；title 可外部覆盖
  const mergedTooltipCopyable: ConnectButtonTooltipProps['copyable'] =
    typeof tooltip === 'object' ? tooltip.copyable !== false : !!tooltip;

  let tooltipTitle: string =
    tooltip && account?.address
      ? fillWithPrefix(account?.address, addressPrefixProp, addressPrefixContext)
      : '';
  if (typeof tooltip === 'object' && typeof tooltip.title === 'string') {
    tooltipTitle = tooltip.title;
  }

  // 主渲染：注入 Tooltip、Dropdown、ProfileModal，并通过样式封装 wrapSSR
  const main = (
    <>
      {contextHolder}
      {tooltipTitle ? (
        <ConnectButtonTooltip
          copyable={mergedTooltipCopyable}
          title={tooltipTitle}
          prefixCls={prefixCls}
          __hashId__={hashId}
          {...(typeof tooltip === 'object' ? tooltip : {})}
        >
          {content}
        </ConnectButtonTooltip>
      ) : (
        content
      )}
      <ProfileModal {...profileModalProps} />
    </>
  );

  return wrapSSR(main);
};

ConnectButton.displayName = 'ConnectButton';

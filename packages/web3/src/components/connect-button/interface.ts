/**
 * ConnectButton 类型与配置说明
 *
 * ConnectButtonStatus：按钮展示的三种状态（已连接/未连接/已签名）
 * MenuItemType：动作菜单项类型
 * ConnectButtonTooltipProps：Tooltip 的扩展配置（支持复制、格式化地址）
 * ConnectButtonProps：主组件的全部可选项
 *  - chainSelect：是否启用链选择器
 *  - avatar：按钮右侧头像配置
 *  - sign：登录签名配置
 *  - signBtnTextRender：自定义签名模式下的按钮文案
 *  - onMenuItemClick：菜单点击事件
 *  - tooltip：悬浮地址提示与复制
 *  - profileModal：资料弹窗开关或透传 ModalProps
 *  - addressPrefix：地址展示前缀（如 0x/其他链前缀），传 false 不加前缀
 *  - quickConnect：开启快速连接（检测已安装钱包）
 *  - actionsMenu：动作菜单（布尔开关 / 完全覆盖 items / 追加 extraItems）
 */
import type { Account, ConnectorTriggerProps, SignConfig, BalanceStatusConfig } from 'pelican-web3-lib-common';
import type { AvatarProps, ButtonProps, GetProp, MenuProps, TooltipProps } from 'antd';

import type { ProfileModalProps } from './profile-modal';

// biome-ignore lint/suspicious/noConstEnum: <explanation>
export const enum ConnectButtonStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Signed = 'signed',
}

export type MenuItemType = Extract<GetProp<MenuProps, 'items'>[number], { type?: 'item' }>;

export type ConnectButtonTooltipProps = TooltipProps & {
  __hashId__?: string;
  copyable?: boolean;
  title?: boolean | string | React.ReactNode;
  format?: (input: string) => string;
};

export type ConnectButtonProps = ButtonProps &
  ConnectorTriggerProps & {
    chainSelect?: boolean | true;
    prefixCls?: string;
    avatar?: AvatarProps;
    sign?: SignConfig;
    signBtnTextRender?: (signText?: React.ReactNode, account?: Account) => React.ReactNode;
    onMenuItemClick?: (e: NonNullable<MenuProps['items']>[number]) => void;
    tooltip?: boolean | ConnectButtonTooltipProps;
    profileModal?: boolean | ProfileModalProps['modalProps'];
    addressPrefix?: string | false;
    quickConnect?: boolean;
    balanceLoading?: BalanceStatusConfig;
    actionsMenu?:
      | boolean
      | {
          /**
           * Will override the default items
           */
          items?: MenuItemType[];
          /**
           * Will append to the default items
           */
          extraItems?: MenuItemType[];
        };
  };

export type { ConnectorTriggerProps };

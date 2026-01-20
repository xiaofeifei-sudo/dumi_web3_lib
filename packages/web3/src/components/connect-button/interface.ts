import type {
  Account,
  ConnectorTriggerProps,
  Locale,
  SignConfig,
} from 'pelican-web3-lib-common';
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
    locale?: Locale['ConnectButton'];
    avatar?: AvatarProps;
    sign?: SignConfig;
    signBtnTextRender?: (signText?: React.ReactNode, account?: Account) => React.ReactNode;
    onMenuItemClick?: (e: NonNullable<MenuProps['items']>[number]) => void;
    tooltip?: boolean | ConnectButtonTooltipProps;
    profileModal?: boolean | ProfileModalProps['modalProps'];
    addressPrefix?: string | false;
    quickConnect?: boolean;
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

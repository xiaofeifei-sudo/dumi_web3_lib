import React, { useContext } from 'react';
import type { Balance } from 'pelican-web3-lib-common';
import { Avatar, Button, ConfigProvider, message, Modal, Space } from 'antd';
import type { AvatarProps, ModalProps } from 'antd';
import classNames from 'classnames';

import { CryptoPrice } from '../crypto-price';
import type { IntlType } from '../../hooks/useIntl';
import { writeCopyText } from '../../utils';
import { fillWithPrefix } from '../../utils/format';

export interface ProfileModalProps {
  className?: string;
  intl: IntlType;
  /** @internal */
  __hashId__: string;
  avatar?: AvatarProps;
  address?: string;
  name?: string;
  onDisconnect?: () => void;
  open?: boolean;
  onClose?: () => void;
  modalProps?: Omit<ModalProps, 'open' | 'onClose' | 'className'>;
  balance?: Balance;
  addressPrefix?: string | false;
  size?: 'small' | 'middle' | 'large';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  className,
  intl,
  __hashId__,
  open,
  onClose,
  onDisconnect,
  avatar,
  name,
  address,
  modalProps,
  balance,
  addressPrefix,
  size,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('web3-connect-button-profile-modal');
  const [messageApi, contextHolder] = message.useMessage();

  const footer = (
    <div className={classNames(`${prefixCls}-footer`, __hashId__)}>
      {address ? (
        <Button
          size={size}
          onClick={() => {
            writeCopyText(address).then(() => {
              messageApi.success("复制成功");
            });
          }}
        >
          {"复制地址"}
        </Button>
      ) : null}
      <Button size={size} onClick={onDisconnect}>
        {"断开连接"}
      </Button>
    </div>
  );

  return (
    <>
      {contextHolder}
      <Modal
        footer={footer}
        width="fit-content"
        {...modalProps}
        onCancel={onClose}
        className={classNames(className, __hashId__, prefixCls)}
        styles={{
          ...modalProps?.styles,

          body: {
            textAlign: 'center',
            ...modalProps?.styles?.body,
          },
        }}
        open={open}
      >
        <Space align="center" direction="vertical">
          {avatar ? <Avatar {...avatar} /> : null}
          {name ? <div className={classNames(`${prefixCls}-name`, __hashId__)}>{name}</div> : null}
          {balance && <CryptoPrice {...balance} />}
          {address && (
            <div className={classNames(`${prefixCls}-address`, __hashId__)}>
              {fillWithPrefix(address, addressPrefix)}
            </div>
          )}
        </Space>
      </Modal>
    </>
  );
};
ProfileModal.displayName = 'ProfileModal';

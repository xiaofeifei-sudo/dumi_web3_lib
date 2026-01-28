/**
 * ProfileModal 组件
 * - 展示已连接账户的头像、名称、地址与余额信息
 * - 提供复制地址与断开连接的操作入口
 *
 * Props
 * - addressPrefix：地址展示前缀（传 false 则不添加）
 * - modalProps：透传原生 ModalProps（不包含 open/onClose/className）
 * - size：按钮大小同步
 */
import React, { useContext } from 'react';
import type { Balance } from 'pelican-web3-lib-common';
import { Avatar, Button, ConfigProvider, message, Modal, Space } from 'antd';
import type { AvatarProps, ModalProps } from 'antd';
import classNames from 'classnames';

import { CryptoPrice } from '../crypto-price';
import { writeCopyText } from '../../utils';
import { fillWithPrefix } from '../../utils/format';

export interface ProfileModalProps {
  className?: string;
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

  // 底部操作区：复制地址与断开连接
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

          // 居中展示内容，允许外部覆盖
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

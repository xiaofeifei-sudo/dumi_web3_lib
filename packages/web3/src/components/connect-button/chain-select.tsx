/**
 * ChainSelect 组件
 * - 在连接按钮左侧提供网络切换入口
 * - 点击后展示下拉菜单，列出所有可用链，选择后调用 onSwitchChain
 *
 * Props
 * - chains: 可选链列表
 * - currentChain: 当前链，用于显示图标与名称
 * - buttonProps: 透传按钮大小、类型等
 */
import React, { useContext } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { Chain } from 'pelican-web3-lib-common';
import type { ButtonProps } from 'antd';
import { Button, ConfigProvider, Dropdown, Space } from 'antd';
import classNames from 'classnames';

export interface ChainSelectProps {
  className?: string;
  hashId: string;
  chains: Chain[];
  onSwitchChain?: (chain: Chain) => void;
  currentChain?: Chain;
  style?: React.CSSProperties;
  buttonProps?: ButtonProps;
}

export const ChainSelect: React.FC<ChainSelectProps> = ({
  className,
  onSwitchChain,
  style,
  chains,
  hashId,
  currentChain,
  buttonProps,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('web3-connect-button-chain-select');
  return (
    <Button className={`${prefixCls}-button`} {...buttonProps}>
      <Dropdown
        className={classNames(className, hashId, prefixCls)}
        overlayClassName={`${prefixCls}-dropdown`}
        menu={{
          // 动态生成菜单项：点击项后回调 onSwitchChain
          items: chains.map((chain) => ({
            key: chain.id,
            label: chain.name,
            icon: chain.icon,
            onClick: () => {
              onSwitchChain?.(chain);
            },
          })),
        }}
        trigger={['click']}
      >
        <div className={`${prefixCls}-placeholder`} style={style}>
          <Space>
            {currentChain?.icon}
            {currentChain?.name}
            <DownOutlined />
          </Space>
        </div>
      </Dropdown>
    </Button>
  );
};

ChainSelect.displayName = 'ChainSelect';

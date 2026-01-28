/**
 * ConnectButtonTooltip 组件
 * - 为连接按钮提供地址悬浮提示与一键复制能力
 *
 * 行为说明
 * - title 支持字符串或节点；当为字符串时可通过 format/formatAddress 格式化展示
 * - copyable 为 true 时显示复制图标，点击后将原始 title 写入剪贴板
 * - 使用 antd message 反馈复制成功
 */
import { useMemo, type PropsWithChildren } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import classNames from 'classnames';

import { formatAddress, writeCopyText } from '../../utils';
import type { ConnectButtonTooltipProps } from './interface';

export const ConnectButtonTooltip: React.FC<
  PropsWithChildren<ConnectButtonTooltipProps>
> = ({ title, copyable, children, format, prefixCls, __hashId__, ...restProps }) => {
  const [messageApi, contextHolder] = message.useMessage();
  // 计算地址格式化方法：优先使用外部传入的 format；其次使用默认 formatAddress；否则返回原始字符串
  const mergedFormat = useMemo(() => {
    if (typeof format === 'function') {
      return format;
    }
    if (format) {
      return formatAddress;
    }
    return (input: string) => input;
  }, [format]);

  const mergedTitle = typeof title === 'string' ? mergedFormat(title) : title;

  if (!mergedTitle) return null;
  // 支持两种内容形式：带标题区与复制图标的富文本样式，或简单文本
  const content = copyable ? (
    format ? (
      <>
        <div className={`${prefixCls}-tooltip-title`}>
          {"钱包地址 "}{' '}
          <CopyOutlined
            title={"复制地址"}
            onClick={() => {
              writeCopyText(String(title)).then(() => {
                messageApi.success("复制成功");
              });
            }}
          />
        </div>
        <div className={`${prefixCls}-tooltip-content`}>{mergedTitle}</div>
      </>
    ) : (
      <>
        {mergedTitle}{' '}
        <CopyOutlined
          title={"复制地址"}
          onClick={() => {
            writeCopyText(String(title)).then(() => {
              messageApi.success("复制成功");
            });
          }}
        />
      </>
    )
  ) : (
    mergedTitle
  );
  return (
    <>
      {contextHolder}
      <Tooltip
        rootClassName={classNames(`${prefixCls}-tooltip`, __hashId__)}
        title={content}
        {...restProps}
      >
        {children}
      </Tooltip>
    </>
  );
};

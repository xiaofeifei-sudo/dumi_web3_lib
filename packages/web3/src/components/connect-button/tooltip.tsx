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

import React from 'react';
import type { Balance } from 'pelican-web3-lib-common';
import { ConfigProvider } from 'antd';
import { CryptoPriceBalance, type CryptoPriceFormatFn } from './crypto-price/balance';
import { useStyle } from './crypto-price/style';

export interface CryptoPriceProps extends Balance {
  className?: string;
  style?: React.CSSProperties;
  fixed?: number;
  icon?: boolean | React.ReactNode;
  format?: CryptoPriceFormatFn;
}

export const CryptoPrice: React.FC<CryptoPriceProps> = (props) => {
  const { getPrefixCls } = React.useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('web3-crypto-price-balance');
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const iconNode =
    props.icon === true ? props.icon : typeof props.icon !== 'boolean' ? props.icon : undefined;
  return wrapSSR(<CryptoPriceBalance {...props} icon={iconNode} hashId={hashId} />);
};

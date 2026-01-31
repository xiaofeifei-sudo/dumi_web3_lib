import React, { useContext, useMemo } from 'react';
import type { Balance } from 'pelican-web3-lib-common';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { formatBalance } from '../../utils';

export type FormatInfo = {
  originValue: number | bigint;
  symbol: string;
  decimals?: number;
  fixed?: number;
};

export type CryptoPriceFormatFn = (preFormatValue: string, info: FormatInfo) => string;

export interface CryptoPriceBalanceProps extends Balance {
  className?: string;
  hashId: string;
  style?: React.CSSProperties;
  fixed?: number;
  icon?: React.ReactNode;
  format?: CryptoPriceFormatFn;
}

export const CryptoPriceBalance: React.FC<CryptoPriceBalanceProps> = ({
  className,
  style,
  hashId,
  symbol = 'ETH',
  decimals = 18,
  value = 0,
  fixed,
  icon,
  format,
  formatted,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('web3-crypto-price-balance');

  const preFormatValue = useMemo(() => {
    if (formatted !== undefined) {
      return formatted;
    }
    if (value === undefined || decimals === undefined) {
      return '';
    }
    return formatBalance(value, decimals, fixed);
  }, [formatted, value, decimals, fixed]);

  const displayText = useMemo(() => {
    if (!preFormatValue) {
      return symbol ? `0 ${symbol}` : '0';
    }
    if (format) {
      return format(preFormatValue, {
        symbol,
        decimals,
        fixed,
        originValue: value,
      });
    }
    return symbol ? `${preFormatValue} ${symbol}` : preFormatValue;
  }, [preFormatValue, symbol, decimals, fixed, format, value]);

  return (
    <span style={style} className={classNames(className, hashId, prefixCls)}>
      {icon ? <>{icon} </> : null}
      {displayText}
    </span>
  );
};

CryptoPriceBalance.displayName = 'CryptoPriceBalance';

import type React from 'react';
import { useContext } from 'react';
import type { CSSInterpolation } from '@ant-design/cssinjs';
import { useStyleRegister } from '@ant-design/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import { ConfigProvider as AntdConfigProvider, theme as AntTheme } from 'antd';
import type { GlobalToken } from 'antd';

import { ComponentToken as ConnectModalComponentToken } from '../components/connect-modal/style';

const { useToken } = AntTheme;

export const setAlpha = (baseColor: string, alpha: number) =>
  new TinyColor(baseColor).setAlpha(alpha).toRgbString();

export const lighten = (baseColor: string, brightness: number) => {
  const instance = new TinyColor(baseColor);
  return instance.lighten(brightness).toHexString();
};

export type GenerateStyle<ComponentToken extends object = GlobalToken, ReturnType = CSSInterpolation> = (
  token: ComponentToken,
  ...rest: any[]
) => ReturnType;

export type UseStyleResult = {
  wrapSSR: (node: React.ReactElement) => React.ReactElement;
  hashId: string;
};

export type Web3AliasToken = GlobalToken & {
  web3ComponentsCls: string;
  antCls: string;
  ConnectModal?: Partial<ConnectModalComponentToken>;
};

export function useStyle(componentName: string, styleFn: (token: Web3AliasToken) => CSSInterpolation) {
  const { theme, token, hashId } = useToken();
  const { getPrefixCls } = useContext(AntdConfigProvider.ConfigContext);
  const web3Token: Web3AliasToken = {
    ...token,
    web3ComponentsCls: `.${getPrefixCls('web3')}`,
    antCls: `.${getPrefixCls()}`,
  };

  return {
    wrapSSR: useStyleRegister(
      {
        theme,
        token: web3Token,
        hashId,
        path: [componentName],
      },
      () => styleFn(web3Token),
    ),
    hashId,
  };
}

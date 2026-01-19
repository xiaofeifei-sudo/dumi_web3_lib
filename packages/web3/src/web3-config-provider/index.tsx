import { ConfigProvider, type ThemeConfig } from 'antd';
import {
  Web3ConfigProvider as AntdWeb3ConfigProvider,
  type Web3ConfigProviderProps,
} from 'pelican-web3-lib-common';

interface Web3ThemeConfig extends ThemeConfig {}

const Web3ConfigProvider: React.FC<{ theme?: Web3ThemeConfig } & Web3ConfigProviderProps> = (
  props,
) => {
  const { theme, ...restProps } = props;
  return (
    <ConfigProvider
      theme={{
        ...theme,
        components: {
          ...theme?.components,
        },
      }}
    >
      <AntdWeb3ConfigProvider {...restProps} />
    </ConfigProvider>
  );
};

export { Web3ConfigProvider, type Web3ThemeConfig };

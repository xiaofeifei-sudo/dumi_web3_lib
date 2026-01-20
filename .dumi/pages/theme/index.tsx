import React, { useContext, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { usePrefersColor } from 'dumi';
import SiteContext from 'dumi-theme-antd-web3/dist/slots/SiteContext';

import { Theme } from '../../components/Theme';
import { FullTheme, themes } from '../../components/Theme/components/Thumbnail';
import { ThemeContext } from '../../components/ThemeContext';
import styles from '../index/index.module.less';

const ThemePage: React.FC = () => {
  const [color, prefersColor] = usePrefersColor();
  const [curTheme, setCurTheme] = React.useState<FullTheme>(themes[0]);
  const displayTheme = color === 'dark' ? themes[1] : curTheme;
  const { updateSiteConfig } = useContext(SiteContext);

  const updateTheme = (theme: FullTheme) => {
    updateSiteConfig({
      theme: [theme.name === 'Dark' ? 'dark' : 'light'],
    });
    setCurTheme(theme);
  };

  const themeStyle: React.CSSProperties = {
    '--theme-main-bg': displayTheme.mainBg,
  } as React.CSSProperties;

  useEffect(() => {
    if (prefersColor === 'auto') {
      document.documentElement.setAttribute(
        'data-prefers-color',
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      );
    }
  }, [prefersColor]);

  return (
    <ThemeContext.Provider
      value={{
        curTheme: displayTheme,
        updateTheme,
      }}
    >
      <ConfigProvider
        theme={{
          ...displayTheme?.token,
        }}
      >
        <div className={classNames(styles.container)} style={themeStyle}>
          <Theme />
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemePage;


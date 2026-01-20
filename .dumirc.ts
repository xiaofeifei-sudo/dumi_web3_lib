import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'dumi';

const openSSR = process.env.SSR || process.env.NODE_ENV === 'production';

// utils must build before core
// runtime must build before renderer-react
const pkgList = readdirSync(join(__dirname, 'packages'))
  .map((pkg) => {
    const packagePath = join(__dirname, 'packages', pkg, 'package.json');
    if (!existsSync(packagePath)) {
      return;
    }

    const packageJson = require(packagePath);

    return {
      name: packageJson.name,
      exports: packageJson.exports,
      path: join(__dirname, 'packages', pkg, 'src'),
    };
  })
  .filter((v) => !!v);

const alias = pkgList.reduce(
  (pre, pkg) => {
    pre[pkg.name] = pkg.path;

    // has multiple entries
    if (pkg.exports?.['.']) {
      Object.keys(pkg.exports).forEach((key) => {
        pre[`${pkg.name}/${key}`] = join(pkg.path, key);
      });
    }

    return pre;
  },
  (openSSR
    ? {
        // 打开 SSR 的情况下需要配置 wagmi 的别名，因为安装了 18.3.0-canary-c3048aab4-20240326 版本的 react 会导致文档 demo 和 packages 中依赖不同版本的 wagmi（pnpm 的包管理机制的原因），导致出现类似下面这样的错误
        // `useConfig` must be used within `WagmiProvider`. Docs: https://wagmi.sh/react/api/WagmiProvider.html Version: wagmi@2.12.13
        wagmi: resolve('./node_modules/wagmi'),
        // 指定 antd 版本，避免 antd 多版本下官网 design token 不生效的问题
        antd: resolve('./node_modules/antd'),
        '@tanstack/react-query': resolve('./node_modules/@tanstack/react-query'),
        '@ant-design/cssinjs': resolve('./node_modules/@ant-design/cssinjs'),
      }
    : {}) as Record<string, string>,
);

export default defineConfig({
  title: 'Web3 Examples',
  headScripts: [],
  ssr: openSSR
    ? {
        // for improve seo
        // 需要使用 React 18.3.0-canary-c3048aab4-20240326 版本，因为 umi 是基于整个 HTML 做的水合，在 18.3.1 版本有 bug，会导致浏览器插件的内容影响水合
        // 在 pnpm run build:docs 修改 react 版本，不能在依赖中直接修改，一方面是为了组件开发环境尽可能和用户环境一致，另外一方面是为了避免 vitest 使用多个版本的 React 情况下报错
        // config useStream to false, 否则会导致 html 不是直接插入到 root 中的
        // 本地开发关闭 SSR，因为本地使用的是 18.3.1 版本，打开会因为水合失败报错，如果要调试，可以临时安装 React 18.3.0-canary-c3048aab4-20240326 版本，然后打开 ssr 调试
        useStream: false,
      }
    : false,
  mfsu: false,
  alias,
  metas: [
    {
      name: 'keywords',
      content: 'Web3, Ethereum, Solana, TON, Sui, Bitcoin, dapp, frontend, react, examples',
    },
    { name: 'description', content: 'A minimal site showcasing Web3 connection examples.' },
    {
      property: 'og:site_name',
      content: 'Web3 Examples',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent',
    },
    {
      name: 'theme-color',
      content: '#1890ff',
    },
    {
      name: 'google-site-verification',
      content: '9LDp--DeEC-xOggsHl_t1MlR_1_2O972JpSUu8NZKMU',
    },
  ],
  resolve: {
    atomDirs: [{ type: 'component', dir: 'packages/web3/src' }],
  },
  jsMinifierOptions: {
    target: ['chrome80', 'es2020'],
  },
  copy: [],
  define: {
    YOUR_ZAN_API_KEY: 'd0eeefc2a4da4a8ba707889259b437d6',
    YOUR_INFURA_API_KEY: '287294cbc30b44efab9455664b69b130',
    YOUR_WALLET_CONNECT_PROJECT_ID: 'c07c0051c2055890eade3556618e38a6',
    YOUR_TIPLINK_CLIENT_ID: '4f243e28-3cfa-4d6c-abed-6b8f72a0d18d',
  },
  publicPath: process.env.PUBLIC_PATH || '/',
  base: process.env.BASE || '/',
  themeConfig: {
    logo: false,
    name: 'Web3 Examples',
    rtl: false,
    lastUpdated: false,
    nav: {
      'en-US': [
        { title: 'Components', link: '/components/overview' },
        { title: 'Theme', link: '/theme' },
      ],
      'zh-CN': [
        { title: '组件', link: '/components/overview-cn' },
        { title: '主题', link: '/theme-cn' },
      ],
    },
    localesEnhance: [
      { id: 'en-US', switchPrefix: '中' },
      { id: 'zh-CN', switchPrefix: 'en' },
    ],
    sidebarGroupModePath: ['/components'],
    docVersions: false,
  },
  locales: [
    {
      id: 'en-US',
      name: 'English',
      suffix: '',
    },
    {
      id: 'zh-CN',
      name: '中文',
      suffix: '-cn',
    },
  ],
  extraBabelPlugins: [
    [
      'inline-react-svg',
      {
        svgo: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
            'removeDimensions',
            'convertStyleToAttrs',
          ],
        },
      },
    ],
    'react-inline-svg-unique-id',
  ],
});

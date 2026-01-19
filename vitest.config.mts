import path from 'node:path';
import svgr from 'vite-plugin-svgr';
import { defineConfig, ViteUserConfig } from 'vitest/config';

const resolve = (src: string) => {
  return path.resolve(__dirname, src);
};

const isDist = process.env.LIB_DIR === 'dist';

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
      include: ['**/*.svg'],
    }),
  ] as ViteUserConfig["plugins"],
  resolve: {
    alias: isDist
      ? {
          'pelican-web3-lib': resolve('./packages/web3/dist/esm/index'),
          'pelican-web3-lib-icons': resolve('./packages/icons/dist/esm/index'),
          'pelican-web3-lib-assets/solana': resolve('./packages/assets/dist/esm/solana/index'),
          'pelican-web3-lib-assets/tokens': resolve('./packages/assets/dist/esm/tokens/index'),
          'pelican-web3-lib-assets/wallets': resolve('./packages/assets/dist/esm/wallets/index'),
          'pelican-web3-lib-assets': resolve('./packages/assets/dist/esm/index'),
          'pelican-web3-lib-wagmi': resolve('./packages/wagmi/dist/esm/index'),
          'pelican-web3-lib-ethers-v5': resolve('./packages/ethers-v5/dist/esm/index'),
          'pelican-web3-lib-ethers': resolve('./packages/ethers/dist/esm/index'),
          'pelican-web3-lib-ethers/provider': resolve(
            './packages/ethers/dist/esm/ethers-provider/index',
          ),
          'pelican-web3-lib-ethers/wallets': resolve('./packages/ethers/dist/esm/wallets/index'),
          'pelican-web3-lib-solana': resolve('./packages/solana/dist/esm/index'),
          'pelican-web3-lib-sui': resolve('./packages/sui/dist/esm/index'),
          'pelican-web3-lib-ton': resolve('./packages/ton/dist/esm/index'),
          'pelican-web3-lib-tron': resolve('./packages/tron/dist/esm/index'),
          'pelican-web3-lib-eth-web3js': resolve('./packages/eth-web3js/dist/esm/index'),
          'pelican-web3-lib-common': resolve('./packages/common/dist/esm/index'),
        }
      : {
          'pelican-web3-lib': resolve('./packages/web3/src/index'),
          'pelican-web3-lib-icons': resolve('./packages/icons/src/index'),
          'pelican-web3-lib-assets/solana': resolve('./packages/assets/src/solana/index'),
          'pelican-web3-lib-assets/tokens': resolve('./packages/assets/src/tokens/index'),
          'pelican-web3-lib-assets/wallets': resolve('./packages/assets/src/wallets/index'),
          'pelican-web3-lib-assets': resolve('./packages/assets/src/index'),
          'pelican-web3-lib-wagmi': resolve('./packages/wagmi/src/index'),
          'pelican-web3-lib-ethers-v5': resolve('./packages/ethers-v5/src/index'),
          'pelican-web3-lib-ethers': resolve('./packages/ethers/src/index'),
          'pelican-web3-lib-ethers/provider': resolve(
            './packages/ethers/src/ethers-provider/index',
          ),
          'pelican-web3-lib-ethers/wallets': resolve('./packages/ethers/src/wallets/index'),
          'pelican-web3-lib-solana': resolve('./packages/solana/src/index'),
          'pelican-web3-lib-sui': resolve('./packages/sui/src/index'),
          'pelican-web3-lib-ton': resolve('./packages/ton/src/index'),
          'pelican-web3-lib-tron': resolve('./packages/tron/src/index'),
          'pelican-web3-lib-eth-web3js': resolve('./packages/eth-web3js/src/index'),
          'pelican-web3-lib-common': resolve('./packages/common/src/index'),
        },
  },
  test: {
    environment: 'jsdom',
    include: ['./packages/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    reporters: ['default'],
    coverage: {
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: [
        '**/demos/**/*.{ts,tsx}',
        '**/src/index.ts',
        '**/__tests__/*.{ts,tsx}',
        '**/*.test.{ts,tsx}',
        '**/__mocks__/*.{ts,tsx}',
      ],
      reporter: ['json-summary', ['text', { skipFull: true }], 'cobertura', 'html'],
    },
    testTimeout: 3e4,
    alias: {
      'copy-to-clipboard': resolve('./tests/copy-to-clipboard'),
    },
  },
});

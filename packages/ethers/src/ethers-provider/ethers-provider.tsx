import React from 'react';
import {
  Mainnet,
  WagmiWeb3ConfigProvider,
  WalletConnect,
  type WagmiWeb3ConfigProviderProps,
} from 'pelican-web3-lib-wagmi';
import type { Chain } from 'viem';
import { createConfig, http, type CreateConnectorFn, type Storage } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import * as wagmiConnectors from 'wagmi/connectors';

/** Ethers 包的 Web3 配置 Provider 额外配置
 * - 基于 WagmiWeb3ConfigProvider，内部自动生成 config
 * - storage: 指定 wagmi 的持久化存储；传入 false 可禁用持久化
 */
export interface EthersWeb3ConfigProviderProps
  extends Omit<WagmiWeb3ConfigProviderProps, 'config'> {
  /** wagmi 的存储实现；传入 false 表示不使用存储（仅内存） */
  storage?: Storage | false;
}

/** 使用 wagmi + ethers 构建 Web3 配置 Provider
 * - 根据 props.chains 映射到 wagmi 支持的链
 * - 依据 props.wallets 与 walletConnect 生成连接器
 * - 提供统一的 Web3 Config 上下文，包裹 children
 */
export const EthersWeb3ConfigProvider: React.FC<
  React.PropsWithChildren<EthersWeb3ConfigProviderProps>
> = ({ children, walletConnect, storage, ...props }) => {
  // 将 viem Chain 转换为 wagmi 链配置，不支持的链会给出警告
  const chains = React.useMemo(
    () =>
      (props.chains ?? [Mainnet])
        .map((chain) => {
          const wagmiChain = Object.values(wagmiChains).find((wc) => wc.id === chain.id) ?? null;
          if (!wagmiChain?.id) console.warn(`Chain ${chain.id} is not supported`);
          return wagmiChain;
        })
        .filter((chain) => chain !== null) as unknown as readonly [Chain, ...Chain[]],

    // only check chains id
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.chains?.map((chain) => chain.id).join()],
  );

  // 合并自定义钱包列表；配置了 WalletConnect 项目 ID 时自动追加 WalletConnect
  const wallets = React.useMemo(() => {
    const targetWallets = [...(props.wallets ?? [])];
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (walletConnect && walletConnect.projectId) targetWallets.push(WalletConnect());
    return targetWallets;
  }, [props.wallets, walletConnect]);

  // 创建 wagmi 配置：transports（HTTP RPC）、connectors（钱包连接器）、storage（可选）
  const wagmiConfig = React.useMemo(() => {
    const transports = Object.fromEntries(chains.map((chain) => [chain.id, http()]));
    const connectors: CreateConnectorFn[] = [wagmiConnectors.injected()];

    (props.wallets ?? []).forEach((wallet) => {
      if (wallet.name) {
        connectors.push(wagmiConnectors.injected({ target: wallet.name as any }));
      }
    });

    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (walletConnect && walletConnect.projectId) {
      connectors.push(
        wagmiConnectors.walletConnect({
          ...walletConnect,
          showQrModal: walletConnect.useWalletConnectOfficialModal ?? false,
        }),
      );
    }
    return createConfig({
      chains,
      transports,
      connectors,
      storage: storage === false ? null : storage,
    });
  }, [chains, walletConnect, props.wallets, storage]);

  return (
    <WagmiWeb3ConfigProvider {...props} config={wagmiConfig} wallets={wallets}>
      {children}
    </WagmiWeb3ConfigProvider>
  );
};

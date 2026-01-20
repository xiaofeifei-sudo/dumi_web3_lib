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

/**
 * Provider 组件的属性
 * - 继承 WagmiWeb3ConfigProviderProps，移除内部生成的 config
 * - storage: 控制 wagmi 的持久化存储；传入 false 则禁用存储
 */
export interface EthWeb3jsConfigProviderProps extends Omit<WagmiWeb3ConfigProviderProps, 'config'> {
  storage?: Storage | false;
}

/**
 * 基于 wagmi 的以太坊 Web3.js Provider
 * - 根据传入的 chains 解析为 wagmi 支持的链
 * - 根据 wallets 生成连接器，支持注入类钱包与 WalletConnect
 * - 自动创建 wagmi 配置并交给内部 WagmiWeb3ConfigProvider
 */
export const EthWeb3jsConfigProvider: React.FC<
  React.PropsWithChildren<EthWeb3jsConfigProviderProps>
> = ({ children, walletConnect, storage, ...props }) => {
  /** 解析并过滤有效链，确保至少存在 1 条链 */
  const chains = React.useMemo(
    () =>
      (props.chains ?? [Mainnet])
        .map((chain) => {
          const wagmiChain = Object.values(wagmiChains).find((wc) => wc.id === chain.id) ?? null;
          if (!wagmiChain?.id) console.warn(`Chain ${chain.id} is not supported`);
          return wagmiChain;
        })
        .filter((chain) => chain !== null) as unknown as readonly [Chain, ...Chain[]], // 类型断言保证至少一个链

    // only check chains id
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.chains?.map((chain) => chain.id).join()],
  );

  /** 组合可用钱包；如配置了 WalletConnect 的 projectId，则自动加入 */
  const wallets = React.useMemo(() => {
    const targetWallets = [...(props.wallets ?? [])];
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (walletConnect && walletConnect.projectId) targetWallets.push(WalletConnect());
    return targetWallets;
  }, [props.wallets, walletConnect]);

  /** 构建 wagmi 配置，包括链、传输与连接器；根据 storage 控制持久化 */
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

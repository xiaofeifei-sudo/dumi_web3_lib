/**
 * Web3 配置提供者（Sui）
 * - 统一把 @mysten/dapp-kit 提供的账户、钱包、SuiNS、余额等信息
 *   适配到 pelican-web3-lib-common 的 Web3ConfigProvider 结构
 * - 支持链切换、余额展示、SNS 解析、NFT 元数据读取等能力
 * - ignoreConfig 用于多链并存时只让激活的 Provider 参与配置合并
 */
import React, {useCallback, useMemo} from 'react';
import {
  useConnectWallet,
  useCurrentAccount,
  useDisconnectWallet,
  useResolveSuiNSName,
  useSuiClient,
  useSuiClientQuery,
  useWallets,
} from '@mysten/dapp-kit';
import {SUI} from 'pelican-web3-lib-assets/tokens';
import type {Account, Locale, UniversalWeb3ProviderInterface} from 'pelican-web3-lib-common';
import {type Wallet, Web3ConfigProvider} from 'pelican-web3-lib-common';
import {SuiColorful} from 'pelican-web3-lib-icons';

import type {SuiChain} from 'pelican-web3-lib-assets';
import type {WalletFactory} from '../wallets/types';

type GetNFTMetadata = NonNullable<UniversalWeb3ProviderInterface['getNFTMetadata']>;

export interface PelicanWeb3ConfigProviderProps {
  /** 是否展示账户余额（SUI） */
  balance?: boolean;
  /** 组件内文案/格式使用的语言 */
  locale?: Locale;
  /** 可用的 Sui 链列表（mainnet/testnet/devnet/localnet） */
  availableChains?: SuiChain[];
  /** 可用的钱包工厂列表（非标准钱包） */
  availableWallets?: WalletFactory[];
  /** 当前所在链，用于展示浏览器链接、图标等 */
  currentChain?: SuiChain;
  /** 是否启用 SuiNS 解析，将地址解析为名称 */
  sns?: boolean;
  /** 当前链变更时的回调，传入 network 字符串 */
  onCurrentChainChange: (network: string) => void;
  /**
   * If true, this provider's configuration will be ignored when merging with parent context.
   * This is useful when you have multiple chain providers and want to switch between them
   * without causing page flickering. Only the active provider should not have this flag set.
   */
  /** 当为 true 时，忽略当前 Provider 的配置合并（多链场景避免页面闪烁） */
  ignoreConfig?: boolean;
}

export const PelicanWeb3ConfigProvider: React.FC<
  React.PropsWithChildren<PelicanWeb3ConfigProviderProps>
> = ({
       balance: showBalance,
       locale,
       availableChains,
       availableWallets,
       currentChain,
       sns,
       onCurrentChainChange,
       ignoreConfig,
       children,
     }) => {
  const account = useCurrentAccount();
  const standardWallets = useWallets();
  const {mutateAsync: connectAsync} = useConnectWallet();
  const {mutateAsync: disconnectAsync} = useDisconnectWallet();
  const {data: snsData} = useResolveSuiNSName(sns ? account?.address : undefined);
  const client = useSuiClient();

  const {data: balanceData} = useSuiClientQuery(
    'getBalance',
    {
      owner: account?.address ?? '',
    },
    {
      select(data) {
        return BigInt(data.totalBalance);
      },
    },
  );

  /** 把 dapp-kit 的账户信息适配成通用 Account 数据结构 */
  const accountData: Account | undefined = account
    ? {
      address: account.address,
      name: sns && snsData ? snsData : undefined,
    }
    : undefined;

  /**
   * 合并标准钱包（浏览器注入的 dapp-kit 钱包）与外部提供的钱包工厂
   * - 标准钱包通过 useWallets() 获取
   * - availableWallets 是非标准钱包的工厂，去重后合并
   */
  const allWallets = useMemo<Wallet[]>(() => {
    const standardWalletNames = standardWallets.map((w) => w.name);

    const fixedWallets = availableWallets
      ?.map((factory) => factory.create())
      ?.filter((w) => !standardWalletNames.includes(w.name));

    const injectedWalletAssets = standardWallets.map<Wallet>((w) => {
      return {
        name: w.name,
        icon: w.icon,
        remark: w.name,
        _standardWallet: w,
        async hasExtensionInstalled() {
          return true;
        },
        async hasWalletReady() {
          return true;
        },
      };
    });

    return fixedWallets ? fixedWallets.concat(injectedWalletAssets) : injectedWalletAssets;
  }, [availableWallets, standardWallets]);

  /**
   * 读取 NFT 元数据：
   * - 通过 SuiClient.getObject 拉取对象
   * - 优先使用 display.data 的展示字段
   * - 根据 moveObject 的 fields 提取自定义属性
   */
  const getNFTMetadataFunc = useCallback<GetNFTMetadata>(
    async ({address}) => {
      const {data: nftData} = await client.getObject({
        id: address,
        options: {
          showContent: true,
          showDisplay: true,
        },
      });

      const displayData = nftData?.display?.data;
      const objectFields: Record<string, any> | undefined =
        nftData?.content?.dataType === 'moveObject' ? nftData.content.fields : undefined;

      return {
        image: displayData?.image_url,
        date: objectFields?.birthdate,
        attributes: objectFields?.attributes,
        description: displayData?.description,
        edition: nftData?.version,
      };
    },
    [client],
  );

  return (
    <Web3ConfigProvider
      availableChains={availableChains}
      availableWallets={allWallets}
      locale={locale}
      account={accountData}
      chain={currentChain}
      balance={
        showBalance
          ? {
            symbol: SUI.symbol,
            decimals: SUI.decimal,
            value: balanceData,
            icon: <SuiColorful/>,
          }
          : undefined
      }
      connect={async (wallet) => {
        const foundWallet = wallet?._standardWallet;

        if (!foundWallet) {
          throw new Error(`Can not find wallet ${wallet?.name}`);
        }

        const {accounts} = await connectAsync({wallet: foundWallet});
        const defaultAccount = accounts[0];
        const addresses = accounts.map((item) => item.address) as unknown as Account['addresses'];

        return {
          address: defaultAccount.address,
          addresses: addresses,
        };
      }}
      disconnect={async () => {
        await disconnectAsync();
      }}
      switchChain={async (chain) => {
        const network = availableChains?.find((item) => item.id === chain.id)?.network;

        if (network) {
          /** 把链对象映射为 network 字符串并通知外部 */
          onCurrentChainChange(network);
        }
      }}
      getNFTMetadata={getNFTMetadataFunc}
      ignoreConfig={ignoreConfig}
    >
      {children}
    </Web3ConfigProvider>
  );
};

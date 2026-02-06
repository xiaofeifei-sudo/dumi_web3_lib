import React from 'react';
import {type Account, type Chain, ConnectStatus, type Wallet, Web3ConfigProvider, type Token, type CustomToken, formatBalance, fillAddressWith0x,} from 'pelican-web3-lib-common';
import { WalletConnectWallets } from 'pelican-web3-lib-assets';
import type {Config as WagmiConfig} from 'wagmi';
import {
  type Connector as WagmiConnector,
  useAccount,
  useBalance,
  useConfig,
  useConnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
  useSwitchChain,
} from 'wagmi';
import {disconnect, getAccount} from 'wagmi/actions';
import { getBalance as getBalanceRealtime } from './methods/getBalance';

import {Mainnet} from '../chains';
import { normalizeEvmError } from '../errors';
import type {EIP6963Config, SIWEConfig, WalletFactory, WalletUseInWagmiAdapter,} from '../interface';
import {isEIP6963Connector} from '../utils';
import {EIP6963Wallet} from '../wallets/eip6963';
import {getNFTMetadata, sendTransaction as sendTx} from './methods';

/**
 * PelicanWeb3ConfigProvider 组件属性
 * - chainAssets: 支持的链资产列表（用于映射 wagmi 链到展示用链信息）
 * - walletFactories: 钱包工厂列表（根据连接器生成可用钱包）
 * - children: 子节点
 * - ens: 是否启用 ENS 名称与头像解析
 * - balance: 是否查询账户余额
 * - eip6963: EIP-6963 配置（注入式钱包自动发现等）
 * - wagimConfig: wagmi 配置实例
 * - useWalletConnectOfficialModal: 是否使用 WalletConnect 官方二维码弹窗
 * - siwe: Sign-In With Ethereum 配置（含 nonce、消息生成与验证方法）
 * - ignoreConfig: 是否忽略当前 Provider 的配置以避免多 Provider 合并时的闪烁
 */
export interface PelicanWeb3ConfigProviderProps {
  chainAssets: Chain[];
  walletFactories: WalletFactory[];
  children?: React.ReactNode;
  ens?: boolean;
  balance?: boolean;
  /**
   * 指定 ERC-20 代币以查询余额（传入后优先显示该代币余额）
   * - 根据当前链自动匹配合约地址
   * - 未匹配到合约或非 EVM 合约时回退为原生余额
   */
  token?: Token;
  customToken?: CustomToken;
  eip6963?: EIP6963Config;
  wagimConfig: WagmiConfig;
  useWalletConnectOfficialModal?: boolean;
  siwe?: SIWEConfig;
  /**
   * 若为 true，则在与父级上下文合并时忽略当前 Provider 的配置。
   * 当存在多个链 Provider 需要切换时，可避免页面闪烁。
   * 仅激活中的 Provider 不应设置该标志。
   */
  ignoreConfig?: boolean;
}

/**
 * PelicanWeb3ConfigProvider
 * 将 wagmi 的账户、连接器、链信息整合为 pelican-web3-lib 的通用上下文，
 * 提供账户、余额、ENS、钱包列表、链切换、NFT 元数据查询及 SIWE 登录能力。
 */
export const PelicanWeb3ConfigProvider: React.FC<PelicanWeb3ConfigProviderProps> = (props) => {
  const {
    children,
    chainAssets,
    walletFactories,
    ens = true,
    balance,
    token,
    customToken,
    eip6963,
    wagimConfig,
    useWalletConnectOfficialModal,
    siwe,
    ignoreConfig,
  } = props;
  const {address, isDisconnected, chain, addresses, connector} = useAccount();
  const config = useConfig();
  const {connectAsync} = useConnect();
  const {switchChain} = useSwitchChain();
  
  /// 若当前链不存在，回退为 Wagmi 配置的第一个链 ID
  const chainIdForBalance = chain?.id || wagimConfig.chains?.[0]?.id;

  /// 若自定义代币指定合约地址，优先使用；否则根据链 ID 查询代币合约地址
  const tokenContractOnChain = React.useMemo(() => {
    if (customToken?.contract) {
      return fillAddressWith0x(customToken.contract);
    }
    if (!token || !chainIdForBalance) return undefined;
    const found = token.availableChains?.find((item) => item?.chain?.id === chainIdForBalance);
    const contract = found?.contract;
    if (typeof contract === 'string') {
      return fillAddressWith0x(contract) as `0x${string}`;
    }
    return undefined;
  }, [customToken, token, chainIdForBalance]);


  /// 查询账户余额（支持 ERC-20 代币）
  const {
    data: balanceData,
    refetch: refetchBalance,
    isLoading: isBalanceLoading,
  } = useBalance({
    address,
    token: tokenContractOnChain,
    chainId: chainIdForBalance,
    query: {
      enabled: !!(balance && address && chainIdForBalance),
      refetchInterval: balance && address ? 5000 : undefined,
      retry: Number.POSITIVE_INFINITY,
    },
  });

  /// 查询 ENS 名称与头像（若启用 ENS 功能）
  const {data: ensName} = useEnsName({address});

  /// 查询 ENS 头像（若启用 ENS 功能）
  const {data: ensAvatar} = useEnsAvatar({name: ensName ?? undefined});

  /// 签名消息（Sign-In With Ethereum）
  const {signMessageAsync} = useSignMessage();

  /// 连接状态（Connected/Disconnected）
  const [status, setStatus] = React.useState<ConnectStatus>(ConnectStatus.Disconnected);

  /// 当前连接钱包（根据连接器名称匹配）
  const [currentWallet, setCurrentWallet] = React.useState<Wallet | undefined>(undefined);

  
  /// 更新连接状态与当前钱包
  React.useEffect(() => {
    const nextStatus = isDisconnected ? ConnectStatus.Disconnected : ConnectStatus.Connected;
    console.info('[Web3Config] 连接状态更新', {
      address,
      chainId: chain?.id,
      disconnected: isDisconnected,
      status: nextStatus,
    });
    setStatus(nextStatus);
  }, [address, isDisconnected, chain?.id, connector?.name]);


  /// 构建账户信息（包含地址、ENS 名称、头像、状态等）
  const account: Account | undefined = React.useMemo(() => {
    if (address && !isDisconnected) {
      return {
        address,
        name: ensName && ens ? ensName : undefined,
        avatar: ensAvatar ?? undefined,
        addresses,
        status: status,
      };
    }
    return undefined;
  }, [address, isDisconnected, ensName, ensAvatar, addresses, status, ens]);


  /**
   * 判断连接器名称是否匹配（忽略空格与大小写）
   * 如：okxWallet、Okx Wallet、OKX Wallet 视为一致
   */
  const isConnectorNameMatch = (aName: string, bName: string) => {
    // 匹配连接器名称，例如 okxWallet、Okx Wallet、OKX Wallet
    return aName.replace(/ /g, '').toLowerCase() === bName.replace(/ /g, '').toLowerCase();
  };

  /**
   * 通过名称查找连接器，优先匹配 EIP-6963 注入式连接器
   */
  const findConnectorByName = (name: string): WagmiConnector | undefined => {
    const commonConnector = wagimConfig.connectors.find(
      (item) => isConnectorNameMatch(item.name, name) && !isEIP6963Connector(item),
    );
    if (!eip6963) {
      return commonConnector;
    }
    const eip6963Connector = wagimConfig.connectors.find(
      (item) => item.name === name && isEIP6963Connector(item),
    );
    return eip6963Connector || commonConnector;
  };

  /**
   * 生成可用钱包列表：
   * - 根据钱包工厂配置与已存在的连接器组合生成支持的钱包
   * - 在开启 EIP-6963 自动追加时，会为未显式配置的注入式钱包自动加入
   */
  const wallets: Wallet[] = React.useMemo(() => {
    const autoAddEIP6963Wallets: Wallet[] = [];
    wagimConfig.connectors.forEach((itemConnector) => {
      if (isEIP6963Connector(itemConnector)) {
        // 检查是否需要自动添加 EIP-6963 注入式钱包
        if (
          typeof eip6963 === 'object' &&
          eip6963?.autoAddInjectedWallets &&
          !walletFactories.find((item) =>
            item.connectors.some((aName) => isConnectorNameMatch(aName, itemConnector.name)),
          )
        ) {
          // 未在配置中定义，但在连接器中发现该钱包，则自动添加
          autoAddEIP6963Wallets.push(
            EIP6963Wallet().create([itemConnector], {
              useWalletConnectOfficialModal,
            }),
          );
        }
        // EIP-6963 钱包无需继续检查
        return;
      }

      const walletFactory = walletFactories.find((factory) =>
        factory.connectors.some((aName) => isConnectorNameMatch(aName, itemConnector.name)),
      );

      if (!walletFactory?.create) {
        // 检查用户钱包配置并提示错误
        console.error(
          `Can not find wallet factory for ${itemConnector.name}, you should config it in WagmiWeb3ConfigProvider 'wallets'.`,
        );
      }
    });

    // Generate Wallet for pelican-web3-lib
    const supportWallets = walletFactories
      .map((factory) => {
        const connectors = factory.connectors
          .map(findConnectorByName)
          .filter((item) => !!item) as WagmiConnector[];

        if (connectors.length === 0 && !eip6963) {
          // 该钱包工厂未配置连接器且未启用 EIP-6963，忽略该钱包
          console.error(
            `Can not find connector for ${factory.connectors.join(
              ',',
            )}, ignore the wallet. Please config connectors or add eip6963 config in WagmiWeb3ConfigProvider.`,
          );
          return null;
        }
        return factory.create(connectors, {
          useWalletConnectOfficialModal,
        });
      })
      .filter((item) => item !== null) as Wallet[];

    return [...supportWallets, ...autoAddEIP6963Wallets];
  }, [wagimConfig.connectors, walletFactories, eip6963]);

  React.useEffect(() => {
    if (!connector || isDisconnected) {
      setCurrentWallet(undefined);
      return;
    }
    setCurrentWallet((prev) => {
      if (prev) {
        return prev;
      }
      const matched = wallets.find((item) => isConnectorNameMatch(item.name, connector.name));
      return matched ?? prev;
    });
  }, [connector, isDisconnected, wallets]);

  /**
   * 将 wagmi 链配置映射为展示用链信息（id、name、icon）
   */
  const chainList: Chain[] = React.useMemo(() => {
    return wagimConfig.chains
      .map((item) => {
        const c = chainAssets?.find((asset) => {
          return asset.id === item.id;
        });
        if (c?.id) {
          return {
            id: c.id,
            name: c.name,
            icon: c.icon,
          };
        }
        console.error(
          `Can not find chain ${item.id}, you should config it in WagmiWeb3ConfigProvider 'chains'.`,
        );
        return null;
      })
      .filter((item) => item !== null) as Chain[];
  }, [wagimConfig.chains, chainAssets]);

  const chainId = chain?.id || wagimConfig.chains?.[0]?.id;
  const chainName = chain?.name || wagimConfig.chains?.[0]?.name;
  const [currentChain, setCurrentChain] = React.useState<Chain | undefined>(undefined);

  React.useEffect(() => {
    setCurrentChain((prevChain) => {
      // 未连接任何链时，保持当前链不变
      let newChain = chainAssets?.find((item) => item?.id === chainId);
      if (!newChain && chainId) {
        newChain = {id: chainId, name: chainName};
      }
      /* v8 ignore next */
      return newChain || prevChain;
    });
  }, [chainAssets, wagimConfig.chains, chainId, chainName]);

  /// 当前链的原生货币（若存在）
  const currency = currentChain?.nativeCurrency;

  
  /// 余额小数位数（根据余额数据、代币配置或货币配置）
  const balanceDecimals = balanceData?.decimals ?? token?.decimal ?? currency?.decimals;
  /// 格式化后的余额（若余额数据和小数位数均存在）
  const balanceFormatted =
    balanceData?.value !== undefined && balanceDecimals !== undefined
      ? formatBalance(balanceData.value as bigint, balanceDecimals)
      : undefined;

  const getNFTMetadataFunc = React.useCallback(
    async ({address: contractAddress, tokenId}: { address: string; tokenId?: bigint }) => {
      console.info('[Web3Config] getNFTMetadata 调用', {
        contractAddress,
        tokenId: tokenId?.toString(),
        chainId: chain?.id,
      });
      const result = await getNFTMetadata(config, contractAddress, tokenId!, chain?.id);
      console.info('[Web3Config] getNFTMetadata 完成', {
        hasResult: !!result,
      });
      return result;
    },
    [chain?.id],
  );

  const signIn = React.useCallback(
    async (signAddress: string) => {
      const {getNonce, createMessage, verifyMessage} = siwe!;
      let msg: string;
      let signature: `0x${string}`;
      try {
        console.info('[Web3Config] SIWE signIn 调用', {
          address: signAddress,
          chainId: currentChain?.id ?? Mainnet.id,
        });
        const nonce = await getNonce(signAddress);
        console.debug('[Web3Config] SIWE nonce 获取成功');
        msg = createMessage({
          domain: window?.location ? window.location.hostname : '',
          address: signAddress as `0x${string}`,
          uri: window?.location ? window.location.origin : '',
          nonce,
          version: '1',
          chainId: currentChain?.id ?? Mainnet.id,
        });
        if (signMessageAsync) {
          signature = await signMessageAsync?.({message: msg});
          await verifyMessage(msg!, signature!);
          console.info('[Web3Config] SIWE 验证成功，更新状态为 Signed');
          setStatus(ConnectStatus.Signed);
        }
      } catch (error: any) {
        console.error('[Web3Config] SIWE signIn 失败', {
          address: signAddress,
          message: error?.message ?? String(error),
        });
        throw normalizeEvmError(error, { action: 'sign' });
      }
    },
    [siwe, currentChain, signMessageAsync],
  );

  return (
    <Web3ConfigProvider
      availableChains={chainList}
      chain={currentChain}
      account={account}
      wallet={currentWallet}
      wcWallets={WalletConnectWallets}
      getBalance={async (params?: { token?: Token; customToken?: CustomToken }) => {
        if (!address) {
          console.info('[Web3Config] getBalance 调用但当前无地址');
          return undefined;
        }
        console.info('[Web3Config] getBalance 调用', {
          address,
          chainId: chainIdForBalance,
          tokenSymbol: params?.token?.symbol ?? token?.symbol,
          hasCustomToken: !!(params?.customToken ?? customToken),
        });
        const result = await getBalanceRealtime(
          config,
          address,
          chainIdForBalance,
          params?.token ?? token,
          currency?.icon,
          params?.customToken,
        );
        if (result) {
          console.info('[Web3Config] getBalance 完成', {
            address,
            chainId: chainIdForBalance,
            symbol: result.symbol,
            value: result.value?.toString(),
          });
        } else {
          console.info('[Web3Config] getBalance 完成，未获取到结果', {
            address,
            chainId: chainIdForBalance,
          });
        }
        return result;
      }}
      sendTransaction={async (params) => {
        try {
          const fromAccount = getAccount(config);
          const targetChainId = chain?.id ?? wagimConfig.chains?.[0]?.id;
          console.info('[Web3Config] sendTransaction 调用', {
            from: fromAccount?.address,
            to: params?.to,
            chainId: targetChainId,
          });
          if (refetchBalance) {
            refetchBalance();
          }
          const result = await sendTx(config, {
            ...params,
            chainId: targetChainId,
          });
          console.info('[Web3Config] sendTransaction 成功', {
            txHash: result,
          });
          return result;
        } catch (error: any) {
          console.error('[Web3Config] sendTransaction 失败', {
            message: error?.message ?? String(error),
          });
          throw normalizeEvmError(error, { action: 'transfer' });
        }
      }}
      sign={
        siwe && {
          signIn,
        }
      }
      balance={
        balance
          ? {
            symbol: balanceData?.symbol,
            value: balanceData?.value,
            decimals: balanceDecimals,
            icon: token?.icon ?? currency?.icon,
            formatted: balanceFormatted,
          }
          : undefined
      }
      balanceLoading={
        balance && !!address && (isBalanceLoading)
          ? {status: 'fetching'}
          : false
      }
      availableWallets={wallets}
      addressPrefix="0x"
      connect={async (wallet, options) => {
        try {
          console.info('[Web3Config] connect 调用', {
            walletName: wallet?.name,
            chainId: currentChain?.id,
          });
          let targetConnector = await (wallet as WalletUseInWagmiAdapter)?.getWagmiConnector?.(
            options,
          );
          if (!targetConnector && wallet) {
            targetConnector = findConnectorByName(wallet.name);
          }
          if (!targetConnector) {
            throw new Error(`Can not find connector for ${wallet?.name}`);
          }
          const {accounts} = await connectAsync({
            connector: targetConnector,
            chainId: currentChain?.id,
          });
          console.info('[Web3Config] connect 成功', {
            walletName: wallet?.name,
            chainId: currentChain?.id,
            accountCount: accounts?.length,
          });
          if (wallet) {
            setCurrentWallet(wallet);
          }
          return {
            address: accounts?.[0],
            addresses: accounts,
          };
        } catch (e: any) {
          console.error('[Web3Config] connect 失败', {
            walletName: wallet?.name,
            message: e?.message ?? String(e),
          });
          throw normalizeEvmError(e, { action: 'connect', walletName: wallet?.name });
        }
      }}
      disconnect={async () => {
        const {connector: activeConnector, address: fromAddress} = getAccount(config);
        console.info('[Web3Config] disconnect 调用', {
          address: fromAddress,
        });
        try {
          await disconnect(config, {connector: activeConnector});
          console.info('[Web3Config] disconnect 成功', {
            address: fromAddress,
          });
        } catch (error: any) {
          console.error('[Web3Config] disconnect 失败', {
            address: fromAddress,
            message: error?.message ?? String(error),
          });
          throw normalizeEvmError(error, { action: 'disconnect' });
        } finally {
          setCurrentWallet(undefined);
        }
      }}
      switchChain={async (newChain: Chain) => {
        if (!chain) {
          console.info('[Web3Config] switchChain 调用（未连接链，直接更新本地状态）', {
            toChainId: newChain.id,
          });
          setCurrentChain(newChain);
        } else {
          console.info('[Web3Config] switchChain 调用', {
            fromChainId: chain.id,
            toChainId: newChain.id,
          });
          try {
            await switchChain?.({chainId: newChain.id});
            console.info('[Web3Config] switchChain 成功', {
              toChainId: newChain.id,
            });
          } catch (error: any) {
            console.error('[Web3Config] switchChain 失败', {
              fromChainId: chain.id,
              toChainId: newChain.id,
              message: error?.message ?? String(error),
            });
            throw normalizeEvmError(error, {
              action: 'switch_chain',
              chainId: newChain.id,
            });
          }
        }
      }}
      getNFTMetadata={getNFTMetadataFunc}
      ignoreConfig={ignoreConfig}
    >
      {children}
    </Web3ConfigProvider>
  );
};

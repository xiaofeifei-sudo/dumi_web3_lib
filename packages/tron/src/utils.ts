/* v8 ignore start */
import { WalletReadyState } from '@tronweb3/tronwallet-abstract-adapter';
import { TronWalletNotSupportSwitchChainError } from './errors/wallet-not-support-switch-chain-error';

// 判断钱包是否“就绪”：已发现或正在加载即视为就绪
export const hasWalletReady = (readyState?: WalletReadyState) =>
  readyState === WalletReadyState.Found || readyState === WalletReadyState.Loading;

/// 获取 TRON 网络信息：通过查询区块 0 来获取链 ID 及节点地址
export const getNetworkInfoByTronWeb = async (tronWeb: any) => {
  const { blockID = '' } = await tronWeb.trx.getBlockByNumber(0);
  const chainId = `0x${blockID.slice(-8)}`;
  return {
    chainId,
    fullNode: tronWeb.fullNode?.host || '',
    solidityNode: tronWeb.solidityNode?.host || '',
    eventServer: tronWeb.eventServer?.host || '',
  };
};

/// 解析 TRON Web 实例：优先使用适配器中的，否则 fallback 到全局 window 对象
export const resolveTronWeb = (adapter?: any) => {
  const adapterTronWeb = adapter?.tronWeb;
  const injectedTronWeb = (window as any)?.tronWeb;
  return adapterTronWeb || injectedTronWeb;
};


/// 切换 TRON 网络：通过适配器的 switchChain 方法切换网络
export const switchTronChain = async (adapter?: any, newChain?: any, wallet?: any) => {
  if (!wallet?.supportSwitchChain) {
    throw new TronWalletNotSupportSwitchChainError();
  }
  if (typeof adapter?.switchChain === 'function') {
    await adapter.switchChain(newChain?.id);
    return;
  }
  throw new TronWalletNotSupportSwitchChainError();
};

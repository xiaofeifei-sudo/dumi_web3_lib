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

export const tronToBigInt = (v: any): bigint => {
  if (v === undefined || v === null) return 0n;
  if (typeof v === 'bigint') return v;
  if (typeof v === 'number') return BigInt(v);
  if (typeof v === 'string') {
    const s = v.startsWith('0x') ? v : `0x${v}`;
    try {
      return BigInt(s);
    } catch {
      try {
        return BigInt(v);
      } catch {
        return 0n;
      }
    }
  }
  if (Array.isArray(v) && v.length > 0) {
    return tronToBigInt(v[0]);
  }
  if (typeof v === 'object' && v.constantResult && Array.isArray(v.constantResult)) {
    return tronToBigInt(v.constantResult[0]);
  }
  return 0n;
};

export const tronToNumber = (v: any, fallback = 6): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return Number(v);
  if (Array.isArray(v) && v.length > 0) return Number(v[0]);
  if (typeof v === 'object' && v.constantResult && Array.isArray(v.constantResult)) {
    const hex = v.constantResult[0];
    try {
      return Number(BigInt(hex.startsWith('0x') ? hex : `0x${hex}`));
    } catch {
      return Number(hex);
    }
  }
  return fallback;
};

export const triggerSmartContractCompat = async (
  tronWeb: any,
  contractAddress: string,
  functionSelector: string,
  parameter: any[] = [],
  options: any = {},
) => {
  if (typeof tronWeb?.transactionBuilder?.triggerSmartContract === 'function') {
    return tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress,
      functionSelector,
      options,
      parameter,
    );
  }
  if (typeof tronWeb?.trx?.triggerSmartContract === 'function') {
    return tronWeb.trx.triggerSmartContract(
      contractAddress,
      functionSelector,
      options,
      parameter,
    );
  }
  const host =
    tronWeb?.fullNode?.host || tronWeb?.solidityNode?.host || tronWeb?.eventServer?.host;
  if (host) {
    try {
      const res = await fetch(`${host.replace(/\/$/, '')}/wallet/triggersmartcontract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_address: contractAddress,
          function_selector: functionSelector,
          parameter,
        }),
      });
      if (res.ok) return await res.json();
      const res2 = await fetch(`${host.replace(/\/$/, '')}/wallet/triggerconstantcontract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_address: '',
          contract_address: contractAddress,
          function_selector: functionSelector,
          parameter,
        }),
      });
      if (res2.ok) return await res2.json();
    } catch {}
  }
  return null;
};

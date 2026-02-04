import type { Balance, Chain, Token, CustomToken } from 'pelican-web3-lib-common';
import { formatBalance } from 'pelican-web3-lib-common';
import { trc20Abi } from '../../abi/trc20';

/**
 * 实时获取 TRON 余额（原生 TRX 或 TRC-20）
 */
export async function getBalance(
  tronWeb: any,
  address: string,
  currentChain?: Chain,
  token?: Token,
  customToken?: CustomToken,
): Promise<Balance | undefined> {
  if (!tronWeb || !address) return undefined;
  const currency = currentChain?.nativeCurrency;
  const contractOnChain = token?.availableChains?.find(
    (item) => (item?.chain as any)?.id === (currentChain as any)?.id,
  )?.contract;
  const toBigInt = (v: any): bigint => {
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
      return toBigInt(v[0]);
    }
    if (typeof v === 'object' && v.constantResult && Array.isArray(v.constantResult)) {
      return toBigInt(v.constantResult[0]);
    }
    return 0n;
  };
  const toNumber = (v: any): number => {
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
    return token?.decimal ?? 6;
  };
  if (contractOnChain) {
    const contract = await tronWeb.contract(trc20Abi, contractOnChain);
    const rawBalance = await contract.balanceOf(tronWeb.address.toHex(address)).call();
    const rawDecimals = await contract.decimals().call();
    const value = toBigInt(rawBalance);
    const decimals = toNumber(rawDecimals);
    const formatted =
      value !== undefined && decimals !== undefined
        ? formatBalance(value, decimals)
        : undefined;
    return {
      symbol: token?.symbol,
      value,
      decimals,
      icon: token?.icon,
      formatted,
    };
  }
  if (customToken?.contract) {
    const contract = await tronWeb.contract(trc20Abi, customToken.contract);
    const rawBalance = await contract.balanceOf(tronWeb.address.toHex(address)).call();
    const value = toBigInt(rawBalance);
    let decimals = customToken.decimal;
    if (decimals === undefined) {
      const rawDecimals = await contract.decimals().call();
      decimals = toNumber(rawDecimals);
    }
    const formatted =
      value !== undefined && decimals !== undefined
        ? formatBalance(value, decimals)
        : undefined;
    return {
      value,
      decimals,
      formatted,
    };
  }
  const sun: number = await tronWeb.trx.getBalance(address);
  const value = BigInt(sun);
  const decimals = currency?.decimals ?? 6;
  const formatted =
    value !== undefined && decimals !== undefined
      ? formatBalance(value, decimals)
      : undefined;
  return {
    symbol: currency?.symbol,
    value,
    decimals,
    icon: currency?.icon,
    formatted,
  };
}

import type { Balance, Chain, Token, CustomToken } from 'pelican-web3-lib-common';
import { formatBalance } from 'pelican-web3-lib-common';
import { trc20Abi } from '../../abi/trc20';
import { tronToBigInt } from '../../utils';
import { getTokenDecimals } from './getTokenDecimals';

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
  const toBigInt = tronToBigInt;
  if (contractOnChain) {
    const contract = await tronWeb.contract(trc20Abi, contractOnChain);
    const rawBalance = await contract.balanceOf(tronWeb.address.toHex(address)).call();
    const value = toBigInt(rawBalance);
    const decimals = await getTokenDecimals(tronWeb, contractOnChain);
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
      decimals = await getTokenDecimals(tronWeb, customToken.contract);
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

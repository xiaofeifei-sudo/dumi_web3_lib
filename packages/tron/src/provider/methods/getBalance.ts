import type { Balance, Chain, Token, CustomToken } from 'pelican-web3-lib-common';
import { formatBalance } from 'pelican-web3-lib-common';
import { trc20Abi } from '../../abi/trc20';
import { tronToBigInt, triggerSmartContractCompat } from '../../utils';
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
  const canTrigger =
    typeof tronWeb?.contract === 'function' ||
    typeof tronWeb?.transactionBuilder?.triggerSmartContract === 'function' ||
    typeof tronWeb?.trx?.triggerSmartContract === 'function' ||
    !!tronWeb?.fullNode?.host ||
    !!tronWeb?.solidityNode?.host ||
    !!tronWeb?.eventServer?.host;
  const toAddressParam = (addr: string) => {
    try {
      if (typeof tronWeb?.address?.toHex === 'function') {
        return tronWeb.address.toHex(addr);
      }
    } catch {}
    return addr;
  };
  if (contractOnChain) {
    let value: bigint = 0n;
    if (typeof tronWeb?.contract === 'function') {
      const contract = await tronWeb.contract(trc20Abi, contractOnChain);
      const rawBalance = await contract.balanceOf(toAddressParam(address)).call();
      value = toBigInt(rawBalance);
    } else {
      const res = await triggerSmartContractCompat(
        tronWeb,
        contractOnChain,
        'balanceOf(address)',
        [{ type: 'address', value: toAddressParam(address) }],
        {},
      );
      const raw = (res?.constant_result ?? res?.constantResult)?.[0];
      value = toBigInt(raw);
    }
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
  if (customToken?.contract && canTrigger) {
    let value: bigint = 0n;
    if (typeof tronWeb?.contract === 'function') {
      const contract = await tronWeb.contract(trc20Abi, customToken.contract);
      const rawBalance = await contract.balanceOf(toAddressParam(address)).call();
      value = toBigInt(rawBalance);
    } else {
      const res = await triggerSmartContractCompat(
        tronWeb,
        customToken.contract,
        'balanceOf(address)',
        [{ type: 'address', value: toAddressParam(address) }],
        {},
      );
      if (!res) {
        value = 0n;
      } else {
        const raw = (res?.constant_result ?? res?.constantResult)?.[0];
        value = toBigInt(raw);
      }
    }
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
  let sunRaw: any = 0;
  if (typeof tronWeb?.trx?.getBalance === 'function') {
    sunRaw = await tronWeb.trx.getBalance(address);
  } else if (typeof tronWeb?.trx?.getAccount === 'function') {
    const account = await tronWeb.trx.getAccount(address);
    sunRaw = account?.balance ?? 0;
  }
  const value = toBigInt(sunRaw);
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

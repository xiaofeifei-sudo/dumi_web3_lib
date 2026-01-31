import type { Config } from 'wagmi';
import { getBalance as getNativeBalance, readContract } from 'wagmi/actions';
import { fillAddressWith0x, formatBalance } from 'pelican-web3-lib-common';
import type { Balance, Token, CustomToken } from 'pelican-web3-lib-common';
import type React from 'react';
import { erc20Abi } from 'viem';

/**
 * 实时获取 EVM 余额（原生或 ERC-20）
 */
export async function getBalance(
  config: Config,
  address: string | `0x${string}`,
  chainId?: number,
  token?: Token,
  currencyIcon?: React.ReactNode,
  customToken?: CustomToken,
): Promise<Balance | undefined> {
  if (!address) return undefined;
  const addr = fillAddressWith0x(address);
  if (token && chainId) {
    const found = token.availableChains?.find((item) => item?.chain?.id === chainId);
    const contract = found?.contract;
    if (typeof contract === 'string' && contract.toLowerCase().startsWith('0x')) {
      const decimals = await readContract(config as any, {
        address: fillAddressWith0x(contract),
        chainId,
        abi: erc20Abi,
        functionName: 'decimals',
      });
      const value = await readContract(config as any, {
        address: fillAddressWith0x(contract),
        chainId,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [addr],
      });
      const decimalsNum = Number(decimals as number);
      const formatted =
        value !== undefined ? formatBalance(value as bigint, decimalsNum) : undefined;
      return {
        symbol: token.symbol,
        value: value as bigint,
        decimals: decimalsNum,
        icon: token.icon,
        formatted,
      };
    }
  }
  if (customToken && chainId) {
    const contract = fillAddressWith0x(customToken.contract);
    const value = await readContract(config as any, {
      address: contract,
      chainId,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [addr],
    });
    const decimalsNum = customToken.decimal;
    const formatted =
      value !== undefined ? formatBalance(value as bigint, decimalsNum) : undefined;
    return {
      value: value as bigint,
      decimals: decimalsNum,
      icon: currencyIcon,
      formatted,
    };
  }
  const res = await getNativeBalance(config as any, {
    address: addr,
    chainId,
  });
  const decimalsNum = res.decimals;
  const formatted =
    res.value !== undefined ? formatBalance(res.value as bigint, decimalsNum) : undefined;
  return {
    symbol: res.symbol,
    value: res.value,
    decimals: decimalsNum,
    icon: token?.icon ?? currencyIcon,
    formatted,
  };
}

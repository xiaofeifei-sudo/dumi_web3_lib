import type { Config } from 'wagmi';
import { getBalance as getNativeBalance, readContract } from 'wagmi/actions';
import { fillAddressWith0x } from 'pelican-web3-lib-common';
import type { Balance, Token } from 'pelican-web3-lib-common';
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
      return {
        symbol: token.symbol,
        value: value as bigint,
        decimals: Number(decimals as number),
        icon: token.icon,
      };
    }
  }
  const res = await getNativeBalance(config as any, {
    address: addr,
    chainId,
  });
  return {
    symbol: res.symbol,
    value: res.value,
    decimals: res.decimals,
    icon: token?.icon ?? currencyIcon,
  };
}

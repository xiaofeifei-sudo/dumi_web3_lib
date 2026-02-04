import type { Config } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { erc20Abi } from 'viem';
import { fillAddressWith0x } from 'pelican-web3-lib-common';

export async function getTokenDecimals(
  config: Config,
  contract: string,
  chainId: number,
): Promise<number> {
  const address = fillAddressWith0x(contract);
  const decimals = await readContract(config, {
    address,
    chainId,
    abi: erc20Abi,
    functionName: 'decimals',
  });
  return Number(decimals as number);
}

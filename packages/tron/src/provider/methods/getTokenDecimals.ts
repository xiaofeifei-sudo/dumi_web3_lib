import { trc20Abi } from '../../abi/trc20';
import { tronToNumber } from '../../utils';

export async function getTokenDecimals(tronWeb: any, contractAddress: string): Promise<number> {
  const contract = await tronWeb.contract(trc20Abi, contractAddress);
  const rawDecimals = await contract.decimals().call();
  return tronToNumber(rawDecimals, 6);
}


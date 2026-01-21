import { fillAddressWith0x, requestWeb3Asset, type NFTMetadata } from 'pelican-web3-lib-common';
import type { Config } from 'wagmi';
import { readContract } from 'wagmi/actions';

/**
 * 获取 ERC-721/1155 NFT 的链上元数据
 * - 通过合约方法 tokenURI 读取元数据地址
 * - 使用 requestWeb3Asset 拉取并解析元数据
 * @param config wagmi 配置实例
 * @param address NFT 合约地址
 * @param tokenId 令牌 ID
 * @param chainId 可选链 ID
 * @returns NFT 元数据对象
 */
export async function getNFTMetadata(
  config: Config,
  address: string,
  tokenId: bigint,
  chainId?: number,
): Promise<NFTMetadata> {
  const tokenURI = await readContract(config as any, {
    address: fillAddressWith0x(address),
    args: [tokenId],
    chainId,
    abi: [
      {
        name: 'tokenURI',
        inputs: [
          {
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        outputs: [{ name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'tokenURI',
  });
  const metaInfo = await requestWeb3Asset(tokenURI as string);
  return metaInfo;
}

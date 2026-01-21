// 说明：本文件提供将 wagmi 的 viem Client 转换为 ethers.js v5 Signer 的工具与 Hook
// 目标：在保持 v6 配置的前提下，为 v5 开发者提供熟悉的 Signer 接口
import { useMemo } from 'react';
import { providers } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import { useConnectorClient, type Config } from 'wagmi';

/* v8 ignore next 11 */
/**
 * 将 wagmi 的 Client 转换为 ethers.js v5 的 Signer
 * @param client 来自 wagmi 的连接器客户端（包含账户、链与传输层）
 * @returns 对应的 v5 Signer（绑定到当前账户地址）
 */
export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  // 构造网络信息，用于创建 v5 的 Web3Provider
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  // 使用传输层作为底层 provider，生成 v5 的 Web3Provider
  const provider = new providers.Web3Provider(transport, network);
  // 从 provider 中获取与当前账户地址绑定的 signer
  const signer = provider.getSigner(account.address);
  return signer;
}

/**
 * React Hook：获取 ethers.js v5 的 Signer
 * - 当连接器已经返回客户端数据时，生成并返回 v5 Signer
 * - 未连接时返回 null
 */
export function useEthersSigner() {
  const { data: client } = useConnectorClient<Config>();
  /* v8 ignore next */
  return useMemo(() => (client ? clientToSigner(client) : null), [client]);
}

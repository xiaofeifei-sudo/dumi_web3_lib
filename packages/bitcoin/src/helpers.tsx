// 说明：比特币相关的辅助方法，包括余额查询与 Ordinals 铭文内容解析
import type { Balance } from 'pelican-web3-lib-common';
import { BitcoinCircleColorful } from 'pelican-web3-lib-icons';

import { HIRO_API, MEMPOOL_API, ORDINALS_URL } from './constants';
import { NoBalanceError, NoInscriptionError } from './error';
import type { HiroInscription, Inscription } from './types';

/**
 * 构造 Balance 对象（单位：sats）
 * @param sats 余额（聪）
 * @returns 通用 Balance 结构，包含符号与图标
 */
export const getBalanceObject = (sats: number): Balance => {
  return {
    value: BigInt(sats),
    decimals: 8,
    symbol: 'BTC',
    icon: <BitcoinCircleColorful />,
  };
};

/**
 * 通过 mempool.space API 获取地址余额（Confirmed）
 * @param address 比特币地址
 * @returns 包含 BTC 余额信息的 Balance
 */
export const getBalanceByMempool = async (address: string): Promise<Balance> => {
  const res = await fetch(`${MEMPOOL_API}/address/${address}`);
  if (res.ok) {
    const data = await res.json();
    const { chain_stats } = data;
    const { funded_txo_sum, spent_txo_sum } = chain_stats;
    return getBalanceObject(funded_txo_sum - spent_txo_sum);
  }

  throw new NoBalanceError();
};

/**
 * 通过 Hiro API 获取某地址的 Ordinals 铭文列表
 * @param address 比特币地址
 * @param limit 每页数量
 * @param offset 偏移量
 * @returns 总数与映射后的铭文列表
 */
export const getInscriptionsByAddress = async ({
  address,
  limit,
  offset,
}: {
  address: string;
  limit: number;
  offset: number;
}): Promise<{ total: number; list: Inscription[] }> => {
  const params = { address, limit: `${limit}`, offset: `${offset}` };
  const res = await fetch(`${HIRO_API}/ordinals/v1/inscriptions?${new URLSearchParams(params)}`);
  if (res.ok) {
    const { results, total } = await res.json();
    const list = (results as HiroInscription[]).map(
      ({
        id,
        number,
        address: addr,
        value,
        timestamp,
        content_type,
        content_length,
        offset: inscriptionOffset,
        genesis_tx_id,
        location,
        output,
      }) => ({
        // 内容与预览链接指向 ordinals.com
        content: `${ORDINALS_URL}/content/${id}`,
        preview: `${ORDINALS_URL}/preview/${id}`,
        inscriptionId: id,
        inscriptionNumber: number,
        address: addr,
        outputValue: Number(value),
        contentLength: content_length,
        contentType: content_type,
        timestamp,
        offset: Number(inscriptionOffset),
        genesisTransaction: genesis_tx_id,
        location,
        output,
      }),
    );
    return { list, total };
  }

  throw new NoInscriptionError();
};

/**
 * 根据铭文 ID 获取其内容链接（ordinals.com）
 * @param inscriptionId 铭文唯一 ID
 * @returns 可直接展示的内容地址
 */
export const getInscriptionContentById = async (inscriptionId: string): Promise<string> => {
  const res = await fetch(`${HIRO_API}/ordinals/v1/inscriptions/${inscriptionId}`);
  if (res.ok) {
    const { id } = await res.json();
    return `${ORDINALS_URL}/content/${id}`;
  }

  throw new NoInscriptionError();
};

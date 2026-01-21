// 说明：Bitcoin 相关的类型定义
// - 复用 sats-connect 的结果与 Provider 类型
export type { SignPsbtResult, BitcoinProvider } from 'sats-connect';

/**
 * PSBT 签名的可选参数
 * - signInputs：按地址指定需要签名的输入索引
 * - broadcast：是否在签名后广播交易（不同钱包支持情况不一）
 * - signHash：自定义 sighash 类型
 */
export interface SignPsbtOptions {
  signInputs?: Record<string, number[]>;
  broadcast?: boolean;
  signHash?: number;
}

/**
 * PSBT 签名入参
 * - psbt：十六进制字符串形式的 PSBT
 * - options：签名控制选项
 */
export interface SignPsbtParams {
  psbt: string;
  options?: SignPsbtOptions;
}

/**
 * 转账参数
 * - to：收款地址
 * - sats：转账金额（聪）
 * - options：兼容各钱包的附加选项（如 Unisat 的 feeRate）
 */
export interface TransferParams {
  to: string;
  sats: number;
  // feeRate is only for unisat. Users can set their desired transaction fee by xverse.
  options?: { feeRate: number };
}

// 说明：Ordinals 铭文类型（来自 Unisat 声明）
export type Inscription = Unisat.Inscription;

// 说明：Hiro API 返回的铭文对象结构
export interface HiroInscription {
  id: string;
  number: number;
  address: string;
  genesis_tx_id: string;
  location: string;
  output: string;
  value: string;
  offset: string;
  content_type: string;
  content_length: number;
  timestamp: number;
}

/**
 * 内置钱包工厂
 * - Suiet / Slush：根据资产元数据创建钱包工厂
 * - SuiWallet：已废弃，请使用 Slush()（与标准 Sui Wallet 对齐）
 */
/* v8 ignore start */
import { metadata_Slush, metadata_Suiet } from 'pelican-web3-lib-assets';

import { WalletFactory } from './factory';

/** 使用 Suiet 的元数据构建钱包工厂 */
export const Suiet = () => WalletFactory(metadata_Suiet);
/** 使用 Slush 的元数据构建钱包工厂 */
export const Slush = () => WalletFactory(metadata_Slush);

/** @deprecated Please use `Slush()` instead */
/** 已废弃：请使用 Slush() 以保持与标准 Sui Wallet 一致 */
export const SuiWallet = () => WalletFactory(metadata_Slush);

/* v8 ignore start */
// 说明：预设钱包工厂的便捷导出，结合资产包中的元数据
import {
  metadata_OkxWallet,
  metadata_Phantom,
  metadata_Unisat,
  metadata_Xverse,
} from 'pelican-web3-lib-assets';

import {
  OkxBitcoinWallet,
  PhantomBitcoinWallet,
  UnisatBitcoinWallet,
  XverseBitcoinWallet,
} from '../adapter';
import { WalletFactory } from './factory';

// 通过 WalletFactory 生成具体钱包，供 Provider 挂载使用
export const UnisatWallet = () => WalletFactory(UnisatBitcoinWallet, metadata_Unisat);
export const XverseWallet = () => WalletFactory(XverseBitcoinWallet, metadata_Xverse);
export const OkxWallet = () => WalletFactory(OkxBitcoinWallet, metadata_OkxWallet);
export const PhantomWallet = () => WalletFactory(PhantomBitcoinWallet, metadata_Phantom);

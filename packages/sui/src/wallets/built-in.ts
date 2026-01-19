/* v8 ignore start */
import { metadata_Slush, metadata_Suiet } from 'pelican-web3-lib-assets';

import { WalletFactory } from './factory';

export const Suiet = () => WalletFactory(metadata_Suiet);
export const Slush = () => WalletFactory(metadata_Slush);

/** @deprecated Please use `Slush()` instead */
export const SuiWallet = () => WalletFactory(metadata_Slush);

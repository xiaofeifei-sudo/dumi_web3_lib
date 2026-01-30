import type { TronAction, TronErrorCode } from './index';
import { TronProviderError } from './index';

export class TronWalletNotSupportSwitchChainError extends TronProviderError {
  constructor(message = '当前钱包不支持切换网络。') {
    super({
      message,
      code: 5005 as TronErrorCode,
      action: 'switch_chain' as TronAction,
      name: 'TronWalletNotSupportSwitchChainError',
    });
  }
}

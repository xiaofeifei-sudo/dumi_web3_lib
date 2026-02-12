import type { TronAction, TronErrorCode } from './index';
import { TronProviderError } from './index';

export class TronWalletNotSupportTestnetError extends TronProviderError {
  constructor(message = '当前钱包不支持测试链。') {
    super({
      message,
      code: 5018 as TronErrorCode,
      action: 'connect' as TronAction,
      name: 'TronWalletNotSupportTestnetError',
    });
  }
}

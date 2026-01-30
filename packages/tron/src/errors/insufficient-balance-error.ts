import type { TronAction, TronErrorCode } from './index';
import { TronProviderError } from './index';

export class TronInsufficientBalanceError extends TronProviderError {
  constructor(message = '余额不足，无法完成转账') {
    super({
      message,
      code: 5008 as TronErrorCode,
      action: 'transfer' as TronAction,
      name: 'TronInsufficientBalanceError',
    });
  }
}

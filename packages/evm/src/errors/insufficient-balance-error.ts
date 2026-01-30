import type { EvmAction, EvmErrorCode } from './index';
import { EvmProviderError } from './index';

export class EvmInsufficientBalanceError extends EvmProviderError {
  constructor(message = '余额不足，无法完成转账') {
    super({
      message,
      code: 5007 as EvmErrorCode,
      action: 'transfer' as EvmAction,
      name: 'EvmInsufficientBalanceError',
    });
  }
}

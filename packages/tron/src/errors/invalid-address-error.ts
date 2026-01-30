import type { TronAction, TronErrorCode } from './index';
import { TronProviderError } from './index';

export class TronInvalidAddressError extends TronProviderError {
  constructor(message = '收款地址不正确，请检查后重试') {
    super({
      message,
      code: 5014 as TronErrorCode,
      action: 'transfer' as TronAction,
      name: 'TronInvalidAddressError',
    });
  }
}


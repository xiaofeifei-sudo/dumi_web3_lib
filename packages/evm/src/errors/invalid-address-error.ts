import type { EvmAction, EvmErrorCode } from './index';
import { EvmProviderError } from './index';

export class EvmInvalidAddressError extends EvmProviderError {
  constructor(message = '收款地址不正确，请检查后重试') {
    super({
      message,
      code: 5014 as EvmErrorCode,
      action: 'transfer' as EvmAction,
      name: 'EvmInvalidAddressError',
    });
  }
}


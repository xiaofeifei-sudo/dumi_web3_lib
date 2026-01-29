export type Web3Action = 'connect' | 'switch_chain' | 'sign' | 'disconnect' | 'other';

export class ProviderError extends Error {
  code?: number | string;
  action?: Web3Action;
  cause?: unknown;
  walletName?: string;

  constructor(params: {
    message: string;
    code?: number | string;
    action?: Web3Action;
    cause?: unknown;
    name?: string;
    walletName?: string;
  }) {
    super(params.message);
    this.name = params.name ?? 'ProviderError';
    this.code = params.code;
    this.action = params.action;
    this.cause = params.cause;
    this.walletName = params.walletName;
  }
}

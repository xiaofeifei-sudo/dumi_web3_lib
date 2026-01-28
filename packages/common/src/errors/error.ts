import type { ChainType } from '../types';

export type Web3Action = 'connect' | 'switch_chain' | 'sign' | 'disconnect' | 'other';

export class ProviderError extends Error {
  code?: number | string;
  action?: Web3Action;
  cause?: unknown;

  constructor(params: {
    message: string;
    code?: number | string;
    action?: Web3Action;
    cause?: unknown;
    name?: string;
  }) {
    super(params.message);
    this.name = params.name ?? 'ProviderError';
    this.code = params.code;
    this.action = params.action;
    this.cause = params.cause;
  }
}

export function normalizeWeb3Error(
  error: any,
  context?: { action?: Web3Action; chainType?: ChainType; walletName?: string },
): ProviderError {
  if (error instanceof ProviderError) {
    return error;
  }

  const action = context?.action ?? 'other';

  let code: number | string | undefined = error?.code ?? error?.error?.code;
  const name: string | undefined = error?.name;
  let message: string =
    error?.shortMessage ??
    error?.message ??
    (typeof error === 'string' ? error : 'Unexpected error');

  const rawMsg = String(message || '').toLowerCase();
  const rawName = String(name || '').toLowerCase();
  const walletName = context?.walletName;

  const isWalletConnect =
    rawMsg.includes('walletconnect') || rawName.includes('walletconnect');

  if (!code) {
    if (rawName.includes('userrejectedrequest') || rawMsg.includes('user rejected')) {
      code = 4001;
    }
    if (rawMsg.includes('unsupported method')) {
      code = 4200;
    }
    if (rawMsg.includes('disconnected')) {
      code = 4900;
    }
  }

  if (typeof code === 'number') {
    switch (code) {
      case 4001:
        message = '用户拒绝请求';
        break;
      case 4100:
        message = '未授权访问';
        break;
      case 4200:
        message = '不支持的方法';
        break;
      case 4900:
        message = '钱包连接已断开';
        break;
      case 4901:
        message = '当前链未连接';
        break;
      case -32601:
        message = '方法不存在或未支持';
        break;
      case -32603:
        message = '钱包或节点内部错误';
        break;
      case -32000:
        message = '区块链服务错误';
        break;
      default:
        break;
    }
  }

  if (isWalletConnect) {
    if (rawMsg.includes('projectid')) {
      code = 'PROJECT_ID_INVALID';
      message = 'WalletConnect 项目配置无效';
    } else if (rawMsg.includes('modal closed')) {
      code = 'WC_MODAL_CLOSED';
      message = '已关闭二维码窗口';
    } else if (rawMsg.includes('timeout')) {
      code = 'WC_CONNECTION_TIMEOUT';
      message = '连接超时';
    }
  }

  if (walletName && typeof message === 'string') {
    message = `${walletName}: ${message}`;
  }

  return new ProviderError({
    message,
    code,
    action,
    cause: error,
  });
}

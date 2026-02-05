import type { WalletError } from '@tronweb3/tronwallet-abstract-adapter';
import {
  WalletNotFoundError,
  WalletNotSelectedError,
  WalletDisconnectedError,
  WalletConnectionError,
  WalletDisconnectionError,
  WalletWindowClosedError,
  WalletSwitchChainError,
  WalletSignMessageError,
  WalletSignTransactionError,
  WalletWalletLoadError,
  WalletGetNetworkError,
} from '@tronweb3/tronwallet-abstract-adapter';
import { ProviderError } from 'pelican-web3-lib-common';

/// 交易操作类型
export type TronAction = 'connect' | 'switch_chain' | 'sign' | 'disconnect' | 'transfer' | 'other';
export type TronErrorCode = number;


/**
 * 交易相关错误
 * code-message 映射列表：
 * 4900 - 钱包已断开连接
 * 5000 - 未检测到钱包
 * 5001 - 未选择钱包
 * 5002 - 钱包加载失败
 * 5004 - 用户关闭了二维码弹窗
 * 5005 - 切换网络失败
 * 5006 - 签名消息失败
 * 5007 - 签名交易失败
 * 5011 - 获取网络信息失败
 * 5015 - 连接/断开钱包失败
 * 5016 - 操作过于频繁
 * 5017 - 用户拒绝连接请求
 */
export class TronProviderError extends ProviderError {
  network?: string;
  constructor(params: {
    message: string;
    code?: TronErrorCode;
    action?: TronAction;
    cause?: unknown;
    walletName?: string;
    network?: string;
    name?: string;
  }) {
    super({
      message: params.message,
      code: params.code,
      action: params.action,
      cause: params.cause,
      name: params.name ?? 'TronProviderError',
      walletName: params.walletName,
    });
    this.network = params.network;
  }
}

type NormalizeContext = { action?: TronAction; walletName?: string; network?: string };

function ctxText(ctx?: NormalizeContext) {
  const parts: string[] = [];
  if (ctx?.action) parts.push(`操作：${ctx.action}`);
  if (ctx?.walletName) parts.push(`钱包：${ctx.walletName}`);
  if (ctx?.network) parts.push(`网络：${ctx.network}`);
  return parts.length ? `提示：${parts.join('，')}` : '';
}

/// 交易相关错误名称到提示消息的映射
const NAME_MESSAGE_MAP = new Map<string, (ctx?: NormalizeContext) => string>([
  ['WalletNotFoundError', (ctx) => ['未检测到钱包。请安装对应扩展或打开 App 后重试。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletNotSelectedError', (ctx) => ['未选择钱包。请先在界面中选择一个钱包。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletDisconnectedError', (ctx) => ['钱包已断开连接。请重新连接后再试。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletConnectionError', (ctx) => ['连接钱包失败。请检查钱包状态后重试。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletDisconnectionError', (ctx) => ['断开钱包失败。请稍后重试。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletWindowClosedError', (ctx) => ['用户关闭了二维码弹窗。请重新发起连接。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletSwitchChainError', (ctx) => ['切换网络失败或不被支持。请在钱包中切换到目标网络。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletSignMessageError', (ctx) => ['签名消息失败。请确认钱包状态与权限。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletSignTransactionError', (ctx) => ['签名交易失败。请确认交易内容与钱包状态。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletWalletLoadError', (ctx) => ['钱包加载失败。请重启或重新安装钱包后重试。', ctxText(ctx)].filter(Boolean).join('\n')],
  ['WalletGetNetworkError', (ctx) => ['获取网络信息失败。请检查钱包网络设置。', ctxText(ctx)].filter(Boolean).join('\n')],
]);


/// 交易相关错误名称到错误码的映射
const NAME_CODE_MAP = new Map<string, number>([
  ['WalletNotFoundError', 5000],
  ['WalletNotSelectedError', 5001],
  ['WalletDisconnectedError', 4900],
  ['WalletConnectionError', 5015],
  ['WalletDisconnectionError', 5015],
  ['WalletWindowClosedError', 5004],
  ['WalletSwitchChainError', 5005],
  ['WalletSignMessageError', 5006],
  ['WalletSignTransactionError', 5007],
  ['WalletWalletLoadError', 5002],
  ['WalletGetNetworkError', 5011],
]);


/// 根据错误类型获取提示消息
function messageByType(error: any, ctx?: NormalizeContext): string | undefined {
  if (error?.name === 'WalletConnectionError' && (error as any)?.error) {
    const innerError = (error as any).error;
    const innerCode = innerError?.code;
    const innerMessage = innerError?.message;
    if (innerCode === -32000) {
      return ['操作过于频繁，请稍后再试。', ctxText(ctx)].filter(Boolean).join('\n');
    }
    if (innerCode === 4001) {
      return ['您已拒绝本次连接请求。', ctxText(ctx)].filter(Boolean).join('\n');
    }
    if (typeof innerMessage === 'string') {
      return [innerMessage, ctxText(ctx)].filter(Boolean).join('\n');
    }
  }
  if (error instanceof WalletNotFoundError) return ['未检测到钱包。请安装对应扩展或打开 App 后重试。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletNotSelectedError) return ['未选择钱包。请先在界面中选择一个钱包。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletDisconnectedError) return ['钱包已断开连接。请重新连接后再试。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletConnectionError) return ['连接钱包失败。请检查钱包状态后重试。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletDisconnectionError) return ['断开钱包失败。请稍后重试。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletWindowClosedError) return ['用户关闭了二维码弹窗。请重新发起连接。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletSwitchChainError) return ['切换网络失败或不被支持。请在钱包中切换到目标网络。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletSignMessageError) return ['签名消息失败。请确认钱包状态与权限。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletSignTransactionError) return ['签名交易失败。请确认交易内容与钱包状态。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletWalletLoadError) return ['钱包加载失败。请重启或重新安装钱包后重试。', ctxText(ctx)].filter(Boolean).join('\n');
  if (error instanceof WalletGetNetworkError) return ['获取网络信息失败。请检查钱包网络设置。', ctxText(ctx)].filter(Boolean).join('\n');
  return undefined;
}


/// 根据错误类型获取错误码
function codeByType(error: any): number | undefined {
  if (error?.name === 'WalletConnectionError' && (error as any)?.error) {
    const innerError = (error as any).error;
    const innerCode = innerError?.code;
    if (innerCode === -32000) {
      return 5016;
    }
    if (innerCode === 4001) {
      return 5017;
    }
  }
  if (error instanceof WalletNotFoundError) return 5000;
  if (error instanceof WalletNotSelectedError) return 5001;
  if (error instanceof WalletDisconnectedError) return 4900;
  if (error instanceof WalletConnectionError) return 5015;
  if (error instanceof WalletDisconnectionError) return 5015;
  if (error instanceof WalletWindowClosedError) return 5004;
  if (error instanceof WalletSwitchChainError) return 5005;
  if (error instanceof WalletSignMessageError) return 5006;
  if (error instanceof WalletSignTransactionError) return 5007;
  if (error instanceof WalletWalletLoadError) return 5002;
  if (error instanceof WalletGetNetworkError) return 5011;
  return undefined;
}

/// 标准化 TRON 钱包错误
export function normalizeTronError(
  error: any,
  context?: { action?: TronAction; walletName?: string; network?: string },
): TronProviderError {
  if (error instanceof TronProviderError) {
    return error;
  }
  const action = context?.action ?? 'other';
  const walletName = context?.walletName;
  const network = context?.network;
  const ctx = { action, walletName, network };
  const message: string =
    messageByType(error, ctx) ??
    (typeof error?.name === 'string' ? NAME_MESSAGE_MAP.get(error.name)?.(ctx) : undefined) ??
    (error as WalletError)?.message ??
    (typeof error === 'string' ? error : 'Unexpected error');
  const code: TronErrorCode =
    codeByType(error) ??
    (typeof error?.name === 'string' ? NAME_CODE_MAP.get(error.name) : undefined) ??
    -1;
  return new TronProviderError({
    message,
    code,
    action,
    cause: error,
    walletName,
    network,
  });
}

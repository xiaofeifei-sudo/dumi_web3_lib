import type { Chain } from 'viem';
import { BaseError, RpcError } from 'viem';

export type EvmAction = 'connect' | 'switch_chain' | 'sign' | 'disconnect' | 'other';

/**
 * 错误码约定：
 * - EIP-1193：
 *   4001 用户拒绝请求
 *   4100 未授权访问
 *   4200 不支持的方法
 *   4900 钱包连接已断开
 *   4901 当前链未连接
 * - JSON-RPC：
 *   -32601 方法不存在或未支持
 *   -32603 内部错误
 *   -32000 区块链服务错误
 * - 自定义（5000+）：
 *   5000 Provider 未找到
 *   5001 Connector 未找到
 *   5002 链 ID 不匹配
 *   5003 链未配置
 *   5004 Connector 已连接
 *   5005 切链失败
 *   5006 合约执行失败
 *   5007 余额不足
 *   5008 Gas 费用过低
 *   5009 Gas 费用过高
 *   5010 Nonce 过低
 *   5011 RPC 错误
 *   5012 Connector 处于重连不可用
 *   5014 参数无效
 *   5015 未知错误
 */
export type EvmErrorCode = number;

export class EvmProviderError extends Error {
  code: EvmErrorCode;
  action?: EvmAction;
  cause?: unknown;
  walletName?: string;
  chainId?: Chain['id'];
  constructor(params: {
    message: string;
    code: EvmErrorCode;
    action?: EvmAction;
    cause?: unknown;
    walletName?: string;
    chainId?: Chain['id'];
    name?: string;
  }) {
    super(params.message);
    this.name = params.name ?? 'EvmProviderError';
    this.code = params.code;
    this.action = params.action;
    this.cause = params.cause;
    this.walletName = params.walletName;
    this.chainId = params.chainId;
  }
}


type NormalizeContext = { action?: EvmAction; walletName?: string; chainId?: number };

function ctxText(ctx?: NormalizeContext) {
  const parts: string[] = [];
  if (ctx?.action) parts.push(`操作：${ctx.action}`);
  if (ctx?.walletName) parts.push(`钱包：${ctx.walletName}`);
  if (typeof ctx?.chainId === 'number') parts.push(`链：${ctx.chainId}`);
  return parts.length ? `提示：${parts.join('，')}` : '';
}

const CODE_MESSAGE_MAP = new Map<number, (ctx?: NormalizeContext) => string>([
  [4001, (ctx) => ['用户拒绝了当前请求。请在钱包界面确认后重试。', '如为签名或发送交易，请检查提示内容并确保授权。', ctxText(ctx)].filter(Boolean).join('\n')],
  [4100, (ctx) => ['请求的方法或账户未授权。请在钱包中授权访问或切换到已授权账户。', '如使用多账户，确认当前账户已授权该方法。', ctxText(ctx)].filter(Boolean).join('\n')],
  [4200, (ctx) => ['Provider 不支持该方法。', '请确认目标钱包/节点支持该方法，或使用兼容的替代方案。', ctxText(ctx)].filter(Boolean).join('\n')],
  [4900, (ctx) => ['钱包已与所有链断开连接。', '请重新连接钱包后再重试。', ctxText(ctx)].filter(Boolean).join('\n')],
  [4901, (ctx) => ['钱包未连接到请求的链。', '请在钱包中切换到目标链或添加该链。', ctxText(ctx)].filter(Boolean).join('\n')],
  [4902, (ctx) => ['尝试切换链时发生错误。', '请确认钱包支持该链并且链参数正确，稍后重试。', ctxText(ctx)].filter(Boolean).join('\n')],
  [5700, (ctx) => ['钱包不支持一个未标记为可选的能力。', '请移除该能力或使用支持该能力的钱包。', ctxText(ctx)].filter(Boolean).join('\n')],
  [5710, (ctx) => ['钱包不支持请求的链 ID。', '请更换到受支持的链或使用支持该链的钱包。', ctxText(ctx)].filter(Boolean).join('\n')],
  [5720, (ctx) => ['存在重复的 Bundle ID。', '请更换唯一的 ID 后重新提交。', ctxText(ctx)].filter(Boolean).join('\n')],
  [5730, (ctx) => ['未知的 Bundle ID。', '请检查 ID 是否正确或确认已提交该 Bundle。', ctxText(ctx)].filter(Boolean).join('\n')],
  [5740, (ctx) => ['调用 Bundle 过大，钱包无法处理。', '请减小请求规模或拆分为多个请求。', ctxText(ctx)].filter(Boolean).join('\n')],
  [5750, (ctx) => ['钱包可在升级后支持原子执行，但用户拒绝了升级。', '如需原子执行，请允许升级或使用其他钱包。', ctxText(ctx)].filter(Boolean).join('\n')],
  [5760, (ctx) => ['钱包不支持原子执行，但请求要求原子性。', '请取消原子性要求或使用支持原子执行的钱包。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-1, (ctx) => ['发生未知的 RPC 错误。', '请查看原始错误信息并稍后重试，或更换 RPC 节点。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32700, (ctx) => ['收到的 JSON 无效，服务器解析 JSON 文本时发生错误。', '请检查请求负载格式是否为有效 JSON。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32600, (ctx) => ['请求对象无效。', '请确保请求结构、字段类型与 JSON-RPC 规范一致。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32601, (ctx) => ['方法不存在或不可用。', '请确认方法名正确，并且当前钱包/节点支持该方法。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32602, (ctx) => ['提供给 RPC 方法的参数无效。', '请核对参数类型、顺序与数量是否正确。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32603, (ctx) => ['接收到内部错误。', '可能由钱包或节点问题引起，稍后重试或切换 RPC 节点。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32000, (ctx) => ['缺失或无效的参数。', '请补全缺失参数并确保取值合法。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32001, (ctx) => ['请求的资源未找到。', '请检查目标资源标识是否正确，或等待资源可用。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32002, (ctx) => ['请求的资源不可用。', '请稍后重试或更换到可用的资源。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32003, (ctx) => ['交易创建失败。', '可能因余额不足、nonce 冲突或 gas 设置不当，请检查账户余额、nonce 与 gas。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32004, (ctx) => ['方法不支持。', '请使用受支持的方法或升级到兼容的 Provider/节点。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32005, (ctx) => ['请求超出限制。', '请降低请求频率、分页或缩小返回数据规模。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32006, (ctx) => ['不支持的 JSON-RPC 版本。', '请使用兼容版本的客户端与节点。', ctxText(ctx)].filter(Boolean).join('\n')],
  [-32042, (ctx) => ['方法不存在或不可用。', '请确认方法名正确，或使用兼容的替代方法。', ctxText(ctx)].filter(Boolean).join('\n')],
]);

export function normalizeEvmError(
  error: any,
  context?: { action?: EvmAction; walletName?: string; chainId?: number },
): EvmProviderError {
  if (error instanceof EvmProviderError) {
    return error;
  }
  const action = context?.action ?? 'other';
  const walletName = context?.walletName;
  const chainId = context?.chainId;
  const ctx = { action, walletName, chainId };
  let message: string =
    error?.shortMessage ??
    error?.message ??
    (typeof error === 'string' ? error : 'Unexpected error');
  if (error instanceof RpcError) {
    const generator = CODE_MESSAGE_MAP.get(error.code);
    if (generator) {
      message = generator(ctx);
    }
  } else if (typeof error?.code === 'number') {
    const generator = CODE_MESSAGE_MAP.get(error.code);
    if (generator) {
      message = generator(ctx);
    }
  } else if (error instanceof BaseError) {
    message = [error.message, ctxText(ctx)].filter(Boolean).join('\n');
  }
  return new EvmProviderError({
    message,
    code: typeof error?.code === 'number' ? error.code : -1,
    action,
    cause: error,
    walletName,
    chainId,
  });
}

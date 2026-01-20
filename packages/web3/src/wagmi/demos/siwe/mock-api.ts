export async function getNonce(address: string, chainId?: number): Promise<string> {
  return Promise.resolve(`nonce-for-${address}-${chainId ?? 'unknown'}`);
}

import type { CreateSiweMessageParameters } from 'viem/siwe';
import { createSiweMessage } from 'viem/siwe';

export function createMessage(args: CreateSiweMessageParameters): string {
  return createSiweMessage(args);
}

export async function verifyMessage(message: string, signature: string): Promise<boolean> {
  return Promise.resolve(!!message && !!signature);
}

// JSON parsing utilities for version latest
import type { CallResult } from '@near-js/jsonrpc-types';
import { query } from './generated-types';
import type { NearRpcClient } from '../client';

export function parseCallResultToJson<T = unknown>(callResult: CallResult): T {
  const bytes = new Uint8Array(callResult.result);
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text) as T;
}

export async function viewFunctionAsJson<T = unknown>(
  client: NearRpcClient,
  params: {
    accountId: string;
    methodName: string;
    argsBase64?: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
): Promise<T> {
  // Use query function directly
  const baseParams = {
    requestType: 'call_function' as const,
    accountId: params.accountId,
    methodName: params.methodName,
    argsBase64: params.argsBase64 ?? '',
  };

  const queryParams = params.blockId
    ? { ...baseParams, blockId: params.blockId }
    : { ...baseParams, finality: params.finality || ('final' as const) };

  const result = (await query(client, queryParams)) as CallResult;
  return parseCallResultToJson<T>(result);
}

// viewFunction convenience function for tree-shaking
import type { NearRpcClient } from '../client.mini.js';
import { query } from './query.js';

export async function viewFunction(
  client: NearRpcClient,
  params: {
    accountId: string;
    methodName: string;
    argsBase64?: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
) {
  // Construct query parameters: use blockId if provided, otherwise use finality (default 'final')
  const baseParams = {
    requestType: 'call_function' as const,
    accountId: params.accountId,
    methodName: params.methodName,
    argsBase64: params.argsBase64 ?? '', // Default to empty string if no arguments
  };

  const queryParams = params.blockId
    ? { ...baseParams, blockId: params.blockId }
    : { ...baseParams, finality: params.finality || ('final' as const) };

  return query(client, queryParams);
}

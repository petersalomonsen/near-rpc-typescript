// viewAccessKey convenience function for tree-shaking
import type { NearRpcClient } from '../client.mini.js';
import { query } from './query.js';

export async function viewAccessKey(
  client: NearRpcClient,
  params: {
    accountId: string;
    publicKey: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
) {
  // Construct query parameters: use blockId if provided, otherwise use finality (default 'final')
  const queryParams = params.blockId 
    ? {
        requestType: 'view_access_key' as const,
        accountId: params.accountId,
        publicKey: params.publicKey,
        blockId: params.blockId,
      }
    : {
        requestType: 'view_access_key' as const,
        accountId: params.accountId,
        publicKey: params.publicKey,
        finality: params.finality || 'final' as const,
      };
  
  return query(client, queryParams);
}
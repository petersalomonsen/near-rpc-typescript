// viewAccount convenience function for tree-shaking
import type { NearRpcClient } from '../client.mini.js';
import { query } from './query.js';

export async function viewAccount(
  client: NearRpcClient,
  params: {
    accountId: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
) {
  // Construct query parameters: use blockId if provided, otherwise use finality (default 'final')
  const queryParams = params.blockId 
    ? {
        requestType: 'view_account' as const,
        accountId: params.accountId,
        blockId: params.blockId,
      }
    : {
        requestType: 'view_account' as const,
        accountId: params.accountId,
        finality: params.finality || 'final' as const,
      };
  
  return query(client, queryParams);
}
// Convenience functions for the client
import type { NearRpcClient } from './client.js';
import { query } from './generated-types.js';
import type {
  AccountView,
  CallResult,
  AccessKeyView,
} from '@near-js/jsonrpc-types/mini';

export async function viewAccount(
  client: NearRpcClient,
  params: {
    accountId: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
): Promise<AccountView> {
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
        finality: params.finality || ('final' as const),
      };

  return query(client, queryParams) as Promise<AccountView>;
}

export async function viewFunction(
  client: NearRpcClient,
  params: {
    accountId: string;
    methodName: string;
    argsBase64?: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
): Promise<CallResult> {
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

  return query(client, queryParams) as Promise<CallResult>;
}

export async function viewAccessKey(
  client: NearRpcClient,
  params: {
    accountId: string;
    publicKey: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
): Promise<AccessKeyView> {
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
        finality: params.finality || ('final' as const),
      };

  return query(client, queryParams) as Promise<AccessKeyView>;
}

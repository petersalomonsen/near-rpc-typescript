// tx individual function for tree-shaking
import type { RpcTransactionStatusRequest, RpcTransactionResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function tx(
  client: NearRpcClient,
  params?: RpcTransactionStatusRequest
): Promise<RpcTransactionResponse> {
  return client.makeRequest('tx', params);
}

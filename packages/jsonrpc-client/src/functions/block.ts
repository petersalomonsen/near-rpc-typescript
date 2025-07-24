// block individual function for tree-shaking
import type { RpcBlockRequest, RpcBlockResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function block(
  client: NearRpcClient,
  params?: RpcBlockRequest
): Promise<RpcBlockResponse> {
  return client.makeRequest('block', params);
}

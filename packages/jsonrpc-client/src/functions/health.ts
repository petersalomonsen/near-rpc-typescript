// health individual function for tree-shaking
import type { RpcHealthRequest, RpcHealthResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function health(
  client: NearRpcClient,
  params?: RpcHealthRequest
): Promise<RpcHealthResponse> {
  return client.makeRequest('health', params);
}

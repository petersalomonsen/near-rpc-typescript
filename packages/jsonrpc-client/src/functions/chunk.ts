// chunk individual function for tree-shaking
import type { RpcChunkRequest, RpcChunkResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function chunk(
  client: NearRpcClient,
  params?: RpcChunkRequest
): Promise<RpcChunkResponse> {
  return client.makeRequest('chunk', params);
}

// query individual function for tree-shaking
import type { RpcQueryRequest, RpcQueryResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function query(
  client: NearRpcClient,
  params?: RpcQueryRequest
): Promise<RpcQueryResponse> {
  return client.makeRequest('query', params);
}

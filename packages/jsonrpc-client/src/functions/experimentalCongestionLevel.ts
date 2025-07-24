// EXPERIMENTAL_congestion_level individual function for tree-shaking
import type { RpcCongestionLevelRequest, RpcCongestionLevelResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalCongestionLevel(
  client: NearRpcClient,
  params?: RpcCongestionLevelRequest
): Promise<RpcCongestionLevelResponse> {
  return client.makeRequest('EXPERIMENTAL_congestion_level', params);
}

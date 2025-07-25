// network_info individual function for tree-shaking
import type {
  RpcNetworkInfoRequest,
  RpcNetworkInfoResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function networkInfo(
  client: NearRpcClient,
  params?: RpcNetworkInfoRequest
): Promise<RpcNetworkInfoResponse> {
  return client.makeRequest('network_info', params);
}

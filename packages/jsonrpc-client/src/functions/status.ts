// status individual function for tree-shaking
import type {
  RpcStatusRequest,
  RpcStatusResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function status(
  client: NearRpcClient,
  params?: RpcStatusRequest
): Promise<RpcStatusResponse> {
  return client.makeRequest('status', params);
}

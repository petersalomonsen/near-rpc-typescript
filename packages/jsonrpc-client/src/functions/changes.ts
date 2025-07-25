// changes individual function for tree-shaking
import type {
  RpcStateChangesInBlockByTypeRequest,
  RpcStateChangesInBlockResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function changes(
  client: NearRpcClient,
  params?: RpcStateChangesInBlockByTypeRequest
): Promise<RpcStateChangesInBlockResponse> {
  return client.makeRequest('changes', params);
}

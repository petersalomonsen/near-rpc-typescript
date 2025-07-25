// EXPERIMENTAL_changes_in_block individual function for tree-shaking
import type {
  RpcStateChangesInBlockRequest,
  RpcStateChangesInBlockByTypeResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalChangesInBlock(
  client: NearRpcClient,
  params?: RpcStateChangesInBlockRequest
): Promise<RpcStateChangesInBlockByTypeResponse> {
  return client.makeRequest('EXPERIMENTAL_changes_in_block', params);
}

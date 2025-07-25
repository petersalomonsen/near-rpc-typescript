// next_light_client_block individual function for tree-shaking
import type {
  RpcLightClientNextBlockRequest,
  RpcLightClientNextBlockResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function nextLightClientBlock(
  client: NearRpcClient,
  params?: RpcLightClientNextBlockRequest
): Promise<RpcLightClientNextBlockResponse> {
  return client.makeRequest('next_light_client_block', params);
}

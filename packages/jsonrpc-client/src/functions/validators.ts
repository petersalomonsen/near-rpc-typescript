// validators individual function for tree-shaking
import type { RpcValidatorRequest, RpcValidatorResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function validators(
  client: NearRpcClient,
  params?: RpcValidatorRequest
): Promise<RpcValidatorResponse> {
  return client.makeRequest('validators', params);
}

// light_client_proof individual function for tree-shaking
import type { RpcLightClientExecutionProofRequest, RpcLightClientExecutionProofResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function lightClientProof(
  client: NearRpcClient,
  params?: RpcLightClientExecutionProofRequest
): Promise<RpcLightClientExecutionProofResponse> {
  return client.makeRequest('light_client_proof', params);
}

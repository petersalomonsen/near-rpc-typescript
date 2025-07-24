// EXPERIMENTAL_light_client_block_proof individual function for tree-shaking
import type { RpcLightClientBlockProofRequest, RpcLightClientBlockProofResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalLightClientBlockProof(
  client: NearRpcClient,
  params?: RpcLightClientBlockProofRequest
): Promise<RpcLightClientBlockProofResponse> {
  return client.makeRequest('EXPERIMENTAL_light_client_block_proof', params);
}

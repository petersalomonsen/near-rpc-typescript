// EXPERIMENTAL_validators_ordered individual function for tree-shaking
import type {
  RpcValidatorsOrderedRequest,
  EXPERIMENTALValidatorsOrderedResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalValidatorsOrdered(
  client: NearRpcClient,
  params?: RpcValidatorsOrderedRequest
): Promise<EXPERIMENTALValidatorsOrderedResponse> {
  return client.makeRequest('EXPERIMENTAL_validators_ordered', params);
}

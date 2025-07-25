// client_config individual function for tree-shaking
import type {
  RpcClientConfigRequest,
  RpcClientConfigResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function clientConfig(
  client: NearRpcClient,
  params?: RpcClientConfigRequest
): Promise<RpcClientConfigResponse> {
  return client.makeRequest('client_config', params);
}

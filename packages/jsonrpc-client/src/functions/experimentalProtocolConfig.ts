// EXPERIMENTAL_protocol_config individual function for tree-shaking
import type {
  RpcProtocolConfigRequest,
  RpcProtocolConfigResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalProtocolConfig(
  client: NearRpcClient,
  params?: RpcProtocolConfigRequest
): Promise<RpcProtocolConfigResponse> {
  return client.makeRequest('EXPERIMENTAL_protocol_config', params);
}

// gas_price individual function for tree-shaking
import type {
  RpcGasPriceRequest,
  RpcGasPriceResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function gasPrice(
  client: NearRpcClient,
  params?: RpcGasPriceRequest
): Promise<RpcGasPriceResponse> {
  return client.makeRequest('gas_price', params);
}

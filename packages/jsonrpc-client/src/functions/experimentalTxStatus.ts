// EXPERIMENTAL_tx_status individual function for tree-shaking
import type {
  RpcTransactionStatusRequest,
  RpcTransactionResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalTxStatus(
  client: NearRpcClient,
  params?: RpcTransactionStatusRequest
): Promise<RpcTransactionResponse> {
  return client.makeRequest('EXPERIMENTAL_tx_status', params);
}

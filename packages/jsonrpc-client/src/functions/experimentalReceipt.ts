// EXPERIMENTAL_receipt individual function for tree-shaking
import type { RpcReceiptRequest, RpcReceiptResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalReceipt(
  client: NearRpcClient,
  params?: RpcReceiptRequest
): Promise<RpcReceiptResponse> {
  return client.makeRequest('EXPERIMENTAL_receipt', params);
}

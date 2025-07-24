// send_tx individual function for tree-shaking
import type { RpcSendTransactionRequest, RpcTransactionResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function sendTx(
  client: NearRpcClient,
  params?: RpcSendTransactionRequest
): Promise<RpcTransactionResponse> {
  return client.makeRequest('send_tx', params);
}

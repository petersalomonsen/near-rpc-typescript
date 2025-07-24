// broadcast_tx_commit individual function for tree-shaking
import type { RpcSendTransactionRequest, RpcTransactionResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function broadcastTxCommit(
  client: NearRpcClient,
  params?: RpcSendTransactionRequest
): Promise<RpcTransactionResponse> {
  return client.makeRequest('broadcast_tx_commit', params);
}

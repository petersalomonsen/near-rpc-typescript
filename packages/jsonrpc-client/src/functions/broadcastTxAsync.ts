// broadcast_tx_async individual function for tree-shaking
import type {
  RpcSendTransactionRequest,
  CryptoHash,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function broadcastTxAsync(
  client: NearRpcClient,
  params?: RpcSendTransactionRequest
): Promise<CryptoHash> {
  return client.makeRequest('broadcast_tx_async', params);
}

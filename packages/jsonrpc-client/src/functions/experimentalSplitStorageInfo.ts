// EXPERIMENTAL_split_storage_info individual function for tree-shaking
import type { RpcSplitStorageInfoRequest, RpcSplitStorageInfoResponse } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalSplitStorageInfo(
  client: NearRpcClient,
  params?: RpcSplitStorageInfoRequest
): Promise<RpcSplitStorageInfoResponse> {
  return client.makeRequest('EXPERIMENTAL_split_storage_info', params);
}

// EXPERIMENTAL_maintenance_windows individual function for tree-shaking
import type {
  RpcMaintenanceWindowsRequest,
  EXPERIMENTALMaintenanceWindowsResponse,
} from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalMaintenanceWindows(
  client: NearRpcClient,
  params?: RpcMaintenanceWindowsRequest
): Promise<EXPERIMENTALMaintenanceWindowsResponse> {
  return client.makeRequest('EXPERIMENTAL_maintenance_windows', params);
}

// EXPERIMENTAL_genesis_config individual function for tree-shaking
import type { GenesisConfigRequest, GenesisConfig } from '@near-js/jsonrpc-types/mini';
import type { NearRpcClient } from '../client.mini.js';

export async function experimentalGenesisConfig(
  client: NearRpcClient,
  params?: GenesisConfigRequest
): Promise<GenesisConfig> {
  return client.makeRequest('EXPERIMENTAL_genesis_config', params);
}

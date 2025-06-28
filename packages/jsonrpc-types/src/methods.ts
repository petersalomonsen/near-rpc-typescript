// Auto-generated method mapping from NEAR OpenAPI spec
// Generated on: 2025-06-28T04:37:45.374Z
// Do not edit manually - run 'pnpm generate' to regenerate

// Maps OpenAPI paths to actual JSON-RPC method names
export const PATH_TO_METHOD_MAP = {
  "/block": "block",
  "/chunk": "chunk",
  "/gas_price": "gas_price",
  "/status": "status",
  "/health": "health",
  "/network_info": "network_info",
  "/validators": "validators",
  "/client_config": "client_config",
  "/broadcast_tx_async": "broadcast_tx_async",
  "/broadcast_tx_commit": "broadcast_tx_commit",
  "/send_tx": "send_tx",
  "/tx": "tx",
  "/query": "query",
  "/light_client_proof": "light_client_proof",
  "/EXPERIMENTAL_changes": "EXPERIMENTAL_changes",
  "/EXPERIMENTAL_changes_in_block": "EXPERIMENTAL_changes_in_block",
  "/EXPERIMENTAL_validators_ordered": "EXPERIMENTAL_validators_ordered",
  "/EXPERIMENTAL_protocol_config": "EXPERIMENTAL_protocol_config",
  "/EXPERIMENTAL_genesis_config": "EXPERIMENTAL_genesis_config",
  "/EXPERIMENTAL_light_client_proof": "EXPERIMENTAL_light_client_proof",
  "/EXPERIMENTAL_light_client_block_proof": "EXPERIMENTAL_light_client_block_proof",
  "/EXPERIMENTAL_receipt": "EXPERIMENTAL_receipt",
  "/EXPERIMENTAL_tx_status": "EXPERIMENTAL_tx_status",
  "/EXPERIMENTAL_split_storage_info": "EXPERIMENTAL_split_storage_info",
  "/EXPERIMENTAL_congestion_level": "EXPERIMENTAL_congestion_level",
  "/EXPERIMENTAL_maintenance_windows": "EXPERIMENTAL_maintenance_windows"
};

// Reverse mapping for convenience
export const METHOD_TO_PATH_MAP: Record<string, string> = {};
Object.entries(PATH_TO_METHOD_MAP).forEach(([path, method]) => {
  METHOD_TO_PATH_MAP[method] = path;
});

// Available RPC methods
export const RPC_METHODS = Object.values(PATH_TO_METHOD_MAP);
export type RpcMethod = typeof RPC_METHODS[number];

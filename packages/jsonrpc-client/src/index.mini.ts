// @near-js/jsonrpc-client (zod/mini version)
// TypeScript client for NEAR Protocol JSON-RPC API

export * from './client.mini';
export * from './types';
export * from './generated-types.mini';

// Re-export commonly used types from the types package (mini version)
export {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
} from '@near-js/jsonrpc-types/mini';

// Re-export RPC methods
export { RPC_METHODS } from '@near-js/jsonrpc-types/mini';

// Default export for convenience
export { NearRpcClient as default } from './client.mini';
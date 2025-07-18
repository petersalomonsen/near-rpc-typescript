// @near-js/jsonrpc-client
// TypeScript client for NEAR Protocol JSON-RPC API

export * from './client';
export * from './types';

// Re-export commonly used types from the types package
export type {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
  JsonRpcErrorSchema,
} from '@near-js/jsonrpc-types';

// Re-export RPC methods
export { RPC_METHODS } from '@near-js/jsonrpc-types';

// Default export for convenience
export { NearRpcClient as default } from './client';

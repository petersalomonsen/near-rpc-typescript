// @near-js/jsonrpc-client
// TypeScript client for NEAR Protocol JSON-RPC API

export * from './client';
export * from './types';

// Export the client class and default client instance
export { NearRpcClient, defaultClient } from './client';

// Export interfaces from generated types (but not the functions to avoid conflicts)
export type {
  DynamicRpcMethods,
  ConvenienceMethods,
  CompleteClientInterface,
} from './generated-types';

// Re-export commonly used types from the types package
export {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
} from '@near-js/jsonrpc-types/mini';

// Re-export RPC methods
export { RPC_METHODS } from '@near-js/jsonrpc-types/mini';

// Export individual tree-shakable functions
export * from './generated-functions';

// Export optional validation (only gets included if imported)
export { enableValidation } from './validation.js';

// Default export for convenience
export { NearRpcClient as default } from './client';

// @near-js/jsonrpc-client (zod/mini version)
// TypeScript client for NEAR Protocol JSON-RPC API

export * from './client.mini';
export * from './types';

// Export the client class and default client instance
export { NearRpcClient, defaultClient } from './client.mini';

// Export interfaces from generated types (but not the functions to avoid conflicts)
export type { 
  DynamicRpcMethods, 
  ConvenienceMethods, 
  CompleteClientInterface 
} from './generated-types';

// Re-export commonly used types from the types package (mini version)
export {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
} from '@near-js/jsonrpc-types/mini';

// Re-export RPC methods
export { RPC_METHODS } from '@near-js/jsonrpc-types/mini';

// Export individual tree-shakable functions
export * from './functions';

// Export optional validation (only gets included if imported)
export { enableValidation } from './validation.mini.js';

// Default export for convenience
export { NearRpcClient as default } from './client.mini';

// No-validation exports for optimal tree-shaking
// These exports bypass validation entirely for the smallest possible bundle size
//
// Usage:
//   import { block, viewAccount } from '@near-js/jsonrpc-client/no-validation';
//
// IMPORTANT: No validation means no runtime type checking - use with caution!

// Re-export client
export { NearRpcClient, defaultClient } from '../client.js';

// Re-export types
export {
  NearRpcError,
  type RpcRequest,
  type RpcResponse,
  type RpcError,
} from '../types.js';

// Re-export all UNVALIDATED functions for optimal tree-shaking
export * from '../generated-functions.js';

// Re-export convenience functions
export * from '../convenience.js';

// Re-export interface types
export type {
  DynamicRpcMethods,
  ConvenienceMethods,
  CompleteClientInterface,
} from '../generated-types.js';

// Re-export RPC method names
export { RPC_METHODS } from '@near-js/jsonrpc-types';

// Re-export JSON-RPC schemas for type definitions only
export {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
} from '@near-js/jsonrpc-types';

// Provide a no-op enableValidation for API compatibility
// This ensures code using enableValidation won't break, but validation is never actually enabled
export function enableValidation(): void {
  // Intentionally empty - validation is disabled in no-validation exports
}

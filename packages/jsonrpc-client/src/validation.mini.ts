// Optional validation for mini client - only imported when explicitly enabled
import {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
} from '@near-js/jsonrpc-types/mini';
import {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcClientError,
  JsonRpcNetworkError,
} from './client.mini.js';

export interface ValidationResult {
  validateRequest: (request: JsonRpcRequest) => void;
  validateResponse: (response: JsonRpcResponse) => void;
}

/**
 * Enable validation for the mini client
 * This function should only be called if you want to include schema validation
 * Calling this function will include Zod schemas in your bundle
 */
export function enableValidation(): ValidationResult {
  const requestSchema = JsonRpcRequestSchema();
  const responseSchema = JsonRpcResponseSchema();

  return {
    validateRequest: (request: JsonRpcRequest) => {
      try {
        requestSchema.parse(request);
      } catch (error) {
        throw new JsonRpcNetworkError(
          `Invalid request format: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error as Error
        );
      }
    },

    validateResponse: (response: JsonRpcResponse) => {
      try {
        responseSchema.parse(response);
      } catch (error) {
        throw new JsonRpcClientError(
          `Invalid response format: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
  };
}

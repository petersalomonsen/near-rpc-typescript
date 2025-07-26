// Optional validation for client - only imported when explicitly enabled
import {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
  VALIDATION_SCHEMA_MAP,
} from '@near-js/jsonrpc-types';
import {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcClientError,
  JsonRpcNetworkError,
} from './client.js';

export interface ValidationResult {
  validateRequest: (request: JsonRpcRequest) => void;
  validateResponse: (response: JsonRpcResponse) => void;
  validateMethodRequest?: (method: string, request: JsonRpcRequest) => void;
  validateMethodResponse?: (method: string, response: JsonRpcResponse) => void;
}

/**
 * Enable validation for the client
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

    validateMethodRequest: (method: string, request: JsonRpcRequest) => {
      try {
        // First validate basic JSON-RPC structure
        requestSchema.parse(request);

        // Then validate method-specific structure if schema exists
        const methodSchemas = VALIDATION_SCHEMA_MAP[method];
        if (methodSchemas?.requestSchema) {
          const methodRequestSchema = methodSchemas.requestSchema();
          methodRequestSchema.parse(request);
        }
      } catch (error) {
        throw new JsonRpcNetworkError(
          `Invalid ${method} request: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error as Error
        );
      }
    },

    validateMethodResponse: (method: string, response: JsonRpcResponse) => {
      try {
        // First validate basic JSON-RPC structure
        responseSchema.parse(response);

        // Then validate method-specific response structure if schema exists
        const methodSchemas = VALIDATION_SCHEMA_MAP[method];
        if (methodSchemas?.responseSchema) {
          const methodResponseSchema = methodSchemas.responseSchema();
          methodResponseSchema.parse(response);
        }
      } catch (error) {
        throw new JsonRpcClientError(
          `Invalid ${method} response: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
  };
}

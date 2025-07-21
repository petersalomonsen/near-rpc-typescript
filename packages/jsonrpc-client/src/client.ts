// Core JSON-RPC client implementation
import {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
  RPC_METHODS,
} from '@near-js/jsonrpc-types';

// Define RpcMethod type locally since it's not exported from index
type RpcMethod = (typeof RPC_METHODS)[number];

// Types for client configuration
export interface ClientConfig {
  endpoint: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  validateResponses?: boolean;
}

// JSON-RPC request structure
export interface JsonRpcRequest<T = unknown> {
  jsonrpc: '2.0';
  id: string;
  method: string;
  params?: T;
}

// JSON-RPC response structure
export interface JsonRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: string;
  result?: T;
  error?: JsonRpcError;
}

// JSON-RPC error structure
export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

// Custom error classes
export class JsonRpcClientError extends Error {
  constructor(
    message: string,
    public code?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'JsonRpcClientError';
  }
}

export class JsonRpcNetworkError extends Error {
  constructor(
    message: string,
    public originalError: Error
  ) {
    super(message);
    this.name = 'JsonRpcNetworkError';
  }
}

// Case conversion utilities
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertKeysToSnakeCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  }

  const converted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    converted[snakeKey] = convertKeysToSnakeCase(value);
  }
  return converted;
}

function convertKeysToCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }

  const converted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    converted[camelKey] = convertKeysToCamelCase(value);
  }
  return converted;
}

// Main RPC client class
export class NearRpcClient {
  private endpoint: string;
  private headers: Record<string, string>;
  private timeout: number;
  private retries: number;
  private validateResponses: boolean;
  private requestIdCounter = 0;

  constructor(config: string | ClientConfig) {
    if (typeof config === 'string') {
      this.endpoint = config;
      this.headers = {
        'Content-Type': 'application/json',
      };
      this.timeout = 30000;
      this.retries = 3;
      this.validateResponses = true;
    } else {
      this.endpoint = config.endpoint;
      this.headers = {
        'Content-Type': 'application/json',
        ...config.headers,
      };
      this.timeout = config.timeout || 30000;
      this.retries = config.retries || 3;
      this.validateResponses = config.validateResponses ?? true;
    }
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `near-rpc-${Date.now()}-${++this.requestIdCounter}`;
  }

  /**
   * Make a raw JSON-RPC call
   * This method is public to allow dynamic calls to any RPC method
   */
  async call<TParams = unknown, TResult = unknown>(
    method: RpcMethod,
    params?: TParams
  ): Promise<TResult> {
    const requestId = this.generateRequestId();

    // Convert camelCase params to snake_case for the RPC call
    const snakeCaseParams = params ? convertKeysToSnakeCase(params) : undefined;

    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: requestId,
      method,
      params: snakeCaseParams,
    };

    // Validate request if enabled
    if (this.validateResponses) {
      try {
        JsonRpcRequestSchema.parse(request);
      } catch (error) {
        throw new JsonRpcNetworkError(
          `Invalid request format: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error as Error
        );
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const jsonResponse = await response.json();

        // Validate response if enabled
        if (this.validateResponses) {
          try {
            JsonRpcResponseSchema.parse(jsonResponse);
          } catch (error) {
            // This indicates a malformed response, which is a client-level concern
            throw new JsonRpcClientError(
              `Invalid response format: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }

        const rpcResponse = jsonResponse as JsonRpcResponse<TResult>;

        // Check for JSON-RPC errors, which can be present even on non-200 responses
        if (rpcResponse.error) {
          throw new JsonRpcClientError(
            rpcResponse.error.message,
            rpcResponse.error.code,
            rpcResponse.error.data
          );
        }

        // If response is not OK and there was no RPC error, treat as a network error
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Convert snake_case response back to camelCase
        const camelCaseResult = rpcResponse.result
          ? convertKeysToCamelCase(rpcResponse.result)
          : rpcResponse.result;

        return camelCaseResult as TResult;
      } catch (error) {
        lastError = error as Error;

        // Don't retry for JSON-RPC errors or client errors
        if (error instanceof JsonRpcClientError) {
          throw error;
        }

        // Only retry on network errors if we have attempts left
        if (attempt < this.retries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    throw new JsonRpcNetworkError(
      `Failed to make RPC call after ${this.retries + 1} attempts: ${lastError?.message}`,
      lastError!
    );
  }

}

// Dynamic method generation using prototype extension
RPC_METHODS.forEach((method) => {
  let methodName = method;
  
  // Convert method name to camelCase
  if (methodName.startsWith('EXPERIMENTAL_')) {
    // Handle experimental methods: EXPERIMENTAL_changes -> experimentalChanges
    methodName = 'experimental' + methodName
      .substring(13) // Remove 'EXPERIMENTAL_'
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      .replace(/^([a-z])/, (_, letter) => letter.toUpperCase()); // Capitalize first letter after 'experimental'
  } else {
    // Handle regular methods: gas_price -> gasPrice
    methodName = methodName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  
  // Add method to prototype
  (NearRpcClient.prototype as any)[methodName] = function(params?: unknown) {
    return this.call(method, params);
  };
});

// Add convenience methods
(NearRpcClient.prototype as any).viewAccount = function(params: {
  accountId: string;
  finality?: 'final' | 'near-final' | 'optimistic';
  blockId?: string | number;
}) {
  return (this as any).query({
    requestType: 'view_account',
    ...params,
  });
};

(NearRpcClient.prototype as any).viewFunction = function(params: {
  accountId: string;
  methodName: string;
  argsBase64?: string;
  finality?: 'final' | 'near-final' | 'optimistic';
  blockId?: string | number;
}) {
  return (this as any).query({
    requestType: 'call_function',
    ...params,
  });
};

(NearRpcClient.prototype as any).viewAccessKey = function(params: {
  accountId: string;
  publicKey: string;
  finality?: 'final' | 'near-final' | 'optimistic';
  blockId?: string | number;
}) {
  return (this as any).query({
    requestType: 'view_access_key',
    ...params,
  });
};

// Import generated interfaces for truly dynamic typing
import type { DynamicRpcMethods, ConvenienceMethods } from './generated-types';

// Use declaration merging to add dynamic methods to the NearRpcClient class
export interface NearRpcClient extends DynamicRpcMethods, ConvenienceMethods {}

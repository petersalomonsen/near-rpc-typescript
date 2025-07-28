// JSON-RPC client with static function architecture (configuration only)
import type { ValidationResult } from './validation.js';

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

// Use static ID matching NEAR RPC documentation examples
const REQUEST_ID = 'dontcare';

// Types for client configuration
export interface ClientConfig {
  endpoint: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  validation?: ValidationResult;
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
    public originalError?: Error,
    public responseBody?: unknown
  ) {
    super(message);
    this.name = 'JsonRpcNetworkError';
  }
}

/**
 * NEAR RPC Client with static function architecture
 * This client only holds configuration and provides a makeRequest method
 * Individual RPC methods are provided as standalone functions that take this client as a parameter
 */
export class NearRpcClient {
  public readonly endpoint: string;
  public readonly headers: Record<string, string>;
  public readonly timeout: number;
  public readonly retries: number;
  private readonly validation?: ValidationResult;

  constructor(config: string | ClientConfig) {
    if (typeof config === 'string') {
      this.endpoint = config;
      this.headers = {};
      this.timeout = 30000;
      this.retries = 3;
    } else {
      this.endpoint = config.endpoint;
      this.headers = config.headers || {};
      this.timeout = config.timeout || 30000;
      this.retries = config.retries || 3;
      if (config.validation) {
        this.validation = config.validation;
      }
    }
  }

  /**
   * Make a raw JSON-RPC request
   * This is used internally by the standalone RPC functions
   */
  async makeRequest<TParams = unknown, TResult = unknown>(
    method: string,
    params?: TParams
  ): Promise<TResult> {
    // Convert camelCase params to snake_case for the RPC call
    const snakeCaseParams = params ? convertKeysToSnakeCase(params) : params;

    const request: JsonRpcRequest<TParams | undefined> = {
      jsonrpc: '2.0',
      id: REQUEST_ID,
      method,
      params: snakeCaseParams as TParams | undefined,
    };

    // Validate request if validation is enabled
    if (this.validation) {
      if ('validateMethodRequest' in this.validation) {
        this.validation.validateMethodRequest(method, request);
      } else {
        this.validation.validateRequest(request);
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.headers,
          },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let jsonResponse;
        try {
          jsonResponse = await response.json();
        } catch (parseError) {
          // If we can't parse JSON and it's not a 2xx response, include status info
          if (!response.ok) {
            throw new JsonRpcNetworkError(
              `HTTP error! status: ${response.status} - Failed to parse JSON response`,
              parseError as Error
            );
          }
          throw new JsonRpcNetworkError(
            'Failed to parse JSON response',
            parseError as Error
          );
        }

        // Check for JSON-RPC error in the response
        if (jsonResponse.error) {
          throw new JsonRpcClientError(
            jsonResponse.error.message,
            jsonResponse.error.code,
            jsonResponse.error.data
          );
        }

        // If it's not a 2xx status and no JSON-RPC error, throw network error with body
        if (!response.ok) {
          throw new JsonRpcNetworkError(
            `HTTP error! status: ${response.status}`,
            undefined,
            jsonResponse
          );
        }

        // Validate basic JSON-RPC response structure
        if (this.validation) {
          this.validation.validateResponse(jsonResponse);
        }

        // Convert snake_case response back to camelCase
        const camelCaseResult = jsonResponse.result
          ? convertKeysToCamelCase(jsonResponse.result)
          : jsonResponse.result;

        // Validate method-specific response structure after camelCase conversion
        if (this.validation && 'validateMethodResponse' in this.validation) {
          // Create a camelCase version of the response for validation
          const camelCaseResponse = {
            ...jsonResponse,
            result: camelCaseResult,
          };
          this.validation.validateMethodResponse(method, camelCaseResponse);
        }

        return camelCaseResult as TResult;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors or validation errors
        if (error instanceof JsonRpcClientError) {
          throw error;
        }

        // Don't retry if this is the last attempt
        if (attempt === this.retries) {
          break;
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    throw new JsonRpcNetworkError(
      lastError?.message || 'Request failed after all retries',
      lastError || undefined
    );
  }

  /**
   * Create a new client with modified configuration
   */
  withConfig(config: Partial<ClientConfig>): NearRpcClient {
    return new NearRpcClient({
      endpoint: config.endpoint ?? this.endpoint,
      headers: config.headers ?? this.headers,
      timeout: config.timeout ?? this.timeout,
      retries: config.retries ?? this.retries,
      ...(config.validation !== undefined
        ? { validation: config.validation }
        : this.validation !== undefined
          ? { validation: this.validation }
          : {}),
    });
  }
}

// Default client instance for convenience
export const defaultClient = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
});

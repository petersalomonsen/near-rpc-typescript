// Core JSON-RPC client implementation
import {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
  JsonRpcErrorSchema,
  RPC_METHODS,
} from '@psalomo/near-jsonrpc-types';
import { z } from 'zod';

// Define RpcMethod type locally
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
   */
  private async call<TParams = unknown, TResult = unknown>(
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

  // Generated RPC methods will be added here
  // This section will be auto-generated based on the OpenAPI spec

  /**
   * Get node status
   */
  async status(): Promise<any> {
    return this.call('status');
  }

  /**
   * Get block information
   */
  async block(params?: {
    blockId?: string | number;
    finality?: 'final' | 'near-final' | 'optimistic';
  }): Promise<any> {
    return this.call('block', params);
  }

  /**
   * Get current gas price
   */
  async gasPrice(params?: { blockId?: string | number }): Promise<any> {
    return this.call('gas_price', params);
  }

  /**
   * Get chunk information
   */
  async chunk(
    params: { chunkId: string } | { blockId: string | number; shardId: number }
  ): Promise<any> {
    return this.call('chunk', params);
  }

  /**
   * Health check
   */
  async health(): Promise<any> {
    return this.call('health');
  }

  /**
   * Get network information
   */
  async networkInfo(): Promise<any> {
    return this.call('network_info');
  }

  /**
   * Get current validators
   */
  async validators(params?: { blockId?: string | number }): Promise<any> {
    return this.call('validators', params);
  }

  /**
   * Get client configuration
   */
  async clientConfig(): Promise<any> {
    return this.call('client_config');
  }

  /**
   * Broadcast transaction asynchronously
   */
  async broadcastTxAsync(params: { signedTxBase64: string }): Promise<any> {
    return this.call('broadcast_tx_async', params);
  }

  /**
   * Broadcast transaction and wait for commit
   */
  async broadcastTxCommit(params: { signedTxBase64: string }): Promise<any> {
    return this.call('broadcast_tx_commit', params);
  }

  /**
   * Send transaction
   */
  async sendTx(params: { signedTxBase64: string }): Promise<any> {
    return await this.call('send_tx', params);
  }

  /**
   * Get transaction status
   */
  async tx(params: { txHash: string; senderAccountId: string }): Promise<any> {
    return this.call('tx', params);
  }

  /**
   * Query account/contract state
   */
  async query(params: {
    requestType: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
    accountId?: string;
    methodName?: string;
    argsBase64?: string;
    publicKey?: string;
    keyType?: string;
  }): Promise<any> {
    return this.call('query', params);
  }

  /**
   * View account information (convenience method)
   */
  async viewAccount(params: {
    accountId: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }): Promise<any> {
    return this.query({
      requestType: 'view_account',
      ...params,
    });
  }

  /**
   * View function call (convenience method)
   */
  async viewFunction(params: {
    accountId: string;
    methodName: string;
    argsBase64?: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }): Promise<any> {
    return this.query({
      requestType: 'call_function',
      ...params,
    });
  }

  /**
   * View access key (convenience method)
   */
  async viewAccessKey(params: {
    accountId: string;
    publicKey: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }): Promise<any> {
    return this.query({
      requestType: 'view_access_key',
      ...params,
    });
  }

  /**
   * Get light client proof
   */
  async lightClientProof(params: {
    type: string;
    lightClientHead: string;
    transactionHash?: string;
    senderId?: string;
    receiptId?: string;
  }): Promise<any> {
    return this.call('light_client_proof', params);
  }

  // Experimental methods

  /**
   * Get state changes (experimental)
   */
  async experimentalChanges(params: {
    changesType: string;
    accountIds?: string[];
    keyPrefixBase64?: string;
    blockId?: string | number;
  }): Promise<any> {
    return this.call('EXPERIMENTAL_changes', params);
  }

  /**
   * Get state changes in block (experimental)
   */
  async experimentalChangesInBlock(params: {
    blockId: string | number;
  }): Promise<any> {
    return this.call('EXPERIMENTAL_changes_in_block', params);
  }

  /**
   * Get ordered validators (experimental)
   */
  async experimentalValidatorsOrdered(params?: {
    blockId?: string | number;
  }): Promise<any> {
    return this.call('EXPERIMENTAL_validators_ordered', params);
  }

  /**
   * Get protocol configuration (experimental)
   */
  async experimentalProtocolConfig(params?: {
    blockId?: string | number;
    finality?: 'final' | 'near-final' | 'optimistic';
  }): Promise<any> {
    return this.call('EXPERIMENTAL_protocol_config', params);
  }

  /**
   * Get genesis configuration (experimental)
   */
  async experimentalGenesisConfig(): Promise<any> {
    return this.call('EXPERIMENTAL_genesis_config');
  }

  /**
   * Get receipt information (experimental)
   */
  async experimentalReceipt(params: { receiptId: string }): Promise<any> {
    return this.call('EXPERIMENTAL_receipt', params);
  }

  /**
   * Get transaction status (experimental)
   */
  async experimentalTxStatus(params: {
    txHash: string;
    senderAccountId: string;
  }): Promise<any> {
    return this.call('EXPERIMENTAL_tx_status', params);
  }
}

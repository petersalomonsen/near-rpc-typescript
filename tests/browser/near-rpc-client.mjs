// src/client.ts
import {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema
} from "@near-js/jsonrpc-types";
var JsonRpcClientError = class extends Error {
  constructor(message, code, data) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = "JsonRpcClientError";
  }
};
var JsonRpcNetworkError = class extends Error {
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = "JsonRpcNetworkError";
  }
};
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
function convertKeysToSnakeCase(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  }
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    converted[snakeKey] = convertKeysToSnakeCase(value);
  }
  return converted;
}
function convertKeysToCamelCase(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    converted[camelKey] = convertKeysToCamelCase(value);
  }
  return converted;
}
var NearRpcClient = class {
  endpoint;
  headers;
  timeout;
  retries;
  validateResponses;
  requestIdCounter = 0;
  constructor(config) {
    if (typeof config === "string") {
      this.endpoint = config;
      this.headers = {
        "Content-Type": "application/json"
      };
      this.timeout = 3e4;
      this.retries = 3;
      this.validateResponses = true;
    } else {
      this.endpoint = config.endpoint;
      this.headers = {
        "Content-Type": "application/json",
        ...config.headers
      };
      this.timeout = config.timeout || 3e4;
      this.retries = config.retries || 3;
      this.validateResponses = config.validateResponses ?? true;
    }
  }
  /**
   * Generate a unique request ID
   */
  generateRequestId() {
    return `near-rpc-${Date.now()}-${++this.requestIdCounter}`;
  }
  /**
   * Make a raw JSON-RPC call
   */
  async call(method, params) {
    const requestId = this.generateRequestId();
    const snakeCaseParams = params ? convertKeysToSnakeCase(params) : void 0;
    const request = {
      jsonrpc: "2.0",
      id: requestId,
      method,
      params: snakeCaseParams
    };
    if (this.validateResponses) {
      try {
        JsonRpcRequestSchema.parse(request);
      } catch (error) {
        throw new JsonRpcNetworkError(
          `Invalid request format: ${error instanceof Error ? error.message : "Unknown error"}`,
          error
        );
      }
    }
    let lastError = null;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        const response = await fetch(this.endpoint, {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify(request),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const jsonResponse = await response.json();
        if (this.validateResponses) {
          try {
            JsonRpcResponseSchema.parse(jsonResponse);
          } catch (error) {
            throw new JsonRpcClientError(
              `Invalid response format: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          }
        }
        const rpcResponse = jsonResponse;
        if (rpcResponse.error) {
          throw new JsonRpcClientError(
            rpcResponse.error.message,
            rpcResponse.error.code,
            rpcResponse.error.data
          );
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const camelCaseResult = rpcResponse.result ? convertKeysToCamelCase(rpcResponse.result) : rpcResponse.result;
        return camelCaseResult;
      } catch (error) {
        lastError = error;
        if (error instanceof JsonRpcClientError) {
          throw error;
        }
        if (attempt < this.retries) {
          const delay = Math.min(1e3 * Math.pow(2, attempt), 1e4);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }
    }
    throw new JsonRpcNetworkError(
      `Failed to make RPC call after ${this.retries + 1} attempts: ${lastError?.message}`,
      lastError
    );
  }
  // Generated RPC methods will be added here
  // This section will be auto-generated based on the OpenAPI spec
  /**
   * Get node status
   */
  async status() {
    return this.call("status");
  }
  /**
   * Get block information
   */
  async block(params) {
    return this.call("block", params);
  }
  /**
   * Get current gas price
   */
  async gasPrice(params) {
    return this.call("gas_price", params);
  }
  /**
   * Get chunk information
   */
  async chunk(params) {
    return this.call("chunk", params);
  }
  /**
   * Health check
   */
  async health() {
    return this.call("health");
  }
  /**
   * Get network information
   */
  async networkInfo() {
    return this.call("network_info");
  }
  /**
   * Get current validators
   */
  async validators(params) {
    return this.call("validators", params);
  }
  /**
   * Get client configuration
   */
  async clientConfig() {
    return this.call("client_config");
  }
  /**
   * Broadcast transaction asynchronously
   */
  async broadcastTxAsync(params) {
    return this.call("broadcast_tx_async", params);
  }
  /**
   * Broadcast transaction and wait for commit
   */
  async broadcastTxCommit(params) {
    return this.call("broadcast_tx_commit", params);
  }
  /**
   * Send transaction
   */
  async sendTx(params) {
    return await this.call("send_tx", params);
  }
  /**
   * Get transaction status
   */
  async tx(params) {
    return this.call("tx", params);
  }
  /**
   * Query account/contract state
   */
  async query(params) {
    return this.call("query", params);
  }
  /**
   * View account information (convenience method)
   */
  async viewAccount(params) {
    return this.query({
      requestType: "view_account",
      ...params
    });
  }
  /**
   * View function call (convenience method)
   */
  async viewFunction(params) {
    return this.query({
      requestType: "call_function",
      ...params
    });
  }
  /**
   * View access key (convenience method)
   */
  async viewAccessKey(params) {
    return this.query({
      requestType: "view_access_key",
      ...params
    });
  }
  /**
   * Get light client proof
   */
  async lightClientProof(params) {
    return this.call("light_client_proof", params);
  }
  // Experimental methods
  /**
   * Get state changes (experimental)
   */
  async experimentalChanges(params) {
    return this.call("EXPERIMENTAL_changes", params);
  }
  /**
   * Get state changes in block (experimental)
   */
  async experimentalChangesInBlock(params) {
    return this.call("EXPERIMENTAL_changes_in_block", params);
  }
  /**
   * Get ordered validators (experimental)
   */
  async experimentalValidatorsOrdered(params) {
    return this.call("EXPERIMENTAL_validators_ordered", params);
  }
  /**
   * Get protocol configuration (experimental)
   */
  async experimentalProtocolConfig(params) {
    return this.call("EXPERIMENTAL_protocol_config", params);
  }
  /**
   * Get genesis configuration (experimental)
   */
  async experimentalGenesisConfig() {
    return this.call("EXPERIMENTAL_genesis_config");
  }
  /**
   * Get receipt information (experimental)
   */
  async experimentalReceipt(params) {
    return this.call("EXPERIMENTAL_receipt", params);
  }
  /**
   * Get transaction status (experimental)
   */
  async experimentalTxStatus(params) {
    return this.call("EXPERIMENTAL_tx_status", params);
  }
};

// src/types.ts
var NearRpcError = class extends Error {
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = "NearRpcError";
  }
};

// src/index.ts
import { RPC_METHODS as RPC_METHODS2 } from "@near-js/jsonrpc-types";
export {
  JsonRpcClientError,
  JsonRpcNetworkError,
  NearRpcClient,
  NearRpcError,
  RPC_METHODS2 as RPC_METHODS,
  NearRpcClient as default
};

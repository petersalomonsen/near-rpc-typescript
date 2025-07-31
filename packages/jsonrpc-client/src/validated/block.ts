// Validated wrapper for block function
import { NearRpcClient } from '../client.js';
import type { RpcBlockRequest, RpcBlockResponse } from '@near-js/jsonrpc-types';
import {
  BlockRequestSchema,
  BlockResponseSchema,
} from '@near-js/jsonrpc-types';
import { enableValidation } from '../validation.js';

// Create a validation-enabled wrapper
export async function block(
  client: NearRpcClient,
  params?: RpcBlockRequest
): Promise<RpcBlockResponse> {
  // Create a client with validation if not already enabled
  const validatedClient = client.validation
    ? client
    : new NearRpcClient({
        endpoint: client.endpoint,
        headers: client.headers,
        validation: enableValidation(),
      });

  return validatedClient.makeRequest('block', params);
}
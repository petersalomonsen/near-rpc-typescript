// Validated function wrappers with per-function schema imports
// This provides validation while maintaining optimal tree-shaking

import { NearRpcClient } from '../client.js';
import type {
  RpcBlockRequest,
  RpcBlockResponse,
  RpcStatusRequest,
  RpcStatusResponse,
} from '@near-js/jsonrpc-types';

// Import base functions
import * as baseFunctions from '../generated-functions.js';
import * as baseConvenience from '../convenience.js';

// Import specific validation schemas
import {
  RpcBlockRequestSchema,
  BlockResponseSchema,
  RpcStatusRequestSchema,
  StatusResponseSchema,
  RpcQueryRequestSchema,
  QueryResponseSchema,
} from '@near-js/jsonrpc-types';

// Create validated wrapper for block function
export async function block(
  client: NearRpcClient,
  params?: RpcBlockRequest
): Promise<RpcBlockResponse> {
  // Validate request
  const blockRequestSchema = RpcBlockRequestSchema();
  if (params) {
    blockRequestSchema.parse(params);
  }

  // Call base function
  const result = await baseFunctions.block(client, params);

  // Validate response by creating a mock RPC response
  const blockResponseSchema = BlockResponseSchema();
  try {
    blockResponseSchema.parse({ jsonrpc: '2.0', id: 'dontcare', result });
  } catch (error) {
    // If validation fails, re-throw with clearer message
    throw new Error(`Response validation failed: ${error}`);
  }

  return result;
}

// Create validated wrapper for status function
export async function status(
  client: NearRpcClient,
  params?: RpcStatusRequest
): Promise<RpcStatusResponse> {
  // Validate request
  const statusRequestSchema = RpcStatusRequestSchema();
  if (params) {
    statusRequestSchema.parse(params);
  }

  // Call base function
  const result = await baseFunctions.status(client, params);

  // Validate response by creating a mock RPC response
  const statusResponseSchema = StatusResponseSchema();
  try {
    statusResponseSchema.parse({ jsonrpc: '2.0', id: 'dontcare', result });
  } catch (error) {
    // If validation fails, re-throw with clearer message
    throw new Error(`Response validation failed: ${error}`);
  }

  return result;
}

// Export all other functions without validation for now
// TODO: Add validation wrappers for all functions
export {
  experimentalChanges,
  experimentalChangesInBlock,
  experimentalCongestionLevel,
  experimentalGenesisConfig,
  experimentalLightClientBlockProof,
  experimentalLightClientProof,
  experimentalMaintenanceWindows,
  experimentalProtocolConfig,
  experimentalReceipt,
  experimentalSplitStorageInfo,
  experimentalTxStatus,
  experimentalValidatorsOrdered,
  blockEffects,
  broadcastTxAsync,
  broadcastTxCommit,
  changes,
  chunk,
  clientConfig,
  gasPrice,
  genesisConfig,
  health,
  lightClientProof,
  maintenanceWindows,
  networkInfo,
  nextLightClientBlock,
  query,
  sendTx,
  tx,
  validators,
} from '../generated-functions.js';

// Add validated wrapper for viewAccount
export async function viewAccount(
  client: NearRpcClient,
  params: {
    accountId: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
) {
  // Create a validation-enabled client for query method
  const validatedClient = client.withConfig({
    validation: {
      validateRequest: () => {}, // No-op for general validation
      validateResponse: () => {}, // No-op for general validation
      validateMethodRequest: (method: string, request: any) => {
        if (method === 'query' && request.params) {
          const queryRequestSchema = RpcQueryRequestSchema();
          queryRequestSchema.parse(request.params);
        }
      },
      validateMethodResponse: (method: string, response: any) => {
        if (method === 'query') {
          const queryResponseSchema = QueryResponseSchema();
          queryResponseSchema.parse(response);
        }
      },
    },
  });

  // Call base function with validated client
  return baseConvenience.viewAccount(validatedClient, params);
}

// Export other convenience functions without validation for now
export {
  viewFunction,
  viewAccessKey,
  parseCallResultToJson,
  viewFunctionAsJson,
} from '../convenience.js';

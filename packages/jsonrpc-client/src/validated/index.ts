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
import * as baseFunctions from '../generated-types.js';
import * as baseConvenience from '../convenience.js';

// Import specific validation schemas
import {
  BlockRequestSchema,
  BlockResponseSchema,
  StatusRequestSchema,
  StatusResponseSchema,
  QueryRequestSchema,
  QueryResponseSchema,
} from '@near-js/jsonrpc-types';

// Create validated wrapper for block function
export async function block(
  client: NearRpcClient,
  params?: RpcBlockRequest
): Promise<RpcBlockResponse> {
  // Validate request
  const blockRequestSchema = BlockRequestSchema();
  if (params) {
    blockRequestSchema.parse(params);
  }
  
  // Call base function
  const result = await baseFunctions.block(client, params);
  
  // Validate response
  const blockResponseSchema = BlockResponseSchema();
  blockResponseSchema.parse({ jsonrpc: '2.0', id: 'dontcare', result });
  
  return result;
}

// Create validated wrapper for status function
export async function status(
  client: NearRpcClient,
  params?: RpcStatusRequest
): Promise<RpcStatusResponse> {
  // Validate request
  const statusRequestSchema = StatusRequestSchema();
  if (params) {
    statusRequestSchema.parse(params);
  }
  
  // Call base function
  const result = await baseFunctions.status(client, params);
  
  // Validate response
  const statusResponseSchema = StatusResponseSchema();
  statusResponseSchema.parse({ jsonrpc: '2.0', id: 'dontcare', result });
  
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
} from '../generated-types.js';

// Add validated wrapper for viewAccount
export async function viewAccount(
  client: NearRpcClient,
  params: {
    accountId: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }
) {
  // viewAccount uses query internally, so validate query params
  const queryParams = params.blockId
    ? {
        requestType: 'view_account' as const,
        accountId: params.accountId,
        blockId: params.blockId,
      }
    : {
        requestType: 'view_account' as const,
        accountId: params.accountId,
        finality: params.finality || ('final' as const),
      };
  
  const queryRequestSchema = QueryRequestSchema();
  queryRequestSchema.parse(queryParams);
  
  const result = await baseConvenience.viewAccount(client, params);
  
  // Validate response
  const queryResponseSchema = QueryResponseSchema();
  queryResponseSchema.parse({ jsonrpc: '2.0', id: 'dontcare', result });
  
  return result;
}

// Export other convenience functions without validation for now
export {
  viewFunction,
  viewAccessKey,
  parseCallResultToJson,
  viewFunctionAsJson,
} from '../convenience.js';
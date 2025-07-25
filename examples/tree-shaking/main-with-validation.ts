// Tree-shaking example with validation enabled
// This will include Zod schemas in the bundle, but only for the functions we use

import {
  block,
  viewAccount,
  NearRpcClient,
  enableValidation,
} from '@near-js/jsonrpc-client/mini';

// Import specific schema for manual validation
import { RpcBlockRequestSchema } from '@near-js/jsonrpc-types/mini';

// Enable validation - this will include Zod schemas in the bundle
const validation = enableValidation();

// Create client with validation enabled
const validatedClient = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
  validation,
});

// Example 1: Use block function with parameters and validate them manually
console.log('=== Block Request with Parameter Validation ===');

const blockParams = { finality: 'final' as const };

// Manually validate the parameters before sending
try {
  const validatedParams = RpcBlockRequestSchema().parse(blockParams);
  console.log('✅ Block parameters are valid:', validatedParams);

  // Make the request with validated parameters
  const blockResult = await block(validatedClient, validatedParams);
  console.log('Block result:', {
    height: blockResult.header.height,
    hash: blockResult.header.hash,
    timestamp: blockResult.header.timestamp,
  });
} catch (error) {
  console.error('❌ Block parameter validation failed:', error);
}

// Example 2: Use viewAccount with different parameter types
console.log('\n=== View Account Request with Parameter Validation ===');

const accountParams = {
  accountId: 'near',
  finality: 'final' as const,
};

try {
  // The client validation will automatically validate this request
  const accountResult = await viewAccount(validatedClient, accountParams);
  console.log('✅ Account result for "near":', {
    amount: accountResult.amount,
    storageUsage: accountResult.storageUsage,
  });
} catch (error) {
  console.error('❌ Account request failed:', error);
}

// Example 3: Demonstrate validation catching invalid parameters
console.log('\n=== Invalid Parameter Validation Test ===');

try {
  // This should fail validation due to invalid finality value
  const invalidParams = { finality: 'invalid-finality' };
  RpcBlockRequestSchema().parse(invalidParams);
  console.log('❌ Should not reach here - validation should have failed');
} catch (error) {
  console.log(
    '✅ Successfully caught invalid parameters:',
    error instanceof Error ? error.message : String(error)
  );
}

// Example 4: Test with blockId parameter (using a recent block height)
console.log('\n=== Block Request with Block ID ===');

const blockIdParams = { blockId: 156733400 };

try {
  const validatedBlockIdParams = RpcBlockRequestSchema().parse(blockIdParams);
  console.log('✅ Block ID parameters are valid:', validatedBlockIdParams);

  const blockByIdResult = await block(validatedClient, validatedBlockIdParams);
  console.log('Block by ID result:', {
    height: blockByIdResult.header.height,
    hash: blockByIdResult.header.hash,
  });
} catch (error) {
  console.error('❌ Block ID request failed:', error);
}

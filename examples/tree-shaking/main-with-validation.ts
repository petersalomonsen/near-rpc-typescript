// Tree-shaking example with validation enabled
// This uses the new per-function validation approach
// Only the schemas for the functions actually used will be included

import { block, viewAccount } from '@near-js/jsonrpc-client';
import { NearRpcClient } from '@near-js/jsonrpc-client';

// Import specific schema for manual validation
import { RpcBlockRequestSchema } from '@near-js/jsonrpc-types';

// Create client without global validation
// The functions themselves will handle validation
const validatedClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
});

// Example 1: Use block function with built-in validation
console.log('=== Block Request with Validation ===');

const blockParams = { finality: 'final' as const };

try {
  // The block function validates internally
  const blockResult = await block(validatedClient, blockParams);
  console.log('Block result:', {
    height: blockResult.header.height,
    hash: blockResult.header.hash,
    timestamp: blockResult.header.timestamp,
  });
} catch (error) {
  console.error('❌ Block request failed:', error);
}

// Example 2: Use viewAccount with built-in validation
console.log('\n=== View Account Request with Validation ===');

const accountParams = {
  accountId: 'near',
  finality: 'final' as const,
};

try {
  // The viewAccount function validates internally
  const accountResult = await viewAccount(validatedClient, accountParams);
  console.log('✅ Account result for "near":', {
    amount: accountResult.amount,
    storageUsage: accountResult.storageUsage,
  });
} catch (error) {
  console.error('❌ Account request failed:', error);
}

// Example 3: Demonstrate manual validation still works
console.log('\n=== Manual Parameter Validation Test ===');

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

// Example 4: Test with blockId parameter
console.log('\n=== Block Request with Block ID ===');

const blockIdParams = { blockId: 156733400 };

try {
  const blockByIdResult = await block(validatedClient, blockIdParams);
  console.log('Block by ID result:', {
    height: blockByIdResult.header.height,
    hash: blockByIdResult.header.hash,
  });
} catch (error) {
  console.error('❌ Block ID request failed:', error);
}

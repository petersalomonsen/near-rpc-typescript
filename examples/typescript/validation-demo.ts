/**
 * This example demonstrates using the NEAR RPC client with validation enabled.
 * It shows how validation catches errors and ensures type safety.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/validation-demo.ts` from the root of the repository.
 */

import {
  NearRpcClient,
  enableValidation,
  status,
  health,
  block,
  networkInfo,
  validators,
} from '@near-js/jsonrpc-client';
import { viewAccount } from '@near-js/jsonrpc-client';

// Create client with validation enabled
const client = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
  validation: enableValidation(),
});

console.log('=== NEAR RPC Client with Validation Demo ===\n');

// Example 1: Methods with no parameters (testing undefined to null conversion)
console.log('1. Testing methods with no parameters:');
try {
  const statusResult = await status(client);
  console.log('✅ Status call successful:', {
    chainId: statusResult.chainId,
    latestBlockHeight: statusResult.syncInfo.latestBlockHeight,
  });

  const healthResult = await health(client);
  console.log('✅ Health call successful:', healthResult);

  // Note: networkInfo has a known schema mismatch - addr field expects string but API returns null
  // This is documented and will be fixed in the schema
  console.log('⚠️  Skipping networkInfo due to known schema mismatch');
} catch (error) {
  console.error('❌ Error in no-parameter methods:', error);
}

// Example 2: Methods with parameters
console.log('\n2. Testing methods with parameters:');
try {
  const blockResult = await block(client, { finality: 'final' });
  console.log('✅ Block call successful:', {
    height: blockResult.header.height,
    hash: blockResult.header.hash,
  });

  const validatorsResult = await validators(client, 'latest');
  console.log('✅ Validators call successful:', {
    validatorCount: validatorsResult.currentValidators.length,
    epochHeight: validatorsResult.epochHeight,
  });

  const accountResult = await viewAccount(client, {
    accountId: 'example.testnet',
    finality: 'final',
  });
  console.log('✅ View account call successful:', {
    amount: accountResult.amount,
    storageUsage: accountResult.storageUsage,
  });
} catch (error) {
  console.error('❌ Error in parameterized methods:', error);
}

// Example 3: Demonstrate validation catching invalid parameters
console.log('\n3. Testing validation with invalid parameters:');
const invalidClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
  validation: enableValidation(),
});

try {
  // @ts-expect-error - Intentionally passing invalid parameter to test validation
  await block(invalidClient, { finality: 'not-a-valid-finality' });
  console.log('❌ Should not reach here - validation should have failed');
} catch (error) {
  console.log('✅ Validation correctly caught invalid parameter:', 
    error instanceof Error ? error.message : String(error)
  );
}

// Example 4: Compare with non-validated client
console.log('\n4. Comparing validated vs non-validated client:');
const nonValidatedClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
});

try {
  // Non-validated client won't catch schema issues until the server responds
  // @ts-expect-error - Intentionally passing invalid parameter
  await block(nonValidatedClient, { finality: 'not-a-valid-finality' });
} catch (error) {
  console.log('✅ Non-validated client error from server:', 
    error instanceof Error ? error.message : String(error)
  );
}

console.log('\n=== Demo complete! ===');
console.log('Validation ensures:');
console.log('- Type safety for requests and responses');
console.log('- Early error detection before network calls');
console.log('- Better developer experience with clear error messages');
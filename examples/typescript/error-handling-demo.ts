/**
 * Error Handling Example
 *
 * This example demonstrates how the NEAR RPC client handles errors
 * when calling non-existent contract methods, both with and without
 * validation enabled.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/error-handling-demo.ts` from the root of the repository.
 */

import {
  NearRpcClient,
  viewFunction,
  enableValidation,
} from '@near-js/jsonrpc-client';

console.log('=== NEAR RPC Error Handling Example ===\n');

// Example 1: Error handling without validation
console.log('1. Calling non-existent method WITHOUT validation:');
console.log('   (Errors are now properly thrown)\n');

const clientWithoutValidation = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.fastnear.com',
});

try {
  await viewFunction(clientWithoutValidation, {
    accountId: 'webassemblymusic-treasury.sputnik-dao.near',
    methodName: 'get_last_proposal_id_', // non-existent method
  });
  // If we reach here, the test failed - error was not thrown
  console.error('❌ FAIL: Expected error was not thrown!');
  process.exit(1);
} catch (error: any) {
  console.log('✓ Error correctly thrown:');
  console.log(`  Type: ${error.name}`);
  console.log(`  Message: ${error.message}`);
  if (error.data) {
    console.log(`  Block Height: ${error.data.blockHeight}`);
    console.log(`  Original Error: ${error.data.error}`);
  }
}

console.log('\n' + '='.repeat(50) + '\n');

// Example 2: Error handling with validation enabled
console.log('2. Calling non-existent method WITH validation:');
console.log('   (Server errors are now properly displayed)\n');

const clientWithValidation = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.fastnear.com',
  validation: enableValidation(),
});

try {
  await viewFunction(clientWithValidation, {
    accountId: 'webassemblymusic-treasury.sputnik-dao.near',
    methodName: 'get_last_proposal_id_', // non-existent method
  });
  // If we reach here, the test failed - error was not thrown
  console.error('❌ FAIL: Expected error was not thrown!');
  process.exit(1);
} catch (error: any) {
  console.log('✓ Error correctly thrown with clear message:');
  console.log(`  Type: ${error.name}`);
  console.log(`  Message: ${error.message}`);
  if (error.data) {
    console.log(`  Block Height: ${error.data.blockHeight}`);
  }
}

console.log('\n=== Error handling working correctly in both cases! ===');

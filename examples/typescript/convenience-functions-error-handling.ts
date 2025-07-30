/**
 * Comprehensive Error Handling Example
 * 
 * This example demonstrates how all convenience functions in the NEAR RPC
 * client properly handle error cases, such as non-existent accounts,
 * methods, and access keys.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/convenience-functions-error-handling.ts` from the root of the repository.
 */

import { NearRpcClient, viewAccount, viewFunction, viewAccessKey } from '@near-js/jsonrpc-client';

console.log("=== NEAR RPC Convenience Functions Error Handling ===\n");

const client = new NearRpcClient({ 
  endpoint: "https://rpc.mainnet.fastnear.com"
});

// Example 1: viewAccount with non-existent account
console.log("1. Attempting to view a non-existent account:");
try {
  await viewAccount(client, {
    accountId: "this-account-definitely-does-not-exist-12345.near"
  });
  // If we reach here, the test failed - error was not thrown
  console.error("   ❌ FAIL: Expected error was not thrown!");
  process.exit(1);
} catch(error: any) {
  console.log("   ✓ Error correctly thrown:");
  console.log(`     ${error.message}\n`);
}

// Example 2: viewFunction with non-existent method
console.log("2. Attempting to call a non-existent contract method:");
try {
  await viewFunction(client, {
    accountId: "webassemblymusic-treasury.sputnik-dao.near",        
    methodName: "get_last_proposal_id_" // non-existent method
  });
  // If we reach here, the test failed - error was not thrown
  console.error("   ❌ FAIL: Expected error was not thrown!");
  process.exit(1);
} catch(error: any) {
  console.log("   ✓ Error correctly thrown:");
  console.log(`     ${error.message}`);
  if (error.data?.error) {
    console.log(`     Details: ${error.data.error}\n`);
  }
}

// Example 3: viewAccessKey with non-existent key
console.log("3. Attempting to view a non-existent access key:");
try {
  await viewAccessKey(client, {
    accountId: "near",
    publicKey: "ed25519:11111111111111111111111111111111" // non-existent key
  });
  // If we reach here, the test failed - error was not thrown
  console.error("   ❌ FAIL: Expected error was not thrown!");
  process.exit(1);
} catch(error: any) {
  console.log("   ✓ Error correctly thrown:");
  console.log(`     ${error.message}\n`);
}

console.log("=== All convenience functions handle errors properly! ===");

// Bonus: Show a successful call for comparison
console.log("\nFor comparison, here's a successful call:");
const account = await viewAccount(client, { accountId: "near" });
console.log(`✓ Account 'near' balance: ${account.amount} yoctoNEAR`);
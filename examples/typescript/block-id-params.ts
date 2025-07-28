/**
 * This example demonstrates the correct ways to specify blocks when querying NEAR RPC.
 *
 * Block identification can be done in several ways:
 * 1. By block height (number)
 * 2. By block hash (string)
 * 3. By finality (using the finality parameter, not blockId)
 *
 * To run:
 * pnpm tsx examples/typescript/block-id-params.ts
 */

import { NearRpcClient, changes, status } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
});

console.log('=== Block Identification Examples ===\n');

// First get a recent block to use in our examples
const statusResponse = await status(client);
const recentBlockHeight = statusResponse.syncInfo.latestBlockHeight - 100;

// Example 1: Query by block height
console.log('1. Query by block height (number):');
const changesByHeight = await changes(client, {
  blockId: recentBlockHeight,
  changesType: 'account_changes',
  accountIds: ['test.near'],
});
console.log(
  `   Found ${changesByHeight.changes?.length || 0} changes at block ${recentBlockHeight}\n`
);

// Example 2: Query by block hash
console.log('2. Query by block hash (string):');
const changesByHash = await changes(client, {
  blockId: changesByHeight.blockHash, // Use the hash from the previous query
  changesType: 'account_changes',
  accountIds: ['test.near'],
});
console.log(`   Found ${changesByHash.changes?.length || 0} changes\n`);

// Example 3: Query by finality (correct way)
console.log('3. Query by finality (using finality parameter):');
const changesByFinality = await changes(client, {
  finality: 'final',
  changesType: 'account_changes',
  accountIds: ['test.near'],
});
console.log(
  `   Found ${changesByFinality.changes?.length || 0} changes in final block\n`
);

// Common mistake to avoid
console.log('❌ Common mistake: Using "final" as blockId');
console.log('   blockId: "final" will fail with a parse error');
console.log('   Use finality: "final" instead\n');

// Show the block info from the responses
console.log('📋 Block information from responses:');
console.log(`   By height: block hash ${changesByHeight.blockHash}`);
console.log(`   By hash: block hash ${changesByHash.blockHash}`);
console.log(`   By finality: block hash ${changesByFinality.blockHash}`);

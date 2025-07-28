/**
 * This example demonstrates how to get state changes from the NEAR network.
 *
 * Note: The stable 'changes' method is available in NEAR node 2.7.0+
 * while 'experimentalChanges' works on older versions.
 *
 * To run:
 * 1. Make sure you have the latest packages installed: `pnpm install`
 * 2. Build the packages: `pnpm build`
 * 3. Run `pnpm tsx examples/typescript/get-changes.ts` from the root of the repository.
 */

import {
  NearRpcClient,
  experimentalChanges,
  changes,
  status,
} from '@near-js/jsonrpc-client';
import type { RpcStateChangesInBlockResponse } from '@near-js/jsonrpc-types';

// Example 1: Using experimentalChanges on mainnet (works with 2.6.x)
console.log(
  '=== MAINNET: Using experimentalChanges (compatible with current mainnet) ===\n'
);

const mainnetClient = new NearRpcClient({
  endpoint: 'https://archival-rpc.mainnet.fastnear.com',
});

// Use a specific block height where we know changes occurred
const blockHeight = 132553777;
console.log(`🔍 Getting account changes at block ${blockHeight}...`);

try {
  const accountChanges: RpcStateChangesInBlockResponse =
    await experimentalChanges(mainnetClient, {
      blockId: blockHeight,
      changesType: 'account_changes',
      accountIds: ['treasury-factory.near'],
    });

  console.log(
    `✅ Found ${accountChanges.changes?.length || 0} account changes`
  );
  if (accountChanges.changes && accountChanges.changes.length > 0) {
    accountChanges.changes.slice(0, 2).forEach((change, index) => {
      console.log(`   ${index + 1}. Account: ${change.change.accountId}`);
      console.log(`      Type: ${change.type}`);
      console.log(`      Cause: ${change.cause.type}`);
    });
  }
} catch (error: any) {
  console.error('❌ Error:', error.message);
}

// Get contract code changes
console.log('\n📝 Getting contract code changes...');
const contractChanges = await experimentalChanges(mainnetClient, {
  blockId: blockHeight,
  changesType: 'contract_code_changes',
  accountIds: ['treasury-factory.near'],
});

console.log(
  `✅ Found ${contractChanges.changes?.length || 0} contract code changes`
);
if (contractChanges.changes && contractChanges.changes.length > 0) {
  contractChanges.changes.forEach((change, index) => {
    if (change.type === 'contract_code_update') {
      console.log(`   ${index + 1}. Contract: ${change.change.accountId}`);
      console.log(`      Code length: ${change.change.codeBase64?.length || 0} chars (base64)`);
      console.log(`      Caused by: ${change.cause.type}`);
    }
  });
}

// Example 2: Using the new stable 'changes' method on testnet (2.7.0+)
console.log(
  '\n\n=== TESTNET: Using stable changes method (available in 2.7.0+) ===\n'
);

const testnetClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
});

console.log('🔍 Getting recent changes on testnet...');

try {
  // First, get the latest block to use a valid block ID
  const statusResponse = await status(testnetClient);
  const latestBlockHash = statusResponse.syncInfo.latestBlockHash;
  
  // Note: The stable 'changes' method works the same way as experimental
  const testnetChanges = await changes(testnetClient, {
    blockId: latestBlockHash,
    changesType: 'account_changes',
    accountIds: ['test.near', 'testnet'],
  });

  console.log(
    `✅ Using stable 'changes' method - Found ${testnetChanges.changes?.length || 0} changes`
  );

  // Try with a specific account that likely has changes
  const activeAccount = await changes(testnetClient, {
    blockId: latestBlockHash,
    changesType: 'all_access_key_changes',
    accountIds: ['testnet'],
  });

  console.log(
    `✅ Access key changes for 'testnet': ${activeAccount.changes?.length || 0}`
  );
} catch (error: any) {
  console.error('❌ Error with stable changes method:', error.message);
  if (error.code === -32700) {
    console.log('   Parse error: Invalid parameters');
    console.log('   Note: Use a valid block hash or height, not "final"');
  } else if (error.message.includes('Method not found')) {
    console.log('   This RPC provider does not support the stable changes method');
  }
}

// Example 3: Handling UNKNOWN_BLOCK errors on non-archival nodes
console.log('\n\n=== Example: Handling old blocks on non-archival RPC ===\n');

const regularTestnetClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com', // Non-archival, only recent blocks
});

// Try to query an old block that won't exist on non-archival nodes
const oldBlockHeight = 114467662; // Real testnet block that's too old for non-archival nodes

console.log(
  `🔍 Attempting to query old block ${oldBlockHeight} on non-archival testnet RPC...`
);

try {
  await experimentalChanges(regularTestnetClient, {
    blockId: oldBlockHeight,
    changesType: 'account_changes',
    accountIds: ['3e2210e1184b45b64c8a434c0a7e7b23cc04ea7eb7a6c3c32520d03d4afcb8af'],
  });
} catch (error: any) {
  console.log('❌ Error occurred:', error.message);

  // The client now properly parses JSON-RPC errors
  if (error.code === -32000 && error.data?.name === 'UNKNOWN_BLOCK') {
    console.log('📋 Error type: UNKNOWN_BLOCK');
    console.log(
      '💡 Solution: Use an archival RPC endpoint for historical data'
    );
    console.log('   Archival endpoints:');
    console.log('   - archival-rpc.mainnet.fastnear.com');
    console.log('   - archival-rpc.testnet.fastnear.com');
  } else if (error.code === -32700) {
    console.log('📋 Error type: Parse error - check parameters');
  } else if (error.message.includes('Method not found')) {
    console.log('📋 Error type: Method not supported by this RPC version');
  }
}

// Example 4: Proper error handling with type checking
console.log('\n\n=== Example: Robust error handling ===\n');

async function getChangesWithErrorHandling(
  client: NearRpcClient,
  params: any
): Promise<RpcStateChangesInBlockResponse | null> {
  try {
    // First try the stable method (for newer nodes)
    return await changes(client, params);
  } catch (error: any) {
    // Handle different error types
    if (error.message.includes('Method not found')) {
      console.log('⚠️  Stable method not available, trying experimental...');
      try {
        return await experimentalChanges(client, params);
      } catch (fallbackError: any) {
        return handleRpcError(fallbackError);
      }
    }
    return handleRpcError(error);
  }
}

function handleRpcError(error: any): null {
  console.log('\n🔍 Analyzing error...');

  // The client now properly parses JSON-RPC errors from the response
  if (error.name === 'JsonRpcClientError') {
    // Check for specific error types
    if (
      error.data?.name === 'UNKNOWN_BLOCK' ||
      (error.data?.cause && error.data.cause.name === 'UNKNOWN_BLOCK')
    ) {
      console.log('❌ Error: UNKNOWN_BLOCK');
      console.log(
        '   The requested block does not exist on this RPC provider.'
      );
      console.log('   Possible reasons:');
      console.log('   - Block is too old (use archival RPC)');
      console.log('   - Block height is in the future');
      console.log('   - Block was orphaned/reorganized');
      return null;
    }

    if (error.code === -32700) {
      console.log('❌ Error: PARSE_ERROR');
      console.log('   The request parameters are invalid.');
      console.log('   Common issues:');
      console.log('   - Using block_id: "final" instead of finality: "final"');
      console.log('   - Invalid block hash format');
      console.log('   - Missing required parameters');
      return null;
    }

    // Generic JSON-RPC error
    console.log('❌ JSON-RPC Error:', error.message);
    console.log('   Code:', error.code);
    console.log('   Data:', error.data);
    return null;
  }

  if (error.message.includes('Method not found')) {
    console.log('❌ Error: METHOD_NOT_FOUND');
    console.log('   This RPC provider does not support this method.');
    console.log('   The provider may be running an older version.');
    return null;
  }

  // Unknown error
  console.log('❌ Unexpected error:', error.message);
  return null;
}

// Test with a block that's likely too old for non-archival
console.log('Testing error handling with old block...');
const result = await getChangesWithErrorHandling(regularTestnetClient, {
  blockId: 114467662, // Old testnet block
  changesType: 'account_changes',
  accountIds: ['3e2210e1184b45b64c8a434c0a7e7b23cc04ea7eb7a6c3c32520d03d4afcb8af'],
});

if (!result) {
  console.log('\n💡 Tip: For historical data, use archival endpoints:');
  console.log('   - archival-rpc.mainnet.fastnear.com');
  console.log('   - archival-rpc.testnet.fastnear.com');
  
  // Show that the same request works on archival
  console.log('\n📍 Demonstrating the same request on archival testnet...');
  const archivalTestnetClient = new NearRpcClient({
    endpoint: 'https://archival-rpc.testnet.fastnear.com',
  });
  
  try {
    const archivalResult = await experimentalChanges(archivalTestnetClient, {
      blockId: 114467662,
      changesType: 'account_changes',
      accountIds: ['3e2210e1184b45b64c8a434c0a7e7b23cc04ea7eb7a6c3c32520d03d4afcb8af'],
    });
    
    console.log(`✅ Success! Found ${archivalResult.changes?.length || 0} changes on archival RPC`);
    console.log('   This confirms the block exists but is too old for non-archival nodes');
  } catch (archivalError: any) {
    console.log('❌ Unexpected error on archival:', archivalError.message);
  }
}

// Example 5: Checking if a node is archival
console.log('\n\n=== Example: Detecting archival vs non-archival nodes ===\n');

async function isArchivalNode(client: NearRpcClient): Promise<boolean> {
  try {
    // Try to query an old block that exists on archival but not regular nodes
    // Block 132553777 is old enough to not be on regular nodes but exists on archival
    await experimentalChanges(client, {
      blockId: 132553777,
      changesType: 'account_changes',
      accountIds: ['treasury-factory.near'],
    });
    return true; // If it succeeds, it's archival
  } catch (error: any) {
    // Check for UNKNOWN_BLOCK error
    if (
      error.data?.name === 'UNKNOWN_BLOCK' ||
      (error.data?.cause && error.data.cause.name === 'UNKNOWN_BLOCK')
    ) {
      return false; // Non-archival node
    }
    // Some other error - can't determine
    console.log('   Unable to determine archival status:', error.message);
    return false;
  }
}

console.log('Checking if nodes are archival...');

// Create a regular mainnet client for comparison
const regularMainnetClient = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.fastnear.com',
});

const isMainnetArchival = await isArchivalNode(regularMainnetClient);
console.log(
  `Regular mainnet RPC: ${isMainnetArchival ? '✅ Archival' : '❌ Non-archival'}`
);

const isArchivalMainnet = await isArchivalNode(mainnetClient);
console.log(
  `Archival mainnet RPC: ${isArchivalMainnet ? '✅ Archival' : '❌ Non-archival'}`
);

// Example 6: Understanding JSON-RPC Error Codes
console.log('\n\n=== JSON-RPC Error Code Reference ===\n');
console.log('The client now properly returns JSON-RPC error codes:');
console.log('');
console.log('Common error codes:');
console.log('  -32700: Parse error (invalid JSON or parameters)');
console.log('  -32600: Invalid request');
console.log('  -32601: Method not found');
console.log('  -32602: Invalid params');
console.log('  -32603: Internal error');
console.log('  -32000: Server error (check error.data for details)');
console.log('');
console.log('NEAR-specific error names in error.data:');
console.log('  UNKNOWN_BLOCK: Block not available on this node');
console.log('  INVALID_ACCOUNT: Account does not exist');
console.log('  UNAVAILABLE_SHARD: Shard not available');
console.log('  NO_CONTRACT_CODE: Account has no contract');
console.log('');
console.log('Example usage:');
console.log('  if (error.data?.name === "UNKNOWN_BLOCK") {');
console.log('    // Use archival node for historical data');
console.log('  }');

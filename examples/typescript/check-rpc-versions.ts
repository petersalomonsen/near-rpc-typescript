/**
 * Check RPC server versions across different NEAR endpoints.
 * This script helps identify which RPC methods are available on each endpoint.
 *
 * To run:
 * pnpm tsx examples/typescript/check-rpc-versions.ts
 */

import {
  NearRpcClient,
  status,
  block,
  experimentalChangesInBlock,
  experimentalGenesisConfig,
} from '@near-js/jsonrpc-client';

const endpoints = [
  {
    name: 'Mainnet FastNEAR (archival)',
    url: 'https://archival-rpc.mainnet.fastnear.com',
  },
  { name: 'Mainnet FastNEAR', url: 'https://rpc.mainnet.fastnear.com' },
  { name: 'Mainnet near.org', url: 'https://rpc.mainnet.near.org' },
  { name: 'Testnet FastNEAR', url: 'https://rpc.testnet.fastnear.com' },
  {
    name: 'Testnet FastNEAR (archival)',
    url: 'https://archival-rpc.testnet.fastnear.com',
  },
  { name: 'Testnet near.org', url: 'https://rpc.testnet.near.org' },
];

for (const endpoint of endpoints) {
  console.log(`\n=== ${endpoint.name} ===`);
  console.log(`URL: ${endpoint.url}`);

  const client = new NearRpcClient({ endpoint: endpoint.url });
  const statusResponse = await status(client);

  console.log(`Version: ${statusResponse.version.version}`);
  console.log(`Build: ${statusResponse.version.build}`);
  console.log(`Protocol: ${statusResponse.protocolVersion}`);
  console.log(`Latest block: ${statusResponse.syncInfo.latestBlockHeight}`);

  // Check if it's archival by looking at earliest block
  if (statusResponse.syncInfo.earliestBlockHeight) {
    console.log(
      `Earliest block: ${statusResponse.syncInfo.earliestBlockHeight}`
    );
  }

  // Get genesis height to test archival status
  let genesisHeight = 0;
  try {
    const genesisConfig = await experimentalGenesisConfig(client);
    genesisHeight = genesisConfig.genesisHeight + 100;
    console.log(`Genesis height: ${genesisHeight}`);
  } catch (error: any) {
    console.log(`Genesis height: Unable to fetch`);
    // Default genesis heights if we can't fetch
    genesisHeight = endpoint.url.includes('testnet') ? 42376888 : 9820214;
  }

  // First test if we can get the block header
  let canAccessBlock = false;
  try {
    const genesisBlock = await block(client, { blockId: genesisHeight });
    console.log(`Can access genesis+100 block header: ✅ Yes`);
    console.log(`  - Block height: ${genesisBlock.header.height}`);
    console.log(`  - Block hash: ${genesisBlock.header.hash}`);
    canAccessBlock = true;
  } catch (error: any) {
    if (
      error.data?.name === 'UNKNOWN_BLOCK' ||
      error.message?.includes('UNKNOWN_BLOCK')
    ) {
      console.log(`Can access genesis+100 block header: ❌ No (UNKNOWN_BLOCK)`);
    } else if (error.data?.includes('DB Not Found Error')) {
      console.log(`Can access genesis+100 block header: ❌ No (DB Not Found)`);
    } else {
      throw error;
    }
  }

  // Then test if node is archival by checking if state changes exist for the block
  let isArchival = false;
  try {
    const changesInBlock = await experimentalChangesInBlock(client, {
      blockId: genesisHeight,
    });
    console.log(`Can access genesis+100 block changes: ✅ Yes`);

    // Check changes content
    console.log(`Genesis+100 block changes:`);
    console.log(`  - Block hash: ${changesInBlock.blockHash}`);

    // Count different types of changes
    const changeTypes: Record<string, number> = {};
    if (changesInBlock.changes) {
      for (const change of changesInBlock.changes) {
        changeTypes[change.type] = (changeTypes[change.type] || 0) + 1;
      }
      console.log(`  - Total changes: ${changesInBlock.changes.length}`);
      console.log(`  - Change types:`);
      for (const [type, count] of Object.entries(changeTypes)) {
        console.log(`    - ${type}: ${count}`);
      }

      // Show a sample change
      if (changesInBlock.changes.length > 0) {
        const sampleChange = changesInBlock.changes[0];
        // StateChangeKindView has accountId directly on the object
        console.log(
          `  - Sample change: ${sampleChange.type} for ${sampleChange.accountId}`
        );
      }
    } else {
      console.log(`  - No changes data`);
    }

    isArchival = true;
  } catch (error: any) {
    if (
      error.data?.name === 'UNKNOWN_BLOCK' ||
      error.message?.includes('UNKNOWN_BLOCK')
    ) {
      isArchival = false;
      console.log(
        `Can access genesis+100 block changes: ❌ No (UNKNOWN_BLOCK)`
      );
    } else {
      // Re-throw other errors
      throw error;
    }
  }

  // Also test a recent block to see if it has more data
  console.log(`\nTesting recent block for comparison:`);
  try {
    const recentChanges = await experimentalChangesInBlock(client, {
      finality: 'final',
    });
    console.log(`Recent block (final) changes:`);

    const recentChangeTypes: Record<string, number> = {};
    if (recentChanges.changes) {
      for (const change of recentChanges.changes) {
        recentChangeTypes[change.type] =
          (recentChangeTypes[change.type] || 0) + 1;
      }
      console.log(`  - Total changes: ${recentChanges.changes.length}`);
      if (Object.keys(recentChangeTypes).length > 0) {
        console.log(
          `  - Change types: ${Object.keys(recentChangeTypes).join(', ')}`
        );
      }
    } else {
      console.log(`  - No changes data`);
    }
  } catch (error: any) {
    console.log(`Could not fetch recent block changes: ${error.message}`);
  }

  console.log(`\nIs archival: ${isArchival ? '✅ Yes' : '❌ No'}`);
}

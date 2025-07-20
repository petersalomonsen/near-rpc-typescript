/**
 * This example demonstrates basic usage of the NEAR RPC client on the testnet.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `node examples/javascript-esm/basic-usage.js` from the root of the repository.
 */

import { NearRpcClient } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
});

console.log('Getting latest block...');
const latestBlock = await client.block({ finality: 'final' });
console.log('Latest block:', latestBlock.header.height);

console.log('\nViewing account...');
const account = await client.viewAccount({
  accountId: 'example.testnet',
  finality: 'final',
});
console.log('Account details:', account);

console.log('\nGetting a specific block...');
// Use a recent block height from the result above for a valid query
const specificBlockHeight = latestBlock.header.height - 100;
const block = await client.block({ blockId: specificBlockHeight });
console.log(`Block at height ${specificBlockHeight}:`, block.header.hash);

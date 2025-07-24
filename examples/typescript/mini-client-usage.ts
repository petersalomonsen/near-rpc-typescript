/**
 * This example demonstrates using the mini variant of @near-js/jsonrpc-client
 * which uses zod/mini for smaller bundle sizes (63KB vs 95KB for regular client).
 *
 * The mini variant provides the same API but with optimized tree-shaking
 * for bundle size-sensitive applications.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/mini-client-usage.ts` from the root of the repository.
 */

import { NearRpcClient } from '@near-js/jsonrpc-client/mini';

// Create client instance - same API as regular client
const client = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
  timeout: 30000,
  retries: 3,
});

console.log('🚀 NEAR RPC Mini Client Demo');
console.log('Bundle size: ~63KB minified (vs ~95KB regular client)');
console.log('');

// Get network status
console.log('📡 Fetching network status...');
const status = await client.status();
console.log(`Network: ${status.chainId}`);
console.log(`Latest block height: ${status.syncInfo.latestBlockHeight}`);
console.log('');

// Get latest block
console.log('🔗 Fetching latest block...');
const block = await client.block({ finality: 'final' });
console.log(`Block height: ${block.header.height}`);
console.log(`Block hash: ${block.header.hash}`);
console.log(
  `Timestamp: ${new Date(Number(block.header.timestampNanosec) / 1000000)}`
);
console.log('');

// Get gas price
console.log('⛽ Fetching gas price...');
const gasPrice = await client.gasPrice({ blockId: block.header.height });
console.log(`Gas price: ${gasPrice.gasPrice} yoctoNEAR`);
console.log('');

// View account (testnet account)
console.log('👤 Viewing account info...');
const account = await client.viewAccount({
  accountId: 'testnet',
  finality: 'final',
});
console.log(`Account: testnet`);
console.log(`Balance: ${account.amount} yoctoNEAR`);
console.log(`Storage used: ${account.storageUsage} bytes`);
console.log('');

console.log('✅ Mini client demo completed successfully!');
console.log('');
console.log('💡 Benefits of mini client:');
console.log('  • 32KB smaller bundle size');
console.log('  • Same functionality as regular client');
console.log('  • Optimized for bundle size-sensitive applications');
console.log('  • Perfect for browser applications');

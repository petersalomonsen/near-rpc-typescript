/**
 * This example demonstrates using @near-js/jsonrpc-client
 * which uses static functions with a client-based architecture for optimal tree-shaking.
 *
 * The client provides:
 * - Static RPC functions instead of instance methods
 * - Function-based schemas for better tree-shaking
 * - Client object holds configuration only
 * - Case conversion behavior (snake_case ↔ camelCase)
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/mini-client-usage.ts` from the root of the repository.
 */

import {
  NearRpcClient,
  status,
  block,
  gasPrice,
  viewAccount,
} from '@near-js/jsonrpc-client';

// Create client instance - holds configuration only, no RPC methods
const client = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
  timeout: 30000,
  retries: 3,
});

console.log('🚀 NEAR RPC Mini Client Demo');
console.log('Bundle size: optimized with tree-shaking');
console.log('');

// Get network status using static function
console.log('📡 Fetching network status...');
const statusResult = await status(client);
console.log(`Network: ${statusResult.chainId}`);
console.log(`Latest block height: ${statusResult.syncInfo.latestBlockHeight}`);
console.log('');

// Get latest block using static function
console.log('🔗 Fetching latest block...');
const blockResult = await block(client, { finality: 'final' });
console.log(`Block height: ${blockResult.header.height}`);
console.log(`Block hash: ${blockResult.header.hash}`);
console.log(
  `Timestamp: ${new Date(Number(blockResult.header.timestampNanosec) / 1000000)}`
);
console.log('');

// Get gas price using static function
console.log('⛽ Fetching gas price...');
const gasPriceResult = await gasPrice(client, {
  blockId: blockResult.header.height,
});
console.log(`Gas price: ${gasPriceResult.gasPrice} yoctoNEAR`);
console.log('');

// View account (testnet account) using static function
console.log('👤 Viewing account info...');
const accountResult = await viewAccount(client, {
  accountId: 'testnet',
  finality: 'final',
});
console.log(`Account: testnet`);
console.log(`Balance: ${accountResult.amount} yoctoNEAR`);
console.log(`Storage used: ${accountResult.storageUsage} bytes`);
console.log('');

console.log('✅ Client demo completed successfully!');
console.log('');
console.log('💡 Benefits of this client architecture:');
console.log('  • Optimal tree-shaking with static functions');
console.log('  • Complete NEAR RPC functionality');
console.log('  • Client-based architecture for configuration');
console.log('  • Perfect for bundle size-sensitive applications');

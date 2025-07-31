// Tree-shaking example without validation
// This will result in the smallest possible bundle size

import {
  block,
  viewAccount,
  NearRpcClient,
} from '@near-js/jsonrpc-client/no-validation';

// Create client (validation is never included)
const client = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
});

// Example 1: Use block function
console.log('=== Block Request (No Validation) ===');

const blockResult = await block(client, { finality: 'final' });
console.log('Block result:', {
  height: blockResult.header.height,
  hash: blockResult.header.hash,
  timestamp: blockResult.header.timestamp,
});

// Example 2: Use viewAccount
console.log('\n=== View Account Request (No Validation) ===');

const accountResult = await viewAccount(client, {
  accountId: 'near',
  finality: 'final',
});

console.log('Account result for "near":', {
  amount: accountResult.amount,
  storageUsage: accountResult.storageUsage,
});

console.log('\n✅ No validation bundle - minimal size achieved');
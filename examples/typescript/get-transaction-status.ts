/**
 * This example demonstrates how to get transaction status from the NEAR network.
 *
 * To run:
 * 1. Make sure you have the latest packages installed: `pnpm install`
 * 2. Build the packages: `pnpm build`
 * 3. Run `pnpm tsx examples/typescript/get-transaction-status.ts` from the root of the repository.
 */

import { NearRpcClient, tx } from '@near-js/jsonrpc-client';
import type { RpcTransactionResponse } from '@near-js/jsonrpc-types';

// Initialize client
const client = new NearRpcClient({
  endpoint: 'https://archival-rpc.mainnet.fastnear.com',
});

// Example 1: Get transaction status with hash and sender account
console.log('📄 Getting transaction status...');

// Note: Replace with an actual transaction hash and sender account ID
// You can find recent transactions on NEAR Explorer: https://nearblocks.io
const txHash = 'C4CYYjabaVR1QCDEreP64VVzB3AaofKU67jeHpDHDwB3';
const senderAccount = 'treasury-factory.near';

const txResult: RpcTransactionResponse = await tx(client, {
  txHash: txHash,
  senderAccountId: senderAccount,
});

console.log('✅ Transaction found!');
console.log(`   Status: ${JSON.stringify(txResult.status)}`);
console.log(`   Signer: ${txResult.transaction?.signerId}`);
console.log(`   Receiver: ${txResult.transaction?.receiverId}`);
console.log(`   Block Hash: ${txResult.transactionOutcome?.blockHash}`);

// Check if transaction succeeded
if (
  txResult.status &&
  typeof txResult.status === 'object' &&
  'SuccessValue' in txResult.status
) {
  console.log('   Result: Success ✓');
} else if (
  txResult.status &&
  typeof txResult.status === 'object' &&
  'Failure' in txResult.status
) {
  console.log('   Result: Failed ✗');
  console.log('   Error:', txResult.status.Failure);
}

// Example 2: Handle transaction not found
console.log('\n📄 Testing non-existent transaction...');
try {
  await tx(client, {
    txHash: 'InvalidHashForDemo1234567890',
    senderAccountId: 'test.near',
  });
} catch (error: any) {
  console.log('✅ Expected error for non-existent transaction:', error.message);
}

// Example 3: Get transaction with same hash (demonstrating reuse)
console.log('\n📄 Getting same transaction again...');
const txAgain = await tx(client, {
  txHash: txHash,
  senderAccountId: senderAccount,
});

console.log('✅ Transaction retrieved successfully');
if (
  txAgain.status &&
  typeof txAgain.status === 'object' &&
  'SuccessValue' in txAgain.status
) {
  console.log('   Result: Success ✓');
} else {
  console.log('   Result: Failed or Unknown');
}

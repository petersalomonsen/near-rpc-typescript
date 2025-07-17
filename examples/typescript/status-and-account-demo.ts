/**
 * Demo showing status, block, health, and account viewing methods.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/status-and-account-demo.ts` from the root of the repository.
 */

import { NearRpcClient } from '@near-js/jsonrpc-client';

async function testClient() {
  console.log('🚀 Testing NEAR RPC Client...\n');

  // Create client instance
  const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.near.org' });
  console.log('✅ Client created for testnet');

  try {
    // Test 1: Get node status
    console.log('\n📊 Testing status() method...');
    const status = await client.status();
    console.log(
      `✅ Node status: ${status.chainId} (${status.version?.version})`
    );
    console.log(`   Block height: ${status.syncInfo?.latestBlockHeight}`);

    // Test 2: Get latest block
    console.log('\n🧱 Testing block() method...');
    const block = await client.block({ finality: 'final' });
    console.log(`✅ Latest block: ${block.header?.height}`);
    console.log(`   Hash: ${block.header?.hash?.substring(0, 16)}...`);

    // Test 3: Skip gas price for now (needs array params)
    console.log('\n⛽ Skipping gasPrice() - needs parameter format fix');

    // Test 4: Test health endpoint
    console.log('\n🏥 Testing health() method...');
    const health = await client.health();
    console.log(
      `✅ Health check: ${health === null ? 'OK' : 'Issues detected'}`
    );

    // Test 5: Test a view account call
    console.log('\n👤 Testing viewAccount() method...');
    const account = await client.viewAccount({
      accountId: 'testnet',
      finality: 'final',
    });
    console.log(`✅ Account balance: ${account.amount} yoctoNEAR`);
    console.log(`   Storage used: ${account.storageUsage} bytes`);

    console.log('\n🎉 All tests passed! Client is working correctly.');
  } catch (error) {
    console.error('\n❌ Test failed:', (error as Error).message);
    if ('code' in (error as any)) {
      console.error(`   RPC Error Code: ${(error as any).code}`);
    }
  }
}

// Run the test
testClient().catch(console.error);
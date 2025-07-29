/**
 * Check RPC node versions and compare with OpenAPI spec version
 */

import { NearRpcClient, status } from '@near-js/jsonrpc-client';

async function checkNodeVersion(name: string, endpoint: string) {
  const client = new NearRpcClient({ endpoint });
  
  try {
    const result = await status(client);
    console.log(`\n${name}:`);
    console.log(`  Node Version: ${result.version?.version || 'Unknown'}`);
    console.log(`  Build: ${result.version?.build || 'Unknown'}`);
    console.log(`  Rust Version: ${result.version?.rustcVersion || 'Unknown'}`);
    console.log(`  Protocol Version: ${result.latestProtocolVersion || 'Unknown'}`);
  } catch (error) {
    console.error(`Failed to get status for ${name}:`, error.message);
  }
}

console.log('OpenAPI Spec Version: 1.1.0 (from tools/codegen/fixtures/openapi-baseline.json)');
console.log('\nChecking RPC node versions...');

// Check different endpoints
await checkNodeVersion('Mainnet (fastnear)', 'https://rpc.mainnet.fastnear.com');
await checkNodeVersion('Testnet (fastnear)', 'https://rpc.testnet.fastnear.com');
await checkNodeVersion('Mainnet (near.org)', 'https://rpc.mainnet.near.org');
await checkNodeVersion('Testnet (near.org)', 'https://rpc.testnet.near.org');

console.log('\nNote: The OpenAPI spec should ideally match the latest stable node version.');
console.log('Schema mismatches may occur when the spec is newer than the deployed nodes.');
/**
 * This example demonstrates how to get network information from the NEAR network.
 *
 * To run:
 * 1. Make sure you have the latest packages installed: `pnpm install`
 * 2. Build the packages: `pnpm build`
 * 3. Run `pnpm tsx examples/typescript/get-network-info.ts` from the root of the repository.
 */

import { NearRpcClient, networkInfo, enableValidation } from '@near-js/jsonrpc-client';
import type { RpcNetworkInfoResponse } from '@near-js/jsonrpc-types';

// Initialize client
const client = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
  validation: enableValidation(),
});

// Get network information
console.log('🌐 Getting network information...');

const netInfo: RpcNetworkInfoResponse = await networkInfo(client);

console.log('✅ Network info retrieved!');
console.log(`   Active peers: ${netInfo.activePeers?.length || 0}`);
console.log(`   Number of active peers: ${netInfo.numActivePeers}`);
console.log(`   Peer max count: ${netInfo.peerMaxCount}`);
console.log(`   Received bytes/sec: ${netInfo.receivedBytesPerSec}`);
console.log(`   Sent bytes/sec: ${netInfo.sentBytesPerSec}`);

// Show known producers
if (netInfo.knownProducers && netInfo.knownProducers.length > 0) {
  console.log(`\n🏭 Known block producers: ${netInfo.knownProducers.length}`);
  console.log('   Top 5 producers:');
  netInfo.knownProducers.slice(0, 5).forEach((producer, index) => {
    console.log(`   ${index + 1}. ${producer.accountId || producer.peerId}`);
  });
}

// Show active peers information
if (netInfo.activePeers && netInfo.activePeers.length > 0) {
  console.log('\n👥 Active peers sample:');
  netInfo.activePeers.slice(0, 3).forEach((peer, index) => {
    console.log(`   ${index + 1}. Peer ID: ${peer.id}`);
    if (peer.addr) {
      console.log(`      Address: ${peer.addr}`);
    }
    if (peer.accountId) {
      console.log(`      Account: ${peer.accountId}`);
    }
  });
}

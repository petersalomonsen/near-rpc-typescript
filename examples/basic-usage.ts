// Example usage of the NEAR RPC TypeScript client
import { NearRpcClient } from '@near-js/jsonrpc-client';
import type { BlockResponse, StatusResponse } from '@near-js/jsonrpc-types';

async function example() {
  // Initialize client
  const client = new NearRpcClient('https://rpc.testnet.near.org');
  
  // Get node status with full typing
  const status: StatusResponse = await client.status();
  console.log(`Chain: ${status.chainId}`);
  console.log(`Version: ${status.version?.version}`);
  console.log(`Latest block: ${status.syncInfo?.latestBlockHeight}`);
  
  // Get latest block with full typing
  const block: BlockResponse = await client.block({ finality: 'final' });
  console.log(`Block height: ${block.header?.height}`);
  console.log(`Block hash: ${block.header?.hash}`);
  console.log(`Number of chunks: ${block.chunks?.length}`);
  
  // View account information
  const account = await client.viewAccount({
    accountId: 'testnet',
    finality: 'final'
  });
  console.log(`Account balance: ${account.amount} yoctoNEAR`);
  
  // View a function call result
  const result = await client.viewFunction({
    accountId: 'guest-book.testnet',
    methodName: 'get_messages',
    argsBase64: '', // Empty args for this example
    finality: 'final'
  });
  console.log('Function call result:', result);
  
  // Error handling example
  try {
    await client.viewAccount({
      accountId: 'non-existent-account-12345',
      finality: 'final'
    });
  } catch (error) {
    if (error.code === -32000) {
      console.log('Account does not exist');
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
}

export default example;

// Tree-shaking example: Import multiple schemas to test selective inclusion
// This demonstrates optimal tree-shaking with minimal bundle size

// Import from main export (now powered by individual schema files)
import { status, defaultClient, NearRpcClient } from '@near-js/jsonrpc-client';

// Use the default client
const result = await status(defaultClient);
console.log('Status result:', result);

// Or create a custom client
const customClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.near.org',
  timeout: 10000,
});

const testnetResult = await status(customClient);
console.log('Testnet status result:', testnetResult);

// Tree-shaking example: Import multiple schemas to test selective inclusion
// This demonstrates optimal tree-shaking with minimal bundle size

// Import from main export (now powered by individual schema files)
import { status, NearRpcClient } from '@near-js/jsonrpc-client';

// Create a client
const client = new NearRpcClient('https://rpc.mainnet.fastnear.com');

// Use the client
const result = await status(client);
console.log('Status result:', result);

// Or create a custom client
const customClient = new NearRpcClient('https://rpc.testnet.fastnear.com');

const testnetResult = await status(customClient);
console.log('Testnet status result:', testnetResult);

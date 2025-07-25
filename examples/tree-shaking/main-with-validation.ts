// Tree-shaking example with validation enabled
// This will include Zod schemas in the bundle

import {
  status,
  NearRpcClient,
  enableValidation,
} from '@near-js/jsonrpc-client/mini';

// Enable validation - this will include Zod schemas in the bundle
const validation = enableValidation();

// Create client with validation enabled
const validatedClient = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
  validation,
});

// Use the validated client
const result = await status(validatedClient);
console.log('Status result with validation:', result);

// Create another client with different endpoint and validation
const testnetValidatedClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.near.org',
  timeout: 10000,
  validation,
});

const testnetResult = await status(testnetValidatedClient);
console.log('Testnet status result with validation:', testnetResult);

# `@near-js/jsonrpc-client`

This package provides a fully-typed, dynamic client for the NEAR Protocol JSON-RPC API. All methods and types are automatically generated from the official OpenAPI specification.

## Installation

```bash
npm install @near-js/jsonrpc-client
```

## Usage

Create a new client instance and use the available RPC functions:

```typescript
import { NearRpcClient, status } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
});

async function getNetworkStatus() {
  const result = await status(client);
  console.log('Network status:', result);
}

getNetworkStatus();
```

### Handling Responses

All method calls return a promise that resolves to a fully typed result object based on the JSON-RPC API specification.

```typescript
import { NearRpcClient, block } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
});

async function getLatestBlock() {
  const result = await block(client, { finality: 'final' });
  console.log('Latest block height:', result.header?.height);
}

getLatestBlock();
```

### Convenience Methods

The client includes convenience methods for common query operations:

```typescript
// View account information
const account = await client.viewAccount({
  accountId: 'example.near',
  finality: 'final',
});
console.log('Account balance:', account.amount);
console.log('Storage used:', account.storageUsage);

// Call view functions
const result = await client.viewFunction({
  accountId: 'contract.near',
  methodName: 'get_balance',
  finality: 'final',
});

// View access keys
const accessKey = await client.viewAccessKey({
  accountId: 'example.near',
  publicKey: 'ed25519:...',
  finality: 'final',
});
```

## Runtime Validation

The client supports runtime validation using Zod schemas to ensure both request parameters and server responses conform to the NEAR RPC specification. **We strongly recommend enabling validation** to catch errors early and ensure data integrity.

```typescript
import { NearRpcClient, status, block, enableValidation } from '@near-js/jsonrpc-client';

// Create client with validation enabled (recommended)
const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
  validation: enableValidation()
});

// Request parameters are validated before sending
try {
  await block(client, { blockId: 'invalid' }); // ❌ Throws validation error
  await block(client, { finality: 'final' }); // ✅ Valid parameters
} catch (error) {
  console.error('Validation error:', error.message);
  // "Invalid block request: Expected finality or block_id"
}

// Server responses are also validated
const result = await status(client);
// You can trust that 'result' matches the expected schema
```

### Benefits of Validation

- **Request Safety**: Catch parameter errors before making network requests
- **Response Integrity**: Ensure server responses match the expected schema
- **Better Error Messages**: Get clear, descriptive errors instead of cryptic failures
- **Development Speed**: Find API usage mistakes immediately during development
- **Runtime Protection**: Guard against malformed or unexpected server responses

### Disabling Validation

For applications where bundle size is critical, validation can be disabled. The validation code is tree-shakable and only included when you import `enableValidation`.

```typescript
// Client without validation (smaller bundle, but less safe)
const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org'
  // No validation property = no runtime checks
});
```

## Features

- **🔧 Dynamic methods**: All 28+ RPC methods automatically available
- **📝 Fully typed**: Complete TypeScript support with proper request/response types
- **🔄 Auto-updating**: New API methods appear automatically without code changes
- **✅ Runtime validation**: Validates both request parameters and server responses
- **🎯 Convenience methods**: Simplified methods for common operations like `viewAccount`
- **🌳 Tree-shakable**: Validation is modular - only included when used

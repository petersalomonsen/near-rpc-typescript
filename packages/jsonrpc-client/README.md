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
import { viewAccount, viewFunction, viewAccessKey } from '@near-js/jsonrpc-client';

// View account information
const account = await viewAccount(client, {
  accountId: 'example.near',
  finality: 'final',
});
console.log('Account balance:', account.amount);
console.log('Storage used:', account.storageUsage);

// Call view functions
const result = await viewFunction(client, {
  accountId: 'contract.near',
  methodName: 'get_balance',
  finality: 'final',
});

// View access keys
const accessKey = await viewAccessKey(client, {
  accountId: 'example.near',
  publicKey: 'ed25519:...',
  finality: 'final',
});
```

### JSON Parsing Utilities

Many NEAR contracts return JSON data as byte arrays. We provide convenient utilities to parse these:

```typescript
import { viewFunction, viewFunctionAsJson, parseCallResultToJson } from '@near-js/jsonrpc-client';

// Manual parsing
const result = await viewFunction(client, {
  accountId: 'contract.near',
  methodName: 'get_status',
});
const data = parseCallResultToJson(result); // Converts byte array to JSON

// Or use the convenience function that does both
const data = await viewFunctionAsJson(client, {
  accountId: 'contract.near', 
  methodName: 'get_status',
});

// With TypeScript types
interface Status {
  version: string;
  uptime: number;
}
const status = await viewFunctionAsJson<Status>(client, {
  accountId: 'contract.near',
  methodName: 'get_status',
});
console.log(status.version); // Fully typed!
```

## Runtime Validation

The client supports runtime validation using Zod schemas to ensure both request parameters and server responses conform to the NEAR RPC specification.

### Default Usage (With Validation)

**By default, all functions include validation for maximum safety:**

```typescript
import { NearRpcClient, status, block } from '@near-js/jsonrpc-client';

// Just create a client - validation is built into the functions
const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
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

### Minimal Bundle Size (No Validation)

For applications where bundle size is critical, use the `/no-validation` export:

```typescript
import { NearRpcClient, status, block } from '@near-js/jsonrpc-client/no-validation';

// Same API, but no runtime validation
const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org'
});

// No validation = smaller bundle size
await block(client, { finality: 'final' });
```

#### TypeScript Configuration for Sub-exports

To use the `/no-validation` sub-export, your TypeScript configuration must support the `exports` field in package.json. Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "Node16", // or "NodeNext" or "bundler"
    "module": "Node16"            // Must match moduleResolution
  }
}
```

The legacy `"moduleResolution": "node"` does not support package sub-exports. If you cannot update your TypeScript configuration, use the default export which includes validation.

### Bundle Size Comparison

The new validation approach uses **per-function schema imports** for optimal tree-shaking:

- **With validation**: ~60KB for 2 functions (only includes schemas for used functions)
- **No validation**: ~7KB (no Zod schemas included)
- **Old approach**: ~150KB+ (included all schemas even for unused functions)

### Benefits of Validation

- **Request Safety**: Catch parameter errors before making network requests
- **Response Integrity**: Ensure server responses match the expected schema
- **Better Error Messages**: Get clear, descriptive errors instead of cryptic failures
- **Development Speed**: Find API usage mistakes immediately during development
- **Runtime Protection**: Guard against malformed or unexpected server responses
- **Optimal Tree-Shaking**: Only pay for validation of functions you actually use

## Features

- **🔧 Dynamic methods**: All 28+ RPC methods automatically available
- **📝 Fully typed**: Complete TypeScript support with proper request/response types
- **🔄 Auto-updating**: New API methods appear automatically without code changes
- **✅ Runtime validation**: Validates both request parameters and server responses
- **🎯 Convenience methods**: Simplified methods for common operations like `viewAccount`
- **🌳 Tree-shakable**: Validation is modular - only included when used

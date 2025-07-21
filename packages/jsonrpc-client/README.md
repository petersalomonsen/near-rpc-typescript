# `@near-js/jsonrpc-client`

This package provides a fully-typed, dynamic client for the NEAR Protocol JSON-RPC API. All methods and types are automatically generated from the official OpenAPI specification.

## Installation

```bash
pnpm add @near-js/jsonrpc-client
```

## Usage

Create a new client instance and call any of the available RPC methods:

```typescript
import { NearRpcClient } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org'
});

async function getNetworkStatus() {
  const status = await client.status();
  console.log('Network status:', status);
}

getNetworkStatus();
```

### Handling Responses

All method calls return a promise that resolves to a fully typed result object based on the JSON-RPC API specification.

```typescript
import { NearRpcClient } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org'
});

async function getLatestBlock() {
  const block = await client.block({ finality: 'final' });
  console.log('Latest block height:', block.header?.height);
}

getLatestBlock();
```

### Convenience Methods

The client includes convenience methods for common query operations:

```typescript
// View account information
const account = await client.viewAccount({
  accountId: 'example.near',
  finality: 'final'
});
console.log('Account balance:', account.amount);
console.log('Storage used:', account.storageUsage);

// Call view functions
const result = await client.viewFunction({
  accountId: 'contract.near',
  methodName: 'get_balance',
  finality: 'final'
});

// View access keys
const accessKey = await client.viewAccessKey({
  accountId: 'example.near',
  publicKey: 'ed25519:...',
  finality: 'final'
});
```

## Features

- **🔧 Dynamic methods**: All 28+ RPC methods automatically available
- **📝 Fully typed**: Complete TypeScript support with proper request/response types
- **🔄 Auto-updating**: New API methods appear automatically without code changes
- **✅ Runtime validation**: Built-in parameter validation with helpful error messages
- **🎯 Convenience methods**: Simplified methods for common operations like `viewAccount`

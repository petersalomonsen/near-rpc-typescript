# `@near-js/jsonrpc-client`

This package provides a fully-typed client for the NEAR Protocol JSON-RPC API.

## Installation

```bash
pnpm add @near-js/jsonrpc-client
```

## Usage

Create a new client instance and call any of the available RPC methods:

```typescript
import { JsonRpcClient } from '@near-js/jsonrpc-client';

const client = new JsonRpcClient({ url: 'https://rpc.mainnet.near.org' });

async function getNetworkStatus() {
  const status = await client.status();
  console.log('Network status:', status);
}

getNetworkStatus();
```

### Handling Responses

All method calls return a promise that resolves to a result object. The result object is fully typed based on the JSON-RPC API specification.

```typescript
import { JsonRpcClient } from '@near-js/jsonrpc-client';

const client = new JsonRpcClient({ url: 'https://rpc.mainnet.near.org' });

async function getLatestBlock() {
  const block = await client.block({ finality: 'final' });
  console.log('Latest block:', block);
}

getLatestBlock();
```

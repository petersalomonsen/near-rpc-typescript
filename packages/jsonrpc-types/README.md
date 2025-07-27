# `@near-js/jsonrpc-types`

This package contains TypeScript types and Zod schemas for the NEAR Protocol JSON-RPC API.

## Installation

```bash
npm install @near-js/jsonrpc-types
```

## Usage

This package exports all the types and schemas for the NEAR JSON-RPC API. You can import them directly from the package:

```typescript
import type { BlockReference } from '@near-js/jsonrpc-types';
import { BlockReferenceSchema } from '@near-js/jsonrpc-types';

const blockReference: BlockReference = {
  block_id: 'latest',
};

const result = BlockReferenceSchema.safeParse(blockReference);

if (result.success) {
  console.log('Valid block reference');
} else {
  console.error(result.error);
}
```

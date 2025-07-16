# NEAR OpenAPI Spec Analysis & Discrepancies

## Overview

This document outlines the analysis of the NEAR Protocol OpenAPI specification and identifies key discrepancies between the spec and actual JSON-RPC behavior that need to be addressed in our code generation.

## Key Findings

### 1. Path vs Method Discrepancy ⚠️

**Issue**: The OpenAPI spec defines unique paths for each method (e.g., `/block`, `/gas_price`, `/query`), but actual NEAR JSON-RPC uses a single endpoint `/` with the method specified in the request body.

**Examples**:

- OpenAPI: `POST /block`
- Actual RPC: `POST /` with `{"method": "block", ...}`

**Impact**: Our code generator must map OpenAPI paths to actual JSON-RPC method names.

### 2. Method Categories

The spec defines 39 distinct RPC methods across several categories:

#### Core Methods (8)

- `block` - Get block information
- `chunk` - Get chunk information
- `gas_price` - Get current gas price
- `status` - Get node status
- `health` - Health check
- `network_info` - Network information
- `validators` - Current validators
- `client_config` - Client configuration

#### Transaction Methods (4)

- `broadcast_tx_async` - Broadcast transaction asynchronously
- `broadcast_tx_commit` - Broadcast transaction and wait for commit
- `send_tx` - Send transaction
- `tx` - Get transaction status

#### Query Methods (2)

- `query` - Query account/contract state
- `light_client_proof` - Light client execution proof

#### Experimental Methods (25)

All prefixed with `EXPERIMENTAL_`:

- State changes: `EXPERIMENTAL_changes`, `EXPERIMENTAL_changes_in_block`
- Validation: `EXPERIMENTAL_validators_ordered`
- Protocol: `EXPERIMENTAL_protocol_config`, `EXPERIMENTAL_genesis_config`
- Light client: `EXPERIMENTAL_light_client_proof`, `EXPERIMENTAL_light_client_block_proof`
- Receipts: `EXPERIMENTAL_receipt`
- Transactions: `EXPERIMENTAL_tx_status`
- Storage: `EXPERIMENTAL_split_storage_info`
- Congestion: `EXPERIMENTAL_congestion_level`
- Maintenance: `EXPERIMENTAL_maintenance_windows`

### 3. Request/Response Patterns

#### Request Structure

All methods follow the JSON-RPC 2.0 pattern:

```typescript
interface JsonRpcRequest<T> {
  jsonrpc: '2.0';
  id: string;
  method: string;
  params: T;
}
```

#### Response Structure

```typescript
interface JsonRpcResponse<T> {
  jsonrpc: '2.0';
  id: string;
  result?: T;
  error?: RpcError;
}
```

### 4. Parameter Patterns

#### Block Identification

Many methods accept flexible block identification:

```typescript
type BlockReference =
  | { block_id: BlockId } // Hash or height
  | { finality: Finality } // "optimistic" | "near-final" | "final"
  | { sync_checkpoint: SyncCheckpoint }; // "genesis" | "earliest_available"
```

#### Query Method Complexity

The `query` method supports multiple request types:

- `view_account` - Account information
- `view_code` - Contract code
- `view_state` - Account state
- `view_access_key` - Access key info
- `view_access_key_list` - All access keys
- `call_function` - View function call
- `view_global_contract_code` - Global contract code

### 5. Type System Patterns

#### Comprehensive Type Coverage

The spec defines 400+ schemas covering:

- **Core Types**: `AccountId`, `CryptoHash`, `PublicKey`, `Signature`
- **Blockchain Types**: `BlockHeaderView`, `ChunkHeaderView`, `TransactionView`
- **State Types**: `AccountView`, `AccessKeyView`, `ContractCodeView`
- **Error Types**: `RpcError`, `TxExecutionError`, `ActionError`
- **Configuration Types**: `GenesisConfig`, `RuntimeConfigView`, `VMConfigView`

#### Complex Union Types

Many types use sophisticated `oneOf` patterns:

- Actions (12 variants): `CreateAccount`, `DeployContract`, `FunctionCall`, etc.
- State changes (8 variants): Account, access key, data, contract code changes
- Execution statuses: `Unknown`, `Failure`, `SuccessValue`, `SuccessReceiptId`

#### Naming Conventions

- **snake_case**: Used throughout (e.g., `gas_price`, `account_id`, `public_key`)
- **Suffixes**:
  - `View` for read-only data structures
  - `Request`/`Response` for RPC types
  - `Config` for configuration types

### 6. Required Code Generation Fixes

#### Path to Method Mapping

```typescript
const PATH_TO_METHOD_MAP = {
  '/block': 'block',
  '/gas_price': 'gas_price',
  '/query': 'query',
  '/EXPERIMENTAL_changes': 'EXPERIMENTAL_changes',
  // ... complete mapping
};
```

#### Case Conversion

- **Input**: Convert camelCase client params to snake_case RPC params
- **Output**: Convert snake_case RPC responses to camelCase client properties
- **Preserve**: Keep method names and certain field names as snake_case

#### Request Wrapper Generation

Transform from:

```typescript
client.getBlock({ blockId: { blockHeight: 12345 } });
```

To:

```json
{
  "jsonrpc": "2.0",
  "id": "generated-id",
  "method": "block",
  "params": { "block_id": 12345 }
}
```

## Implementation Strategy

### Phase 1: Core Infrastructure

1. ✅ Fetch and parse OpenAPI spec
2. 🔄 Create path→method mapping logic
3. 🔄 Implement snake_case↔camelCase conversion
4. 🔄 Generate base TypeScript interfaces

### Phase 2: Type Generation

1. Generate Zod schemas from OpenAPI schemas
2. Create TypeScript types with proper case conversion
3. Handle complex union types and oneOf patterns
4. Generate proper JSDoc comments

### Phase 3: Client Generation

1. Generate method stubs with proper signatures
2. Implement request/response transformation
3. Add error handling and validation
4. Generate comprehensive tests

### Phase 4: Integration

1. Wire up generated types with generated client
2. Implement batching support
3. Add retry logic and connection management
4. Complete documentation and examples

## Next Steps

1. **Implement Path Mapping**: Create the logic to map OpenAPI paths to actual RPC method names
2. **Case Conversion**: Build robust snake_case↔camelCase conversion that preserves specific patterns
3. **Schema Generation**: Start generating Zod schemas from the OpenAPI components
4. **Type Generation**: Generate TypeScript interfaces with proper naming conventions

This analysis provides the foundation for building a fully type-safe, automated NEAR JSON-RPC client that handles all the discrepancies between the OpenAPI spec and actual protocol behavior.

# NEAR RPC Version Compatibility Notes

This document captures important observations about NEAR RPC version differences across providers and how they affect method availability.

## The Evolution from `EXPERIMENTAL_changes` to `changes`

### Timeline
- **Before June 2025**: Only `EXPERIMENTAL_changes` existed
- **June 19, 2025**: Commit [fdba1905](https://github.com/near/nearcore/commit/fdba19051ff3c177d69b7066d7d0be709d32a5b4) added stable `changes` endpoint
- **July 3, 2025**: Version 2.6.5 released (without `changes`)
- **Current**: Version 2.7.0-rc.x includes `changes` but only on testnet

### Current Status (as of July 2025)

#### Mainnet RPC Providers
All major mainnet providers run version 2.6.5 or older:
- `rpc.mainnet.near.org`: 2.6.5 ❌ No `changes` support
- `rpc.mainnet.fastnear.com`: 2.6.5 ❌ No `changes` support
- `near.lava.build`: 2.6.1 ❌ No `changes` support
- `1rpc.io/near`: 2.6.5 ❌ No `changes` support
- `near.blockpi.network`: 2.6.4 ❌ No `changes` support

#### Testnet RPC Providers
Some testnet providers run 2.7.0-rc.x:
- `rpc.testnet.near.org`: 2.7.0-rc.2 ✅ Has `changes` method
- `rpc.testnet.fastnear.com`: 2.7.0-rc.2 ✅ Has `changes` method
- `archival-rpc.testnet.fastnear.com`: ✅ Has `changes` method and historical data

### Understanding Block References

Both `changes` and `EXPERIMENTAL_changes` follow the same OpenAPI specification for block references. You can specify blocks using either:

1. **block_id** parameter:
   - Numeric block height: `"block_id": 186278611`
   - Block hash string: `"block_id": "CpWTCVU5sF7gc6CyM2cKYGpvhUYXdWNMkghktXjz5Qe8"`

2. **finality** parameter:
   - For latest blocks: `"finality": "final"` or `"finality": "optimistic"`

Common mistake: Using `"block_id": "final"` will fail because "final" is neither a valid block height nor a block hash. Use the `finality` parameter instead.

### TypeScript Client Usage

The TypeScript client correctly follows the OpenAPI spec:

```typescript
// Using block height
await changes(client, {
  blockId: 186278611,
  changesType: 'account_changes',
  accountIds: ['account.near']
});

// Using block hash
await changes(client, {
  blockId: 'CpWTCVU5sF7gc6CyM2cKYGpvhUYXdWNMkghktXjz5Qe8',
  changesType: 'account_changes',
  accountIds: ['account.near']
});

// For finality, the TypeScript interface might need adjustment
// Current: blockId: 'final' sends block_id: 'final' which fails
// The OpenAPI spec expects finality as a separate parameter
```

## Why Version Awareness Matters

This situation highlights important considerations when using NEAR RPC:

1. **Version Differences**: Different RPC providers run different versions of NEAR node software
2. **Method Availability**: Newer methods like `changes` are only available on newer versions (2.7.0+)
3. **Gradual Rollout**: Testnet typically gets new features before mainnet
4. **Provider Choice**: Consider which provider to use based on your version requirements

## Recommendations

### For Library Users
1. **Check RPC provider versions** - Use the `status` method to check what version a provider is running
2. **Use `experimentalChanges` for mainnet compatibility** - Until mainnet providers upgrade to 2.7.0+
3. **Test against your target RPC provider** - Don't assume all providers are on the same version
4. **Implement version-aware fallbacks** - Try newer methods first, fall back to experimental versions

### For Library Maintainers
1. **Keep both method versions** - The generator correctly includes both from the spec
2. **Document version requirements** - Make it clear which methods need which NEAR node versions
3. **Test against multiple providers** - Ensure compatibility across different versions
4. **Track provider versions** - Monitor when major providers upgrade

## Example Fallback Pattern

```typescript
async function getChangesWithFallback(
  client: NearRpcClient,
  params: any
): Promise<RpcStateChangesInBlockResponse> {
  try {
    // Try stable method (future-proof)
    return await changes(client, params);
  } catch (error: any) {
    if (error.message.includes('Method not found')) {
      // Fall back to experimental
      return await experimentalChanges(client, params);
    }
    throw error;
  }
}
```

## Method-Specific Compatibility Issues

### gas_price Parameter Format Change

The `gas_price` method underwent a parameter format change between versions:

#### Old Format (2.6.5 and earlier - current mainnet)
Mainnet expects array parameters:
```json
// Request
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "gas_price", 
  "params": [157347609]  // Array format
}

// Response (successful)
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "gas_price": "100000000"
  }
}

// Error when using object format on mainnet
{
  "error": {
    "code": -32700,
    "message": "Parse error",
    "data": "Failed parsing args: invalid type: map, expected a tuple of size 1"
  }
}
```

#### New Format (2.7.0+ - current testnet and OpenAPI spec)
The [OpenAPI schema](https://github.com/near/nearcore/blob/master/chain/jsonrpc/openapi/openapi.json#L10477-L10493) defines object parameters:
```json
// Schema definition
"RpcGasPriceRequest": {
  "properties": {
    "block_id": {
      "anyOf": [
        { "$ref": "#/components/schemas/BlockId" },
        { "enum": [null], "nullable": true }
      ]
    }
  },
  "type": "object"  // Object format, not array
}

// Request (as per OpenAPI spec)
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "gas_price",
  "params": { "block_id": 157347609 }  // Object format
}
```

**Important Note**: The OpenAPI specification was only added to nearcore on May 26, 2025 (commit [800da6e7](https://github.com/near/nearcore/commit/800da6e7ea502cbacac82dd02a30de77341587ff)), which is after version 2.6.5 was released. This means:
- There was no OpenAPI spec to generate from for older versions
- Our validation schemas are based on the newer format
- Validation will fail on mainnet for gas_price until mainnet upgrades to 2.7.0+

### experimentalProtocolConfig Field Mismatch Issues

The `experimentalProtocolConfig` method has version-dependent fields that cause validation failures.

#### Field Availability by Network

**Testnet Response** (version 2.7.0-rc.2):
```json
{
  "result": {
    "runtime_config": {
      "wasm_config": {
        "global_contract_host_fns": true,    // ✅ Present on testnet
        "saturating_float_to_int": true,     // ✅ Present on testnet
        // "reftype_bulk_memory": ???        // ❌ Missing on both networks!
        // ... other fields ...
      }
    }
  }
}
```

**Mainnet Response** (version 2.6.5):
```json
{
  "result": {
    "runtime_config": {
      "wasm_config": {
        // "global_contract_host_fns": ???   // ❌ Not present on mainnet
        // "saturating_float_to_int": ???    // ❌ Not present on mainnet
        // "reftype_bulk_memory": ???        // ❌ Missing on both networks!
        "alt_bn128": true,                   // ✅ Only on mainnet
        "math_extension": true,              // ✅ Only on mainnet
        // ... other fields ...
      }
    }
  }
}
```

#### OpenAPI Schema Definition
The schema at [VMConfigView](https://github.com/near/nearcore/blob/master/chain/jsonrpc/openapi/openapi.json#L13725-L13771) requires all three fields:

```json
"VMConfigView": {
  "properties": {
    "global_contract_host_fns": {
      "type": "boolean"
    },
    "reftype_bulk_memory": {      // This field doesn't exist in any response!
      "type": "boolean"
    },
    "saturating_float_to_int": {
      "type": "boolean"
    }
  },
  "required": [
    "global_contract_host_fns",
    "reftype_bulk_memory",         // Required but never returned
    "saturating_float_to_int"
  ]
}
```

#### Impact
- **API Call**: Succeeds and returns valid data
- **Zod Validation**: Fails because:
  - On mainnet: `global_contract_host_fns` and `saturating_float_to_int` are missing
  - On testnet: `reftype_bulk_memory` is missing (doesn't exist in any version)
  - On both: After camelCase conversion, the schema looks for `reftypesBulkMemory` which is never present
- **Error Source**: This is a Zod validation error, NOT an API error

#### Example Validation Error (from Zod)
```
Invalid EXPERIMENTAL_protocol_config response: [
  {
    "expected": "boolean",
    "code": "invalid_type", 
    "path": ["result", "runtimeConfig", "wasmConfig", "reftypesBulkMemory"],
    "message": "Invalid input"  // This is Zod's generic error message
  }
]
```

The OpenAPI spec appears to be out of sync with actual RPC implementations. The `reftype_bulk_memory` field is defined in the spec but not returned by any RPC node version.

## Other Observations

### RPC Provider Reliability
- FastNEAR endpoints tend to be more up-to-date and reliable
- Official near.org endpoints may have stricter rate limits
- Testnet often runs newer versions than mainnet

### Understanding Error Messages
- "Method not found" - The RPC provider doesn't support this method (version too old)
- "Parse error" - Parameters don't match the expected format per OpenAPI spec
- "UNKNOWN_BLOCK" - The requested block doesn't exist on this RPC provider

### OpenAPI Spec and Production Reality
- The OpenAPI spec reflects the latest NEAR node capabilities
- Production RPC providers may run older versions
- Always check version compatibility for newer methods

## Testing Methodology

These observations were gathered through:
1. Direct curl requests to multiple RPC endpoints
2. Comparing responses between different providers
3. Testing both mainnet and testnet
4. Analyzing the OpenAPI spec history
5. Running the TypeScript client against real endpoints

Last updated: July 2025
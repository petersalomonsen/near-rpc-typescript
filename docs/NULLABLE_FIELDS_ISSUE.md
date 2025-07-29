# Nullable Fields Issue in Code Generator

## Problem Description

The code generator incorrectly handles nullable fields from the OpenAPI specification when generating Zod schemas. This causes validation to fail when RPC nodes return `null` values for fields that are correctly marked as nullable in the OpenAPI spec.

### Example: network_info endpoint

**OpenAPI Specification** (correct):
```json
"RpcKnownProducer": {
  "properties": {
    "account_id": { "$ref": "#/components/schemas/AccountId" },
    "addr": {
      "nullable": true,
      "type": "string"
    },
    "peer_id": { "$ref": "#/components/schemas/PeerId" }
  },
  "required": ["account_id", "peer_id"],
  "type": "object"
}
```

**Generated Zod Schema** (incorrect):
```typescript
export const RpcKnownProducerSchema = () =>
  z.object({
    accountId: z.lazy(() => AccountIdSchema()),
    addr: z.optional(z.string()), // ❌ Wrong! Only accepts string | undefined
    peerId: z.lazy(() => PeerIdSchema()),
  });
```

**Actual RPC Response**:
```json
{
  "account_id": "validator.near",
  "addr": null,  // 🚨 This null value fails validation
  "peer_id": "ed25519:..."
}
```

## Root Cause

The code generator treats:
- `nullable: true` → `z.optional()` (accepts undefined)
- Field not in required array → `z.optional()` (accepts undefined)

But OpenAPI's `nullable: true` means the field can be `null`, not `undefined`.

## Impact

This affects multiple RPC methods where the API returns null values:
- `network_info` - addr field in knownProducers and activePeers
- Potentially other endpoints with nullable fields

## Fix Plan

### 1. Update the Code Generator Logic

The generator needs to distinguish between:
- **Nullable fields**: Can be the specified type OR null
- **Optional fields**: Can be present or absent (undefined)
- **Nullable + Optional fields**: Can be the type, null, or undefined

### 2. Implementation Strategy

```typescript
// Current (incorrect) approach
if (!required.includes(fieldName)) {
  zodType = `z.optional(${zodType})`;
}

// Proposed (correct) approach
if (field.nullable && !required.includes(fieldName)) {
  // Nullable + Optional
  zodType = `z.optional(z.union([${zodType}, z.null()]))`;
} else if (field.nullable) {
  // Nullable but Required
  zodType = `z.union([${zodType}, z.null()])`;
} else if (!required.includes(fieldName)) {
  // Optional but not Nullable
  zodType = `z.optional(${zodType})`;
}
```

### 3. Files to Update

1. **Primary fix**: `/workspaces/near-rpc-typescript/tools/codegen/generate.ts`
   - Update the schema generation logic to handle nullable fields
   - Look for where properties are converted to Zod schemas

2. **Tests**: Add test cases for nullable field handling
   - Test nullable required fields
   - Test nullable optional fields
   - Test non-nullable optional fields

### 4. Validation Examples

After the fix, schemas should validate correctly:

```typescript
// Required nullable field
const schema = z.object({
  addr: z.union([z.string(), z.null()])
});
schema.parse({ addr: "127.0.0.1" }); // ✅ Valid
schema.parse({ addr: null });        // ✅ Valid
schema.parse({});                    // ❌ Invalid - field is required

// Optional nullable field
const schema = z.object({
  addr: z.optional(z.union([z.string(), z.null()]))
});
schema.parse({ addr: "127.0.0.1" }); // ✅ Valid
schema.parse({ addr: null });        // ✅ Valid
schema.parse({});                    // ✅ Valid
schema.parse({ addr: undefined });   // ✅ Valid
```

## Temporary Workaround

Until the generator is fixed, users should:
1. Disable validation for affected endpoints
2. Or handle the validation errors gracefully

```typescript
// Example workaround
const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.fastnear.com',
  // validation: enableValidation(), // Commented out for network_info
});
```

## References

- OpenAPI 3.0 Specification on nullable: https://swagger.io/docs/specification/data-models/data-types/#null
- Zod documentation on nullable types: https://zod.dev/?id=nullables
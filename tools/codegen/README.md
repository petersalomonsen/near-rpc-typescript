# Code Generation Tools

This directory contains tools for generating TypeScript types and client interfaces from the NEAR Protocol OpenAPI specification.

## Files

- `generate.ts` - Main generator that downloads OpenAPI spec and generates types/schemas
- `generate-client-interface.ts` - Generates typed client interface for the RPC client
- `fixtures/openapi-baseline.json` - Baseline OpenAPI spec for regression testing
- `__tests__/` - Comprehensive test suite for the generators

## Usage

### Generate all types and client interface
```bash
pnpm run generate
```

### Generate just the client interface
```bash
pnpm run generate:client-interface
```

### Run tests
```bash
pnpm test
```

## Updating the OpenAPI Baseline

When the NEAR OpenAPI spec changes, you should update the baseline fixture:

```bash
# Download the latest OpenAPI spec
curl -s "https://raw.githubusercontent.com/near/nearcore/refs/heads/master/chain/jsonrpc/openapi/openapi.json" -o fixtures/openapi-baseline.json

# Verify the download
cat fixtures/openapi-baseline.json | jq '.info.title' # Should show "JSON RPC API"

# Run tests to ensure everything still works
pnpm test
```

## Testing Strategy

The test suite includes:

### Regression Tests (`__tests__/generate-client-interface.test.ts`)
- **Type generation consistency** - Ensures the same OpenAPI spec generates consistent types
- **Method signature validation** - Verifies proper parameter and return types
- **EXPERIMENTAL method handling** - Tests camelCase conversion for experimental methods
- **API evolution simulation** - Tests adding new methods to ensure future compatibility

### Integration Tests (`__tests__/integration.test.ts`)
- **Full pipeline testing** - Runs the complete generation process
- **Build verification** - Ensures generated code compiles without errors
- **Performance monitoring** - Tracks generation time and file sizes
- **Regression detection** - Compares current API with known baseline

### Type Safety Tests (`../../packages/jsonrpc-client/src/__tests__/typing.test.ts`)
- **Client method typing** - Verifies client methods have proper TypeScript types
- **Parameter validation** - Tests that incorrect parameters cause TypeScript errors
- **Return type inference** - Ensures methods return correctly typed promises
- **Dynamic method availability** - Verifies all expected methods exist on client

### Fixture Tests (`__tests__/fixtures.test.ts`)
- **Baseline loading** - Verifies the OpenAPI fixture loads correctly
- **Spec structure validation** - Ensures the spec has the expected structure
- **Method mapping generation** - Tests path-to-method mapping extraction

## Key Features

### TypeScript Introspection
The generator uses a sophisticated introspection system:
1. Builds the `jsonrpc-types` package to get fresh TypeScript definitions
2. Reads the generated `.d.ts` files to extract all available type names
3. Validates that generated method signatures use only existing types
4. Falls back to heuristics only when introspection fails

### Schema-Based Type Extraction
Instead of using naming heuristics, the generator:
- Parses OpenAPI schemas directly to extract parameter and response types
- Follows JSON-RPC response schema structure to find actual result types
- Maps schema names to TypeScript type names using introspection

### Proper Type Names
The generator extracts the correct TypeScript types:
- ✅ `CryptoHash` instead of `RpcCryptoHash`
- ✅ `GenesisConfig` instead of `RpcGenesisConfig`
- ✅ `RpcBlockRequest` for parameters, `RpcBlockResponse` for responses

## Architecture

```
generate.ts
├── Downloads OpenAPI spec from nearcore
├── Generates TypeScript types using z.infer
├── Generates Zod schemas
├── Generates method mappings
└── Calls generate-client-interface.ts
    ├── Builds jsonrpc-types package
    ├── Extracts available types via introspection
    ├── Parses OpenAPI schemas for parameter/response types
    ├── Generates typed method signatures
    └── Outputs client interface with proper types
```

This ensures that:
- Types are always up-to-date with the latest NEAR API
- Client methods have proper TypeScript typing
- New API methods are automatically supported
- Regression testing prevents breaking changes
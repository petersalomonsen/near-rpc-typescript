# Code Generation

The TypeScript types, Zod schemas, and client interface in this project are automatically generated from the NEAR Protocol OpenAPI specification.

## Process

1. The `update-types.yml` GitHub Actions workflow runs daily.
2. The workflow fetches the latest OpenAPI specification from the `nearcore` repository.
3. The `tools/codegen` script is executed to generate the new types, schemas, and client interface.
4. If there are any changes, a pull request is automatically created with the updated files.

## Generated Files

The code generation process creates several files:

### Types Package (`packages/jsonrpc-types/`)
- `src/types.ts` - Pure TypeScript types using `z.infer`
- `src/schemas.ts` - Zod validation schemas
- `src/methods.ts` - RPC method mappings extracted from OpenAPI paths

### Client Package (`packages/jsonrpc-client/`)
- `src/generated-types.ts` - TypeScript interface for the dynamic client with:
  - `DynamicRpcMethods` - All 28+ RPC methods with proper parameter and response types
  - `ConvenienceMethods` - Helper methods like `viewAccount`, `viewFunction`, `viewAccessKey`

## Dynamic Client Generation

The client uses a unique approach where all RPC methods are dynamically added to the client prototype at runtime, while TypeScript sees them as strongly-typed methods. This is achieved through:

1. **Runtime Generation**: Methods are added via `RPC_METHODS.forEach()` in `client.ts`
2. **Type Generation**: Interface definitions are generated in `generated-types.ts`
3. **Declaration Merging**: The client interface extends both `DynamicRpcMethods` and `ConvenienceMethods`

This approach ensures that:
- New API methods appear automatically when the OpenAPI spec is updated
- Full TypeScript type safety with proper parameter and response types
- Zero manual maintenance when the NEAR API evolves

## Running the Code Generation Manually

You can also run the code generation script manually:

```bash
# Generate everything
pnpm generate

# Generate only types and schemas
pnpm --filter @near-js/jsonrpc-types generate

# Generate only client interface
pnpm --filter @near-js/jsonrpc-client generate
```

# Tree-shaking Bundle Analysis Example

This example demonstrates the tree-shaking capabilities of the `@near-js/jsonrpc-client/mini` library using Rollup bundler analysis.

## 🎯 Purpose

This example proves that:

1. **Only imported functions** are included in the final bundle
2. **Zod validation schemas** are tree-shaken at the function level
3. **Minification** provides significant size reductions
4. **Parameter validation** works with complex input types

## 📦 Bundle Size Results

| Variant                | Unminified | Minified | Reduction |
| ---------------------- | ---------- | -------- | --------- |
| **Without validation** | 4.9KB      | 2.2KB    | 55%       |
| **With validation**    | 42KB       | 19KB     | 55%       |

## 🌳 Tree-shaking Demo

### Example 1: Basic Usage (main.ts)

```typescript
import { NearRpcClient, status } from '@near-js/jsonrpc-client/mini';

const client = new NearRpcClient({ endpoint: 'https://rpc.mainnet.near.org' });
const result = await status(client);
```

**Result**: Only `status` function included, no validation schemas

### Example 2: With Validation (main-with-validation.ts)

```typescript
import {
  block,
  viewAccount,
  NearRpcClient,
  enableValidation,
} from '@near-js/jsonrpc-client/mini';
import { RpcBlockRequestSchema } from '@near-js/jsonrpc-types/mini';

const validation = enableValidation();
const client = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
  validation,
});

// Parameter validation example
const blockParams = { finality: 'final' as const };
const validatedParams = RpcBlockRequestSchema().parse(blockParams);
const blockResult = await block(client, validatedParams);

// Account lookup
const accountResult = await viewAccount(client, {
  accountId: 'near',
  finality: 'final' as const,
});
```

**Result**: Only `block`, `viewAccount`, and `RpcBlockRequest` schemas included

## 🚀 Running the Example

### Build All Variants

```bash
# Install dependencies
pnpm install

# Build all bundle variants
pnpm build:all
```

This creates:

- `dist/bundle.js` - Basic usage without validation
- `dist/bundle.min.js` - Minified basic usage
- `dist/bundle-with-validation.js` - With Zod validation
- `dist/bundle-with-validation.min.js` - Minified with validation

### Run the Examples

```bash
# Basic usage (shows network status from mainnet and testnet)
node dist/bundle.js

# With validation (shows parameter validation and real API calls)
node dist/bundle-with-validation.js
```

### Analyze Bundle Sizes

```bash
# View all bundle sizes
ls -lh dist/

# Expected output:
# -rw-r--r--  1 user  staff   4.9K  bundle.js
# -rw-r--r--  1 user  staff   2.2K  bundle.min.js
# -rw-r--r--  1 user  staff    42K  bundle-with-validation.js
# -rw-r--r--  1 user  staff    19K  bundle-with-validation.min.js
```

## 🔧 Build Configuration

### Rollup Configs

- **rollup.config.js** - Basic bundle without validation
- **rollup.config.min.js** - Minified basic bundle
- **rollup.validation.config.js** - Bundle with validation
- **rollup.validation.config.min.js** - Minified validation bundle

All configs use:

- Tree-shaking enabled (`treeshake: { moduleSideEffects: false }`)
- Node.js resolution for workspace packages
- TypeScript compilation
- Terser minification (for .min.js variants)

## 📊 What the Results Prove

### Function-Level Tree-shaking

- Only `status()` function in basic example → 4.9KB bundle
- Only `block()`, `viewAccount()`, and related schemas in validation example → 42KB bundle
- No unused functions or schemas included

### Schema Tree-shaking

- `RpcBlockRequestSchema` included (used for manual validation)
- Schemas for unused functions like `gasPrice`, `validators` not included
- Zod validation is truly optional and tree-shakable

### Minification Effectiveness

- Consistent 55% size reduction across all variants
- Production-ready bundle sizes for web applications

## 🔄 CI Integration

This example runs automatically in GitHub Actions:

```yaml
- name: Build tree-shaking example
  run: cd examples/tree-shaking && pnpm build:all

- name: Run tree-shaking example (without validation)
  run: node examples/tree-shaking/dist/bundle.js

- name: Run tree-shaking example (with validation)
  run: node examples/tree-shaking/dist/bundle-with-validation.js

- name: Show tree-shaking bundle sizes
  run: ls -lh examples/tree-shaking/dist/
```

## 💡 Key Takeaways

1. **Optimal for web apps**: 2.2KB minified for basic usage
2. **Validation when needed**: 19KB minified with full Zod validation
3. **No dead code**: Only imported functions and schemas included
4. **Production ready**: Excellent performance characteristics
5. **Framework agnostic**: Works with any bundler supporting tree-shaking

## 🔗 Related Examples

- **[React Mini Client](../react-mini-client/)** - Full React app with tree-shaking
- **[TypeScript Examples](../typescript/)** - All TypeScript usage patterns
- **[Browser Examples](../../tests/browser/)** - Direct browser usage with bundles

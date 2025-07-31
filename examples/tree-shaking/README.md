# Tree-shaking Bundle Analysis Example

This example demonstrates the tree-shaking capabilities of the `@near-js/jsonrpc-client` library using Rollup bundler analysis.

## 🎯 Purpose

This example proves that:

1. **Only imported functions** are included in the final bundle
2. **Validation schemas** are tree-shaken at the function level
3. **No-validation exports** provide minimal bundle sizes
4. **Per-function validation** only includes schemas for used functions

## 📦 Bundle Size Results

| Variant                  | Unminified | Minified | Description                              |
| ------------------------ | ---------- | -------- | ---------------------------------------- |
| **No validation**        | 7.4KB      | ~3KB     | Using `/no-validation` export            |
| **With validation**      | 63KB       | 28KB     | Only schemas for used functions included |
| **Default (1 function)** | 56KB       | 25KB     | Single function with validation          |

## 🌳 Tree-shaking Demo

### Example 1: Basic Usage (main.ts)

```typescript
import { NearRpcClient, status } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'https://rpc.mainnet.near.org' });
const result = await status(client);
```

**Result**: Only `status` function and its validation schemas included

### Example 2: No Validation (main-no-validation.ts)

```typescript
import {
  NearRpcClient,
  block,
  viewAccount,
} from '@near-js/jsonrpc-client/no-validation';

const client = new NearRpcClient({ endpoint: 'https://rpc.mainnet.near.org' });
const blockResult = await block(client, { finality: 'final' });
const accountResult = await viewAccount(client, { accountId: 'near' });
```

**Result**: No validation schemas included at all - minimal bundle size

### Example 3: With Validation (main-with-validation.ts)

```typescript
import {
  block,
  viewAccount,
  NearRpcClient,
} from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'https://rpc.mainnet.near.org' });

// Functions have built-in validation
const blockResult = await block(client, { finality: 'final' });
const accountResult = await viewAccount(client, { accountId: 'near' });
```

**Result**: Only `block` and `viewAccount` validation schemas included

## 🚀 Running the Example

### Build All Variants

```bash
# Install dependencies
pnpm install

# Build all bundle variants
pnpm build:all
```

This creates:

- `dist/bundle.js` - Basic usage with validation for one function
- `dist/bundle.min.js` - Minified basic usage
- `dist/bundle-no-validation.js` - No validation version
- `dist/bundle-with-validation.js` - Multiple functions with validation
- `dist/bundle-with-validation.min.js` - Minified with validation

### Run the Examples

```bash
# Basic usage (status function with validation)
node dist/bundle.js

# No validation (minimal bundle)
node dist/bundle-no-validation.js

# With validation (block and viewAccount)
node dist/bundle-with-validation.js
```

### Run Tests

```bash
# Run comprehensive tree-shaking tests
pnpm test
```

The tests verify:
- All expected bundles are created
- Bundle sizes are within expected ranges
- No-validation bundles exclude all schemas
- Validation bundles only include schemas for used functions

### Analyze Bundle Sizes

```bash
# View all bundle sizes
ls -lh dist/

# Expected output:
# -rw-r--r--  1 user  staff   7.4K  bundle-no-validation.js
# -rw-r--r--  1 user  staff    56K  bundle.js
# -rw-r--r--  1 user  staff    25K  bundle.min.js
# -rw-r--r--  1 user  staff    63K  bundle-with-validation.js
# -rw-r--r--  1 user  staff    28K  bundle-with-validation.min.js
```

## 🔧 Build Configuration

### Rollup Configs

- **rollup.config.js** - Basic bundle with validation
- **rollup.config.min.js** - Minified basic bundle
- **rollup.no-validation.config.js** - No validation bundle
- **rollup.validation.config.js** - Bundle with multiple validated functions
- **rollup.validation.config.min.js** - Minified validation bundle

All configs use:

- Tree-shaking enabled (`treeshake: { moduleSideEffects: false }`)
- Node.js resolution for workspace packages
- TypeScript compilation
- Terser minification (for .min.js variants)

## 📊 What the Results Prove

### Function-Level Tree-shaking

- Only imported functions are included in bundles
- No dead code from unused functions
- Per-function validation schemas

### Two Export Paths

1. **Default export** (`@near-js/jsonrpc-client`)
   - Includes validation for imported functions
   - Only includes schemas for functions you use
   - ~56KB for single function, ~63KB for two functions

2. **No-validation export** (`@near-js/jsonrpc-client/no-validation`)
   - Excludes all validation schemas
   - Minimal bundle size: ~7.4KB
   - Same API, no runtime validation

### Old vs New Approach

- **Old**: 150KB+ (all schemas included even for unused functions)
- **New**: 56-63KB with validation, 7.4KB without
- **Reduction**: 58-95% smaller bundles

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

- name: Run tree-shaking tests
  run: cd examples/tree-shaking && pnpm test
```

## 💡 Key Takeaways

1. **Optimal for web apps**: 7.4KB for no-validation, 56KB+ with validation
2. **Validation is optional**: Choose between safety and bundle size
3. **No dead code**: Only imported functions and their schemas included
4. **Production ready**: Excellent performance characteristics
5. **Framework agnostic**: Works with any bundler supporting tree-shaking

## 🔗 Related Examples

- **[React Mini Client](../react-mini-client/)** - Full React app with tree-shaking
- **[TypeScript Examples](../typescript/)** - All TypeScript usage patterns
- **[Browser Examples](../../tests/browser/)** - Direct browser usage with bundles
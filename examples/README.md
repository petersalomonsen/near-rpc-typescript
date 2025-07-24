# NEAR RPC Client Examples

This directory contains examples demonstrating how to use the `@near-js/jsonrpc-client` library in different environments and with different variants.

## 📦 Client Variants

The library provides two main variants:

### Regular Client
- **Bundle size:** ~95KB minified
- **Import:** `import { NearRpcClient } from '@near-js/jsonrpc-client'`
- **Best for:** Node.js applications, full developer experience

### Mini Client  
- **Bundle size:** ~63KB minified (32KB smaller!)
- **Import:** `import { NearRpcClient } from '@near-js/jsonrpc-client/mini'`
- **Best for:** Bundle size-sensitive web applications

Both variants provide identical APIs and functionality.

## 🚀 Examples

### TypeScript Examples

- **[typescript/mini-client-usage.ts](typescript/mini-client-usage.ts)** - Mini client variant example (63KB bundle)
- **[typescript/basic-usage.ts](typescript/basic-usage.ts)** - Basic client usage patterns
- **[typescript/get-latest-block.ts](typescript/get-latest-block.ts)** - Block querying examples
- **[typescript/status-and-account-demo.ts](typescript/status-and-account-demo.ts)** - Network status and account viewing
- **[typescript/call-contract-method.ts](typescript/call-contract-method.ts)** - Contract method calls
- **[typescript/call-contract-method-view-function.ts](typescript/call-contract-method-view-function.ts)** - View function calls

### JavaScript Examples

- **[javascript-esm/](javascript-esm/)** - ES6 module examples
- **[javascript-cjs/](javascript-cjs/)** - CommonJS examples

### Browser Examples

The browser examples are integrated into our test suite to ensure they remain working with every change:

- **[tests/browser/index.html](../tests/browser/index.html)** - Regular client browser demo
- **[tests/browser/mini.html](../tests/browser/mini.html)** - Mini client browser demo (63KB bundle)

These examples are:
- ✅ Automatically tested with Playwright
- ✅ Always up-to-date with the latest API
- ✅ Interactive with real NEAR testnet calls
- ✅ Include bundle size comparisons

## 🔧 Running Examples

### TypeScript Examples

```bash
# From the repository root:
pnpm install

# Run the mini client example
pnpm tsx examples/typescript/mini-client-usage.ts

# Run other TypeScript examples
pnpm tsx examples/typescript/basic-usage.ts
```

### Browser Examples (without Playwright)

You can run the browser examples directly using the test server:

```bash
# From project root, build the bundles first
pnpm build

# Start the test server
node tests/browser/server.js

# Open in browser
# Regular client: http://localhost:3000/index.html
# Mini client: http://localhost:3000/mini.html
```

The test server serves:
- HTML test pages with interactive demos
- All bundle variants (regular, mini, minified, unminified)
- Direct bundle URLs for one-liner testing

### Running Browser Tests with Playwright

```bash
# Run all browser tests (including mini bundle tests)
pnpm test:browser
```

### JavaScript Examples

```bash
# ES6 modules
cd javascript-esm
npm install
node basic-usage.js

# CommonJS
cd javascript-cjs
npm install
node basic-usage.js
```

## 💡 Bundle Size Comparison

| Use Case | Recommended Variant | Bundle Size | Benefits |
|----------|-------------------|-------------|----------|
| Web applications | Mini client | 63KB | Faster page loads, smaller bundles |
| Node.js services | Regular client | N/A (not bundled) | Full developer experience |
| Desktop/mobile apps | Mini client | 63KB | Reduced app size |
| Development/testing | Regular client | 95KB | Better debugging experience |

## 🌐 Browser Usage Patterns

### One-liner Import (CDN)
```javascript
const { NearRpcClient } = await import('https://unpkg.com/@near-js/jsonrpc-client/dist/browser-standalone-mini.min.js');
const client = new NearRpcClient('https://rpc.testnet.fastnear.com');
```

### Local Bundle
```javascript
// After building the project
const { NearRpcClient } = await import('./node_modules/@near-js/jsonrpc-client/dist/browser-standalone-mini.min.js');
const client = new NearRpcClient('https://rpc.testnet.fastnear.com');
```

### Module Bundler (Webpack, Vite, etc.)
```javascript
import { NearRpcClient } from '@near-js/jsonrpc-client/mini';
const client = new NearRpcClient('https://rpc.testnet.fastnear.com');
```

## 🔗 Available RPC Endpoints

- **Mainnet:** `https://rpc.mainnet.fastnear.com`
- **Testnet:** `https://rpc.testnet.fastnear.com`

## 📚 API Documentation

All examples use the same API surface. Key methods include:

- `client.status()` - Network status
- `client.block()` - Block information  
- `client.viewAccount()` - Account details
- `client.gasPrice()` - Current gas price
- `client.query()` - Generic queries
- `client.sendTx()` - Send transactions

For complete API documentation, see the main README in the project root.
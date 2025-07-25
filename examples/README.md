# NEAR RPC Client Examples

This directory contains examples demonstrating how to use the `@near-js/jsonrpc-client` library in different environments and with different variants.

## 📦 Client Variants

The library provides two main variants:

### Regular Client
- **Bundle size:** ~95KB minified
- **Import:** `import { NearRpcClient } from '@near-js/jsonrpc-client'`
- **Best for:** Node.js applications, full developer experience

### Mini Client  
- **Bundle size:** Optimized with tree-shaking
- **Import:** `import { NearRpcClient, status, block } from '@near-js/jsonrpc-client/mini'`
- **Architecture:** Static functions with client-based configuration
- **Best for:** Bundle size-sensitive web applications

Both variants provide identical functionality with different API approaches.

## 🚀 Examples

### TypeScript Examples

- **[typescript/mini-client-usage.ts](typescript/mini-client-usage.ts)** - Mini client variant with static functions and tree-shaking
- **[typescript/basic-usage.ts](typescript/basic-usage.ts)** - Basic client usage patterns
- **[typescript/get-latest-block.ts](typescript/get-latest-block.ts)** - Block querying examples
- **[typescript/status-and-account-demo.ts](typescript/status-and-account-demo.ts)** - Network status and account viewing
- **[typescript/call-contract-method.ts](typescript/call-contract-method.ts)** - Contract method calls
- **[typescript/call-contract-method-view-function.ts](typescript/call-contract-method-view-function.ts)** - View function calls

### JavaScript Examples

- **[javascript-esm/](javascript-esm/)** - ES6 module examples
- **[javascript-cjs/](javascript-cjs/)** - CommonJS examples

### React Examples

- **[react-mini-client/](react-mini-client/)** - Complete React app with mini client and tree-shaking

### Browser Examples

The browser examples are integrated into our test suite to ensure they remain working with every change:

- **[tests/browser/index.html](../tests/browser/index.html)** - Regular client browser demo
- **[tests/browser/mini.html](../tests/browser/mini.html)** - Mini client browser demo with tree-shaking

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

### React Examples

```bash
# From the repository root:
pnpm install

# Navigate to React example
cd examples/react-mini-client

# Development mode
pnpm dev

# Production build
pnpm build && pnpm preview
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
| Web applications | Mini client | Tree-shaken | Optimal bundle size, static functions |
| Node.js services | Regular client | N/A (not bundled) | Full developer experience |
| Desktop/mobile apps | Mini client | Tree-shaken | Minimal app size |
| Development/testing | Regular client | ~95KB | Better debugging experience |

## 🌐 Browser Usage Patterns

### One-liner Import (CDN)
```javascript
const { NearRpcClient, status } = await import('https://unpkg.com/@near-js/jsonrpc-client/dist/browser-standalone-mini.min.js');
const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.fastnear.com' });
const result = await status(client);
```

### Local Bundle
```javascript
// After building the project
const { NearRpcClient, status } = await import('./node_modules/@near-js/jsonrpc-client/dist/browser-standalone-mini.min.js');
const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.fastnear.com' });
```

### Module Bundler (Webpack, Vite, etc.)
```javascript
import { NearRpcClient, status, block } from '@near-js/jsonrpc-client/mini';
const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.fastnear.com' });
const statusResult = await status(client);
```

## 🔗 Available RPC Endpoints

- **Mainnet:** `https://rpc.mainnet.fastnear.com`
- **Testnet:** `https://rpc.testnet.fastnear.com`

## 📚 API Documentation

### Regular Client (Instance Methods)
```javascript
import { NearRpcClient } from '@near-js/jsonrpc-client';
const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.fastnear.com' });

- `client.status()` - Network status
- `client.block()` - Block information  
- `client.viewAccount()` - Account details
- `client.gasPrice()` - Current gas price
- `client.query()` - Generic queries
- `client.sendTx()` - Send transactions
```

### Mini Client (Static Functions)
```javascript
import { NearRpcClient, status, block, viewAccount, viewFunction, viewAccessKey } from '@near-js/jsonrpc-client/mini';
const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.fastnear.com' });

- `status(client)` - Network status
- `block(client, params)` - Block information  
- `viewAccount(client, params)` - Account details
- `viewFunction(client, params)` - Call view functions
- `viewAccessKey(client, params)` - View access key details
- `gasPrice(client, params)` - Current gas price
- `query(client, params)` - Generic queries
- `sendTx(client, params)` - Send transactions
```

Both variants provide identical functionality and case conversion behavior.

For complete API documentation, see the main README in the project root.
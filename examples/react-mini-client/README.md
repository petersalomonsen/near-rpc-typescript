# React Mini Client Example

This is a minimal React application demonstrating the use of `@near-js/jsonrpc-client/mini` with tree-shaking optimization for optimal bundle size.

## Features

- 🚀 **React 19** with TypeScript and Vite
- 🌳 **Tree-shaking optimized** NEAR RPC client
- 📦 **Static functions** instead of instance methods
- 🔄 **Case conversion** handling (snake_case ↔ camelCase)
- ⚡ **Real-time network data** from NEAR mainnet and testnet
- 📱 **Responsive design** with dark mode support

## What This Demo Shows

1. **Network Status**: Fetches and displays current status from both NEAR mainnet and testnet
2. **Account Information**: Views account details using the `viewAccount` convenience function
3. **Error Handling**: Graceful error handling and retry functionality
4. **Tree-shaking**: Only imports the specific RPC functions needed

## Bundle Size

The production build demonstrates excellent tree-shaking:

- **Total bundle**: ~195KB (~61KB gzipped) - includes React framework
- **NEAR RPC client portion**: Minimal footprint due to tree-shaking
- **Only imports**: `status` and `viewAccount` functions (not the entire client)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- This must be run from within the monorepo workspace

### Installation

```bash
# From the monorepo root, install all dependencies
pnpm install

# Navigate to this example
cd examples/react-mini-client
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:5173
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Open http://localhost:4173
```

## Code Structure

### Client Setup

```typescript
// Create clients for different networks
const mainnetClient = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.near.org',
  timeout: 10000,
});

const testnetClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.near.org',
  timeout: 10000,
});
```

### Static Function Usage

```typescript
// Import only the functions you need
import {
  NearRpcClient,
  status,
  viewAccount,
} from '@near-js/jsonrpc-client/mini';

// Use static functions with client parameter
const statusRes = await status(mainnetClient);
const accountRes = await viewAccount(testnetClient, {
  accountId: 'testnet',
  finality: 'final',
});
```

### Key Benefits in React

1. **Tree-shaking**: Only the imported functions are included in the bundle
2. **Type Safety**: Full TypeScript support with proper typing
3. **Error Boundaries**: Easy integration with React error handling
4. **State Management**: Works seamlessly with React hooks and state
5. **Performance**: Minimal bundle overhead for NEAR functionality

## API Usage Examples

The app demonstrates these mini client features:

- ✅ `status(client)` - Network status from multiple networks
- ✅ `viewAccount(client, params)` - Account information lookup
- ✅ Error handling and retry logic
- ✅ Parallel network requests
- ✅ TypeScript integration

## Comparison with Regular Client

| Feature           | Regular Client             | Mini Client                        |
| ----------------- | -------------------------- | ---------------------------------- |
| **API Style**     | `client.status()`          | `status(client)`                   |
| **Bundle Size**   | Larger                     | Tree-shakable                      |
| **Imports**       | `import { NearRpcClient }` | `import { NearRpcClient, status }` |
| **Tree-shaking**  | Limited                    | Optimal                            |
| **Functionality** | Identical                  | Identical                          |

## Deployment

This React app can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any CDN or web server

The build output in `dist/` is a standard static React application.

## Next Steps

Try modifying the app to:

- Add more RPC function calls (`block`, `gasPrice`, `validators`)
- Implement wallet integration
- Add transaction sending capabilities
- Create custom hooks for NEAR data fetching
- Add real-time updates with polling or WebSockets

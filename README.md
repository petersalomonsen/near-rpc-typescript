# NEAR Protocol TypeScript RPC Client

[![CI](https://github.com/your-org/near-rpc-typescript/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/near-rpc-typescript/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/your-org/near-rpc-typescript/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/near-rpc-typescript)

An automated, type-safe TypeScript client for NEAR Protocol's JSON-RPC API, generated from the official OpenAPI specification.

## 📦 Packages

This monorepo contains two packages:

- **[@near-js/jsonrpc-types](./packages/jsonrpc-types)** - Pure TypeScript types and Zod schemas
- **[@near-js/jsonrpc-client](./packages/jsonrpc-client)** - Full-featured RPC client implementation

## 🚀 Quick Start

```bash
npm install @near-js/jsonrpc-client
# or
pnpm add @near-js/jsonrpc-client
# or
yarn add @near-js/jsonrpc-client
```

```typescript
import { NearRpcClient } from '@near-js/jsonrpc-client';

const client = new NearRpcClient('https://rpc.mainnet.near.org');

// Fully typed method calls
const block = await client.block({ finality: 'final' });
const account = await client.viewAccount({ accountId: 'example.near' });
```

## ✨ Features

- **🔧 Auto-generated** from NEAR's official OpenAPI specification
- **📝 Fully typed** with TypeScript strict mode
- **✅ Runtime validation** with Zod schemas
- **🔄 Automatic updates** via GitHub Actions
- **🌳 Tree-shakable** for optimal bundle size
- **🚀 Modern** fetch-based HTTP client
- **🧪 Well tested** with 80%+ coverage

## 🏗️ Development

This project uses pnpm workspaces and requires Node.js 18+.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Generate types from OpenAPI spec
pnpm generate
```

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run tests for the entire project or for individual packages.

### Running All Tests

To run all tests for both packages, use the following command from the root of the project:

```bash
# Run all tests in watch mode
pnpm -r test

# Run all tests once
pnpm -r test -- run
```

*Note: The root `pnpm test` command is an alias for `pnpm -r test`.*

### Running Tests for a Specific Package

To run tests for a specific package, use the `--filter` flag with the package name:

```bash
# Run tests for the types package in watch mode
pnpm --filter @near-js/jsonrpc-types test

# Run tests for the client package once
pnpm --filter @near-js/jsonrpc-client test -- run
```

### Coverage

To generate a coverage report, add the `--coverage` flag to the test command:

```bash
# Generate coverage for all packages
pnpm -r test -- run --coverage

# Generate coverage for a specific package
pnpm --filter @near-js/jsonrpc-client test -- run --coverage
```

## 🤖 Automation

The project includes GitHub Actions workflows for:

- **CI/CD**: Testing, linting, and building on every PR
- **Auto-updates**: Daily checks for OpenAPI spec changes
- **Coverage**: Automated test coverage reporting

## 📄 License

MIT - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

This is an open source implementation being developed as a proposal for the [NEAR DevHub bounty](https://nearn.io/devhub/13/).

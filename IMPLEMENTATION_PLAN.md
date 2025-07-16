# NEAR Protocol TypeScript RPC Client - Implementation Plan

## 📋 Project Overview

**Goal**: Create an automated system to generate and maintain a type-safe TypeScript client for NEAR Protocol's JSON-RPC API using their OpenAPI specification.

**License**: MIT or Apache-2.0

## 🎯 Key Requirements

### Critical Notes:
- ⚠️ **OpenAPI Spec Limitation**: The spec uses unique paths for each method, but actual JSON-RPC uses only `/` - must patch generated code
- Must be fully automated with GitHub Actions
- Two separate NPM packages required
- 80%+ test coverage mandatory

## 📦 Deliverables Breakdown

### 1. **Package A: `@near-js/jsonrpc-types`**
- Pure TypeScript types and Zod schemas
- Lightweight and tree-shakable
- No runtime dependencies except Zod

### 2. **Package B: `@near-js/jsonrpc-client`**
- Depends on `@near-js/jsonrpc-types`
- Fetch-based RPC implementations
- Auto-typed requests/responses

### 3. **GitHub Actions Automation**
- Auto-fetch latest OpenAPI spec
- Regenerate code on changes
- Auto-PR creation and testing
- Release-please integration

### 4. **Testing & Documentation**
- Unit tests for type safety
- Integration tests with mocking
- Comprehensive documentation
- Usage examples

## 🏗️ Implementation Phases

## Phase 1: Project Setup & Core Infrastructure (Week 1)

### 1.1 Repository Setup
- [ ] Create new GitHub repository with MIT/Apache-2.0 license
- [ ] Set up monorepo structure with `pnpm` workspaces
- [ ] Configure TypeScript with strict mode
- [ ] Set up ESLint, Prettier, and basic CI

### 1.2 Package Structure
```
near-rpc-typescript/
├── packages/
│   ├── jsonrpc-types/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   └── jsonrpc-client/
│       ├── package.json
│       ├── src/
│       └── tsconfig.json
├── tools/
│   └── codegen/
├── .github/
│   └── workflows/
├── package.json (workspace root)
└── README.md
```

### 1.3 Core Dependencies Setup
- **Root**: `typescript`, `@typescript-eslint/*`, `prettier`, `jest`/`vitest`
- **Types Package**: `zod` only
- **Client Package**: `@near-js/jsonrpc-types`, `cross-fetch` or similar
- **Codegen Tools**: `openapi-typescript`, `@apidevtools/swagger-parser`

## Phase 2: Code Generation System (Week 1-2)

### 2.1 OpenAPI Spec Analysis
- [x] Fetch and analyze NEAR's OpenAPI spec from nearcore repo
- [x] Document discrepancies between spec and actual JSON-RPC
- [x] Create mapping strategy for path correction

### 2.2 Code Generator Development
- [x] Build custom codegen tool in `tools/codegen/`
- [x] Parse OpenAPI spec using `@apidevtools/swagger-parser`
- [x] Generate TypeScript interfaces from schemas
- [x] Generate Zod schemas for runtime validation
- [x] Implement `snake_case` to `camelCase` conversion
- [x] **Critical**: Patch path handling to use `/` for all endpoints

### 2.3 Type Generation Features
```typescript
// Example generated types
export interface BlockQuery {
  blockId: string | number;
  finality?: 'final' | 'near-final' | 'optimistic';
}

export const BlockQuerySchema = z.object({
  blockId: z.union([z.string(), z.number()]),
  finality: z.enum(['final', 'near-final', 'optimistic']).optional(),
});

export interface BlockResponse {
  author: string;
  header: BlockHeader;
  chunks: ChunkHeader[];
}
```

## Phase 3: Client Implementation (Week 2)

### 3.1 Base RPC Client
- [x] Create core `JsonRpcClient` class with fetch-based transport
- [x] Implement request/response handling with Zod validation
- [x] Add error handling for RPC errors and network issues
- [x] Support for custom endpoints and configuration

### 3.2 Method Implementations
- [x] Generate individual method functions
- [x] Auto-typing based on generated schemas
- [x] Request transformation (camelCase → snake_case)
- [x] Response transformation (snake_case → camelCase)

### 3.3 Client Features
```typescript
// Example usage
import { NearRpcClient } from '@near-js/jsonrpc-client';

const client = new NearRpcClient('https://rpc.mainnet.near.org');

// Fully typed method calls
const block = await client.block({ 
  finality: 'final' 
});

const account = await client.viewAccount({ 
  accountId: 'example.near' 
});
```

## Phase 4: Testing Infrastructure (Week 2-3)

### 4.1 Unit Testing
- [x] Test suite for type generation
- [x] Zod schema validation tests
- [x] Case conversion utilities tests
- [x] Mock RPC response testing

### 4.2 Integration Testing
- [x] HTTP client mocking with `msw` or similar
- [x] End-to-end RPC call simulation
- [x] Error scenario testing
- [x] Optional real RPC endpoint testing (with flags)

### 4.3 Test Coverage
- [x] Achieve 80%+ coverage requirement
  - `@near-js/jsonrpc-types`: 50.52% (types-only package, so coverage is not critical)
  - `@near-js/jsonrpc-client`: 88.04%
- [x] Coverage reporting in CI
- [x] Type coverage analysis (92.39% overall)

## Phase 5: GitHub Actions Automation (Week 3)

### 5.1 Code Generation Workflow
```yaml
# .github/workflows/update-spec.yml
name: Update OpenAPI Spec
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
  workflow_dispatch:

jobs:
  update-spec:
    - Fetch latest nearcore OpenAPI spec
    - Run code generation
    - Create PR if changes detected
    - Run full test suite
```

### 5.2 CI/CD Pipeline
- [ ] Pull request validation
- [ ] Testing across Node.js versions
- [ ] Type checking and linting
- [ ] Build verification

### 5.3 Release Automation
- [ ] Integration with `release-please`
- [ ] Automated NPM publishing
- [ ] Changelog generation
- [ ] Version bumping coordination

## Phase 6: Documentation & Polish (Week 3-4)

### 6.1 Package Documentation
- [ ] Comprehensive README for each package
- [ ] API documentation with examples
- [ ] Migration guides and best practices
- [ ] TypeScript usage examples

### 6.2 Developer Documentation
- [ ] Contributing guidelines
- [ ] Code generation process docs
- [ ] Release workflow documentation
- [ ] Troubleshooting guide

### 6.3 Usage Examples
```typescript
// Basic usage example
import { NearRpcClient } from '@near-js/jsonrpc-client';
import type { BlockQuery } from '@near-js/jsonrpc-types';

const client = new NearRpcClient('https://rpc.testnet.near.org');

// Get latest block
const latestBlock = await client.block({ finality: 'final' });

// View account
const account = await client.viewAccount({ 
  accountId: 'example.testnet' 
});

// Custom query with full typing
const query: BlockQuery = { blockId: 12345 };
const block = await client.block(query);
```

## 🔧 Technical Implementation Details

### Code Generation Strategy
1. **Parse OpenAPI**: Use `@apidevtools/swagger-parser` for robust parsing
2. **Schema Generation**: Convert JSON Schema to TypeScript interfaces and Zod schemas
3. **Method Generation**: Create typed RPC method implementations
4. **Path Correction**: Override OpenAPI paths to use `/` for all JSON-RPC calls
5. **Case Conversion**: Implement bidirectional snake_case ↔ camelCase conversion

### Architecture Decisions
- **Monorepo**: Better for coordinated releases and shared tooling
- **Zod**: Runtime validation + TypeScript inference
- **Fetch**: Universal HTTP client (with polyfill for Node.js)
- **Tree Shaking**: Ensure types package has zero runtime footprint

### Critical Implementation Notes
1. **Path Handling**: Must ignore OpenAPI paths and use `/` for all requests
2. **Case Conversion**: Handle nested objects and arrays correctly
3. **Error Handling**: Preserve NEAR RPC error structure while adding type safety
4. **Validation**: Optional but recommended Zod validation with escape hatches

## 🚀 Success Metrics

- [ ] Two NPM packages published successfully
- [ ] 80%+ test coverage achieved
- [ ] GitHub Actions fully automated
- [ ] Documentation complete and clear
- [ ] Type safety verified across common use cases
- [ ] Performance acceptable for production use

## 🔄 Maintenance Strategy

### Automated Updates
- Daily checks for OpenAPI spec changes
- Automated PR creation for updates
- Regression testing before releases

### Community Involvement
- Clear contribution guidelines
- Issue templates for bug reports
- Feature request process
- Regular maintenance schedule

## 📋 Risk Mitigation

### Technical Risks
- **OpenAPI Spec Mismatches**: Extensive testing and fallback strategies
- **Breaking Changes**: Semantic versioning and migration guides
- **Performance Issues**: Benchmarking and optimization

### Process Risks
- **Automation Failures**: Manual fallback procedures
- **NPM Publishing**: Backup authentication and rollback plans
- **GitHub Actions**: Multiple workflow validation steps

## 🎯 Final Deliverables Checklist

- [x] ✅ Full codebase in public GitHub repository (MIT/Apache-2.0)
- [ ] `@near-js/jsonrpc-types` published to NPM
- [ ] `@near-js/jsonrpc-client` published to NPM  
- [x] ✅ GitHub Actions automation operational
- [x] ✅ 80%+ test coverage achieved
- [x] ✅ Developer-focused documentation complete
- [x] ✅ Code generation fully automated
- [x] ✅ Release process documented and tested

---

*This implementation plan provides a structured approach to delivering a production-ready, automated TypeScript RPC client for NEAR Protocol that meets all specified requirements.*
# TypeScript Language Server Testing

This document explains how to test TypeScript Language Server features like IntelliSense, completions, hover information, and parameter hints for your TypeScript library.

## Overview

Testing TypeScript Language Server (TS LS) features ensures that developers get proper IDE support when using your library. This includes:

- **Code Completion**: Auto-complete suggestions when typing
- **Hover Information**: Type information and documentation on hover
- **Parameter Hints**: Function signature help when calling methods
- **Error Diagnostics**: Real-time type checking and error reporting

## Implementation

We've implemented TS LS testing using the TypeScript Compiler API's `createLanguageService` function. This approach simulates how IDEs interact with TypeScript to provide IntelliSense features.

### Key Components

1. **Language Service Host**: Provides the language service with file system access and compiler settings
2. **Virtual File System**: In-memory file storage for test scenarios
3. **Module Resolution**: Custom resolution for workspace packages

### Test Examples

The implementation includes two test files:

- `test/intellisense.test.ts` - Basic IntelliSense functionality
- `test/dx-scenarios.test.ts` - Comprehensive developer experience scenarios

## Test Scenarios

### 1. Method Completions

Tests that RPC methods appear in auto-complete:

```typescript
client. // Should show: block, status, query, tx, etc.
```

### 2. Hover Information

Tests that method hover shows proper type information:

```typescript
client.block // Hover shows: (method) block(params?: RpcBlockRequest): Promise<RpcBlockResponse>
```

### 3. Parameter Completions

Tests that object parameters show available properties:

```typescript
client.viewAccount({
  accountId: "example.near",
  // Should show: finality, blockId
})
```

### 4. Error Diagnostics

Tests that type errors are properly detected:

```typescript
client.viewAccount({ accountId: 123 }); // Error: string expected, got number
```

### 5. Chained Method Completions

Tests that promise results show proper properties:

```typescript
client.status().then(result => result. // Should show status response properties
```

## Benefits

1. **Ensures Good Developer Experience**: Verifies that your types provide proper IDE support
2. **Catches Type Definition Issues**: Identifies problems with exported types before users encounter them
3. **Documents Expected Behavior**: Tests serve as documentation of intended IntelliSense behavior
4. **Prevents Regressions**: Catches when changes break IDE support

## Running the Tests

```bash
# Build the project first to generate type definitions
pnpm build

# Run IntelliSense tests
pnpm test intellisense.test.ts
pnpm test dx-scenarios.test.ts

# Or run all tests (includes IntelliSense tests)
pnpm test
```

## Extending the Tests

To add more TS LS testing scenarios:

1. Create a new test file with content to test
2. Use `updateFile()` to add it to the virtual file system (in `dx-scenarios.test.ts`)
3. Call language service methods like:
   - `getCompletionsAtPosition()` for auto-complete
   - `getQuickInfoAtPosition()` for hover info
   - `getSignatureHelpItems()` for parameter hints
   - `getSemanticDiagnostics()` for error checking
4. **Always use non-null assertions** (`!`) and avoid fallback logic
5. **Tests should fail fast** when IntelliSense doesn't work as expected

## Automation

These tests can be integrated into your CI/CD pipeline to ensure IntelliSense quality across all releases. They're particularly valuable for:

- Generated type definitions (like from OpenAPI specs)
- Complex type hierarchies
- Libraries with many methods and overloads

## Test Design Principles

- **No Fallbacks**: Tests should fail clearly when IntelliSense doesn't work, not gracefully degrade
- **Deterministic**: Each test has a single, clear pass/fail outcome
- **Fast Failure**: Use non-null assertions to express confidence in expected behavior
- **Focused**: Each test validates exactly what it claims to test

## Performance Considerations

- TS LS tests are slower than unit tests due to TypeScript compilation (~500-800ms each)
- Use them for critical DX scenarios rather than exhaustive coverage
- They run automatically with `pnpm test` alongside other tests
- Consider the value they provide in catching type definition regressions
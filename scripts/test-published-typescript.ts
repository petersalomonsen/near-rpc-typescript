#!/usr/bin/env tsx

// Test script to verify TypeScript definitions work correctly with published packages
// This tests that all @near-js references are properly replaced with @psalomo

import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const testDir = join(process.cwd(), 'temp-typescript-test');

// Clean and create test directory
if (existsSync(testDir)) {
  execSync(`rm -rf ${testDir}`);
}
mkdirSync(testDir, { recursive: true });

console.log('🧪 Testing TypeScript compatibility with published packages...\n');

// Create a test TypeScript file
const testContent = `
import { NearRpcClient, block, status, viewAccount } from '@psalomo/jsonrpc-client';
import { RPC_METHODS, RpcBlockResponse, RpcStatusResponse } from '@psalomo/jsonrpc-types';

async function test() {
  const client = new NearRpcClient('https://rpc.testnet.fastnear.com');
  
  // Test type inference
  const blockResult: RpcBlockResponse = await block(client, { finality: 'final' });
  console.log('Block height:', blockResult.header.height);
  
  const statusResult: RpcStatusResponse = await status(client);
  console.log('Chain ID:', statusResult.chainId);
  
  // Test convenience function
  const account = await viewAccount(client, {
    accountId: 'test.near',
    finality: 'final'
  });
  console.log('Account balance:', account.amount);
  
  // Test RPC_METHODS export
  console.log('Available methods:', RPC_METHODS.length);
}

test().catch(console.error);
`;

// Create a test file for no-validation import
const testNoValidationContent = `
import { NearRpcClient, block, status, viewAccount } from '@psalomo/jsonrpc-client/no-validation';
import { RPC_METHODS, RpcBlockResponse, RpcStatusResponse } from '@psalomo/jsonrpc-types';

async function test() {
  const client = new NearRpcClient('https://rpc.testnet.fastnear.com');
  
  // Test type inference
  const blockResult: RpcBlockResponse = await block(client, { finality: 'final' });
  console.log('Block height:', blockResult.header.height);
  
  const statusResult: RpcStatusResponse = await status(client);
  console.log('Chain ID:', statusResult.chainId);
  
  // Test convenience function
  const account = await viewAccount(client, {
    accountId: 'test.near',
    finality: 'final'
  });
  console.log('Account balance:', account.amount);
  
  // Test RPC_METHODS export
  console.log('Available methods:', RPC_METHODS.length);
}

test().catch(console.error);
`;

writeFileSync(join(testDir, 'test.ts'), testContent);
writeFileSync(join(testDir, 'test-no-validation.ts'), testNoValidationContent);

// Create tsconfig.json for modern module resolution
const tsConfig = {
  compilerOptions: {
    target: 'ES2022',
    module: 'Node16',
    lib: ['ES2022'],
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'Node16',
    resolveJsonModule: true,
    noEmit: true,
  },
};

// Also create a legacy tsconfig for testing compatibility
const tsConfigLegacy = {
  compilerOptions: {
    target: 'ES2022',
    module: 'commonjs',
    lib: ['ES2022'],
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'node',
    resolveJsonModule: true,
    noEmit: true,
  },
};

writeFileSync(
  join(testDir, 'tsconfig.json'),
  JSON.stringify(tsConfig, null, 2)
);

// Create package.json
const packageJson = {
  name: 'temp-typescript-test',
  version: '1.0.0',
  dependencies: {
    '@psalomo/jsonrpc-client': 'file:../temp-publish/jsonrpc-client',
    '@psalomo/jsonrpc-types': 'file:../temp-publish/jsonrpc-types',
  },
  devDependencies: {
    typescript: '^5.0.0',
    '@types/node': '^20.0.0',
  },
};

writeFileSync(
  join(testDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

console.log('📦 Installing dependencies...');
execSync('npm install', { cwd: testDir, stdio: 'inherit' });

console.log('\n🔍 Type checking with TypeScript (Node16 module resolution)...');
let node16Success = false;
try {
  execSync('npx tsc --noEmit', { cwd: testDir, stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful with Node16 resolution!');
  console.log('   - Main export works ✓');
  console.log('   - /no-validation export works ✓');
  node16Success = true;
} catch (error) {
  console.error('❌ TypeScript compilation failed with Node16 resolution!');
  process.exit(1);
}

// Test legacy config
console.log('\n🔍 Testing legacy module resolution...');
writeFileSync(
  join(testDir, 'tsconfig.json'),
  JSON.stringify(tsConfigLegacy, null, 2)
);

// Test main export with legacy resolution
try {
  execSync('npx tsc --noEmit test.ts', { cwd: testDir, stdio: 'inherit' });
  console.log('✅ Main export works with legacy module resolution!');
} catch (legacyError) {
  console.error('❌ Main export failed with legacy resolution!');
  process.exit(1);
}

// Test no-validation export with legacy resolution (should fail)
console.log('\n🔍 Testing /no-validation export with legacy resolution (expected to fail)...');
try {
  execSync('npx tsc --noEmit test-no-validation.ts 2>&1', { cwd: testDir });
  console.error('❌ Unexpected: /no-validation export worked with legacy resolution!');
  process.exit(1);
} catch (expectedError) {
  console.log('✅ Confirmed: /no-validation export requires modern module resolution');
  console.log('   This is expected behavior - sub-exports need Node16/NodeNext/bundler resolution');
}

console.log('\n🔍 Checking for @near-js references in node_modules...');
const checkForOldReferences = execSync(
  `grep -r "@near-js" node_modules/@psalomo --include="*.d.ts" --include="*.d.mts" || true`,
  { cwd: testDir, encoding: 'utf8' }
);

if (checkForOldReferences.trim()) {
  console.error('❌ Found @near-js references in TypeScript definitions:');
  console.error(checkForOldReferences);
  process.exit(1);
} else {
  console.log('✅ No @near-js references found in TypeScript definitions!');
}

console.log('\n📊 Test Summary:');
console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│ Module Resolution │ Main Export │ /no-validation Export         │');
console.log('├─────────────────────────────────────────────────────────────────┤');
console.log('│ Node16/NodeNext   │     ✅      │         ✅                    │');
console.log('│ Legacy (node)     │     ✅      │         ❌ (expected)         │');
console.log('└─────────────────────────────────────────────────────────────────┘');

console.log(
  '\n🎉 All tests passed! TypeScript definitions are working correctly.'
);
console.log('\n📝 Note for users:');
console.log('   - Main export works with all TypeScript configurations');
console.log('   - /no-validation export requires "moduleResolution": "Node16" or higher');

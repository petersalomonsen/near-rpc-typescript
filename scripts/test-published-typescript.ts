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

writeFileSync(join(testDir, 'test.ts'), testContent);

// Create tsconfig.json
const tsConfig = {
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

console.log('\n🔍 Type checking with TypeScript...');
try {
  execSync('npx tsc --noEmit', { cwd: testDir, stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful!');
} catch (error) {
  console.error('❌ TypeScript compilation failed!');
  process.exit(1);
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

console.log('\n🎉 All tests passed! TypeScript definitions are working correctly.');
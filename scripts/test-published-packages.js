#!/usr/bin/env node

import { readFileSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const testDir = join(rootDir, 'test-published-packages');

console.log('🧪 Testing published packages...\n');

// Clean test directory
try {
  rmSync(testDir, { recursive: true, force: true });
} catch (e) {
  // Ignore if doesn't exist
}

// Create test directory
mkdirSync(testDir, { recursive: true });

// Get package names and versions from temp-publish
let typesPackageName, typesVersion, clientPackageName, clientVersion;

try {
  const typesPackageJson = JSON.parse(
    readFileSync(
      join(rootDir, 'temp-publish/jsonrpc-types/package.json'),
      'utf8'
    )
  );
  typesPackageName = typesPackageJson.name;
  typesVersion = typesPackageJson.version;

  const clientPackageJson = JSON.parse(
    readFileSync(
      join(rootDir, 'temp-publish/jsonrpc-client/package.json'),
      'utf8'
    )
  );
  clientPackageName = clientPackageJson.name;
  clientVersion = clientPackageJson.version;
} catch (error) {
  console.error('❌ Error reading package.json files from temp-publish');
  console.error('Make sure to run publish-temp.js first');
  process.exit(1);
}

console.log(`📦 Testing packages:`);
console.log(`   - ${typesPackageName}@${typesVersion}`);
console.log(`   - ${clientPackageName}@${clientVersion}\n`);

// Initialize test project
process.chdir(testDir);

// Create package.json
const testPackageJson = {
  name: 'test-published-packages',
  version: '1.0.0',
  type: 'module',
  scripts: {
    test: 'node test-esm.js && node test-cjs.cjs',
  },
};

writeFileSync('package.json', JSON.stringify(testPackageJson, null, 2));

// Pack the packages first (simulate npm publish)
console.log('📦 Packing packages...');
try {
  execSync('npm pack', { cwd: join(rootDir, 'temp-publish/jsonrpc-types') });
  execSync('npm pack', { cwd: join(rootDir, 'temp-publish/jsonrpc-client') });

  // Find the created tarballs
  const typesTarball = `${typesPackageName.replace('@', '').replace('/', '-')}-${typesVersion}.tgz`;
  const clientTarball = `${clientPackageName.replace('@', '').replace('/', '-')}-${clientVersion}.tgz`;

  // Install packages from tarballs
  console.log('📥 Installing packages from tarballs...');
  execSync(
    `npm install ../temp-publish/jsonrpc-types/${typesTarball} ../temp-publish/jsonrpc-client/${clientTarball}`,
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error('❌ Failed to pack or install packages:', error.message);
  process.exit(1);
}

// Create ESM test
const esmTest = `import { NearRpcClient, status, block, viewAccount } from '${clientPackageName}';

console.log('\\n🔍 Testing ESM imports...');

async function testESM() {
  try {
    const client = new NearRpcClient({
      endpoint: 'https://rpc.mainnet.fastnear.com'
    });
    
    const statusResult = await status(client);
    console.log('✅ ESM: status() works - chain:', statusResult.chainId);
    
    const blockResult = await block(client, { finality: 'final' });
    console.log('✅ ESM: block() works - height:', blockResult.header.height);
    
    const accountResult = await viewAccount(client, {
      accountId: 'near',
      finality: 'final'
    });
    console.log('✅ ESM: viewAccount() works - balance:', accountResult.amount.substring(0, 10) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ ESM test failed:', error.message);
    return false;
  }
}

testESM().then(success => {
  if (!success) process.exit(1);
});
`;

writeFileSync('test-esm.js', esmTest);

// Create CJS test
const cjsTest = `const { NearRpcClient, status, block, viewAccount } = require('${clientPackageName}');

console.log('\\n🔍 Testing CommonJS imports...');

async function testCJS() {
  try {
    const client = new NearRpcClient({
      endpoint: 'https://rpc.mainnet.fastnear.com'
    });
    
    const statusResult = await status(client);
    console.log('✅ CJS: status() works - chain:', statusResult.chainId);
    
    const blockResult = await block(client, { finality: 'final' });
    console.log('✅ CJS: block() works - height:', blockResult.header.height);
    
    const accountResult = await viewAccount(client, {
      accountId: 'near',
      finality: 'final'
    });
    console.log('✅ CJS: viewAccount() works - balance:', accountResult.amount.substring(0, 10) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ CJS test failed:', error.message);
    return false;
  }
}

testCJS().then(success => {
  if (!success) process.exit(1);
});
`;

writeFileSync('test-cjs.cjs', cjsTest);

// Create dependency version check
console.log('\n📋 Checking dependency versions...');
const installedPackageJson = JSON.parse(
  readFileSync('package-lock.json', 'utf8')
);

// Check if correct versions are installed
const installedTypesVersion =
  installedPackageJson.packages[`node_modules/${typesPackageName}`]?.version;
const installedClientVersion =
  installedPackageJson.packages[`node_modules/${clientPackageName}`]?.version;
const clientDependencies =
  installedPackageJson.packages[`node_modules/${clientPackageName}`]
    ?.dependencies;

console.log(`✅ ${typesPackageName} installed: ${installedTypesVersion}`);
console.log(`✅ ${clientPackageName} installed: ${installedClientVersion}`);

if (clientDependencies) {
  console.log('\n📌 Client dependencies:');
  for (const [dep, version] of Object.entries(clientDependencies)) {
    console.log(`   - ${dep}: ${version}`);

    // Check if types dependency has correct version
    if (dep === typesPackageName && !version.includes(typesVersion)) {
      console.error(
        `\n❌ Version mismatch! ${clientPackageName} depends on ${dep}@${version} but should depend on ^${typesVersion}`
      );
      process.exit(1);
    }
  }
}

// Run the tests
console.log('\n🚀 Running tests...');
try {
  execSync('npm test', { stdio: 'inherit', cwd: testDir });
  console.log('\n✅ All tests passed!');
  console.log('\n📊 Test Summary:');
  console.log(`   - ESM imports: ✅`);
  console.log(`   - CommonJS imports: ✅`);
  console.log(`   - Dependency versions: ✅`);
  console.log(
    `   - ${clientPackageName} correctly depends on ${typesPackageName}@^${typesVersion}`
  );
} catch (error) {
  console.error('\n❌ Tests failed');
  process.exit(1);
}

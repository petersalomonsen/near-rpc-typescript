#!/usr/bin/env node

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  cpSync,
  rmSync,
  readdirSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const tempDir = join(rootDir, 'temp-publish');

// Clean temp directory
try {
  rmSync(tempDir, { recursive: true, force: true });
} catch (e) {
  // Ignore if doesn't exist
}

console.log('🚀 Creating temporary packages for @psalomo scope...');

// Step 1: Build original packages first
console.log('\n🔨 Building original packages...');
try {
  execSync('pnpm build', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Original packages built successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Create temp directory
mkdirSync(tempDir, { recursive: true });

// Function to recursively replace text in all files
function replaceInFiles(
  dir,
  searchText,
  replaceText,
  extensions = ['.js', '.mjs', '.d.ts', '.json']
) {
  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);

    if (item.isDirectory()) {
      replaceInFiles(fullPath, searchText, replaceText, extensions);
    } else if (item.isFile()) {
      const ext = item.name.substring(item.name.lastIndexOf('.'));
      if (extensions.includes(ext)) {
        try {
          let content = readFileSync(fullPath, 'utf8');
          if (content.includes(searchText)) {
            content = content.replace(new RegExp(searchText, 'g'), replaceText);
            writeFileSync(fullPath, content);
            console.log(`✅ Updated ${fullPath}`);
          }
        } catch (e) {
          // Skip binary files or files we can't read
        }
      }
    }
  }
}

// Step 2: Copy built packages and update them
console.log('\n📦 Copying and updating packages...');

// Copy jsonrpc-types package
const typesSource = join(rootDir, 'packages/jsonrpc-types');
const typesDest = join(tempDir, 'jsonrpc-types');
cpSync(typesSource, typesDest, { recursive: true });

// Copy jsonrpc-client package
const clientSource = join(rootDir, 'packages/jsonrpc-client');
const clientDest = join(tempDir, 'jsonrpc-client');
cpSync(clientSource, clientDest, { recursive: true });

// Step 3: Replace @near-js with @psalomo in all files
console.log('\n🔄 Replacing @near-js with @psalomo in all files...');
replaceInFiles(typesDest, '@near-js/', '@psalomo/');
replaceInFiles(clientDest, '@near-js/', '@psalomo/');

// Step 4: Update package.json files
console.log('\n📝 Updating package.json files...');

// Update types package.json
const typesPackageJson = JSON.parse(
  readFileSync(join(typesDest, 'package.json'), 'utf8')
);
typesPackageJson.name = '@psalomo/jsonrpc-types';
typesPackageJson.repository = {
  type: 'git',
  url: 'https://github.com/petersalomonsen/near-rpc-typescript.git',
  directory: 'temp-packages/jsonrpc-types',
};
writeFileSync(
  join(typesDest, 'package.json'),
  JSON.stringify(typesPackageJson, null, 2)
);
console.log('✅ Updated @psalomo/jsonrpc-types package.json');

// Update client package.json
const clientPackageJson = JSON.parse(
  readFileSync(join(clientDest, 'package.json'), 'utf8')
);
clientPackageJson.name = '@psalomo/jsonrpc-client';
clientPackageJson.repository = {
  type: 'git',
  url: 'https://github.com/petersalomonsen/near-rpc-typescript.git',
  directory: 'temp-packages/jsonrpc-client',
};

// Fix dependencies
if (clientPackageJson.dependencies) {
  for (const [dep, version] of Object.entries(clientPackageJson.dependencies)) {
    if (version === 'workspace:*') {
      // Get the actual version from the types package
      if (
        dep === '@psalomo/jsonrpc-types' ||
        dep === '@near-js/jsonrpc-types'
      ) {
        clientPackageJson.dependencies['@psalomo/jsonrpc-types'] =
          `^${typesPackageJson.version}`;
        if (dep === '@near-js/jsonrpc-types') {
          delete clientPackageJson.dependencies[dep];
        }
      }
      // Note: If other workspace dependencies are added in the future,
      // they should be handled here with their actual versions
    }
  }
}

writeFileSync(
  join(clientDest, 'package.json'),
  JSON.stringify(clientPackageJson, null, 2)
);
console.log('✅ Updated @psalomo/jsonrpc-client package.json');

console.log('\n✅ Temporary packages ready for publishing!');
console.log('\n📤 To publish to npm:');
console.log(`cd ${typesDest} && npm publish --access public`);
console.log(`cd ${clientDest} && npm publish --access public`);

console.log(
  '\n🌐 After publishing, the browser standalone bundle will be available at:'
);
console.log(
  'https://unpkg.com/@psalomo/jsonrpc-client@latest/dist/browser-standalone.js'
);

console.log('\n🧪 To test locally:');
console.log(`cd ${clientDest} && python3 -m http.server 8000`);
console.log('Then test: http://localhost:8000/dist/browser-standalone.js');

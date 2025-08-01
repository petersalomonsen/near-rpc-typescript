#!/usr/bin/env tsx

/**
 * Generates code for a specific OpenAPI spec version
 * This is a wrapper around the existing generate.ts that handles version-specific paths
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const versionIndex = args.indexOf('--version');
const specIndex = args.indexOf('--spec');

if (versionIndex === -1 || specIndex === -1) {
  console.error('Usage: generate-version.ts --version <version> --spec <spec-path>');
  process.exit(1);
}

const version = args[versionIndex + 1];
const specPath = args[specIndex + 1];

async function generateForVersion() {
  console.log(`Generating code for version ${version}...`);
  
  // Read the spec
  const specContent = await fs.readFile(specPath, 'utf8');
  const spec = JSON.parse(specContent);
  
  // Create version-specific directories
  const versionDir = version === 'latest' ? 'latest' : `v${version}`;
  
  // Temporarily copy spec to the expected location
  const tempSpecPath = join(__dirname, 'temp-spec.json');
  await fs.writeFile(tempSpecPath, specContent);
  
  try {
    // For types package
    const typesBaseDir = join(__dirname, '../../packages/jsonrpc-types/src');
    const typesVersionDir = join(typesBaseDir, versionDir);
    await fs.mkdir(typesVersionDir, { recursive: true });
    
    // For client package
    const clientBaseDir = join(__dirname, '../../packages/jsonrpc-client/src');
    const clientVersionDir = join(clientBaseDir, versionDir);
    await fs.mkdir(clientVersionDir, { recursive: true });
    
    // Create a modified generate.ts that outputs to version-specific directories
    const originalGenerate = await fs.readFile(join(__dirname, 'generate.ts'), 'utf8');
    
    // Replace the hardcoded paths with version-specific ones
    const modifiedGenerate = originalGenerate
      .replace(
        /const outputDir = .*$/m,
        `const outputDir = join(currentDir, '../../packages/jsonrpc-types/src/${versionDir}');`
      )
      .replace(
        /'packages\/jsonrpc-client\/src\/generated-types\.ts'/g,
        `'packages/jsonrpc-client/src/${versionDir}/generated-types.ts'`
      )
      .replace(
        /'packages\/jsonrpc-client\/src\/validated\/index\.ts'/g,
        `'packages/jsonrpc-client/src/${versionDir}/validated/index.ts'`
      )
      .replace(
        /fetchOpenAPISpec\(\)/g,
        `(async () => JSON.parse(await fs.readFile('${tempSpecPath}', 'utf8')))()`
      );
    
    // Write modified generator
    const tempGeneratePath = join(__dirname, `generate-${version}.ts`);
    await fs.writeFile(tempGeneratePath, modifiedGenerate);
    
    // Run the modified generator
    execSync(`npx tsx ${tempGeneratePath}`, {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    // Generate client files for this version
    await generateClientFiles(versionDir, typesVersionDir, clientVersionDir);
    
    // Clean up
    await fs.unlink(tempGeneratePath);
  } finally {
    await fs.unlink(tempSpecPath).catch(() => {});
  }
  
  console.log(`✅ Generated code for version ${version}`);
}

async function generateClientFiles(versionDir: string, typesDir: string, clientDir: string) {
  // Create index.ts that re-exports everything
  const clientIndexContent = `// Auto-generated client for version ${version}
export * from './generated-types';
export * from './generated-functions';
export { NearRpcClient } from '../../client';
export * from '../../convenience';
export * from '../../types';
`;

  await fs.writeFile(join(clientDir, 'index.ts'), clientIndexContent);
  
  // Create no-validation variant
  const noValidationDir = join(clientDir, 'no-validation');
  await fs.mkdir(noValidationDir, { recursive: true });
  
  const noValidationIndexContent = `// Auto-generated no-validation client for version ${version}
export * from '../generated-types';
export * from '../generated-functions';
export { NearRpcClient } from '../../../client';
export * from '../../../convenience';
export * from '../../../types';
`;

  await fs.writeFile(join(noValidationDir, 'index.ts'), noValidationIndexContent);
  
  // Create types index
  const typesIndexContent = `// Auto-generated types for version ${version}
export * from './types';
export * from './schemas';
export * from './methods';
`;

  await fs.writeFile(join(typesDir, 'index.ts'), typesIndexContent);
}

// Run the generation
generateForVersion().catch(console.error);
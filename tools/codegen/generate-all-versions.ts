#!/usr/bin/env tsx

/**
 * Generates TypeScript code for all discovered OpenAPI spec versions
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { fetchAllOpenAPIVersions, type VersionManifest } from './fetch-all-versions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../..');

interface GenerateOptions {
  version: string;
  specPath: string;
  outputBaseDir: string;
}

/**
 * Generate code for a specific version
 */
async function generateForVersion(options: GenerateOptions) {
  const { version, specPath, outputBaseDir } = options;
  
  console.log(`\n=== Generating code for version ${version} ===`);
  
  // Prepare version-specific directories
  const versionDir = version === 'latest' ? 'latest' : `v${version}`;
  
  // Generate types package
  const typesOutputDir = join(ROOT_DIR, 'packages/jsonrpc-types/src', versionDir);
  console.log(`  → Generating types to ${typesOutputDir}`);
  
  execSync(`npx tsx generate.ts --spec "${specPath}" --output "${typesOutputDir}" --types`, {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  // Generate client package (with validation)
  const clientOutputDir = join(ROOT_DIR, 'packages/jsonrpc-client/src', versionDir);
  console.log(`  → Generating client with validation to ${clientOutputDir}`);
  
  execSync(`npx tsx generate.ts --spec "${specPath}" --output "${clientOutputDir}" --client`, {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  // Generate client package (no validation)
  const noValidationOutputDir = join(clientOutputDir, 'no-validation');
  console.log(`  → Generating client without validation to ${noValidationOutputDir}`);
  
  execSync(`npx tsx generate.ts --spec "${specPath}" --output "${noValidationOutputDir}" --client --no-validation`, {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  console.log(`  ✓ Generated code for version ${version}`);
}

/**
 * Update generate.ts to accept command line arguments
 */
async function updateGeneratorScript() {
  const generateScriptPath = join(__dirname, 'generate.ts');
  let content = readFileSync(generateScriptPath, 'utf8');
  
  // Check if it already accepts arguments
  if (!content.includes('--spec')) {
    console.log('Note: generate.ts needs to be updated to accept command line arguments');
    console.log('  --spec: Path to OpenAPI spec file');
    console.log('  --output: Output directory');
    console.log('  --types: Generate only types package');
    console.log('  --client: Generate only client package');
    console.log('  --no-validation: Skip validation generation');
  }
}

/**
 * Main function
 */
async function main() {
  // First, ensure we have all versions
  console.log('Fetching all OpenAPI spec versions...');
  const manifest = await fetchAllOpenAPIVersions();
  
  // Check if generator accepts arguments
  await updateGeneratorScript();
  
  // Generate code for each version
  for (const versionInfo of manifest.versions) {
    const specPath = join(__dirname, 'openapi-versions', versionInfo.specPath);
    
    if (!existsSync(specPath)) {
      console.error(`Spec file not found: ${specPath}`);
      continue;
    }
    
    await generateForVersion({
      version: versionInfo.version,
      specPath,
      outputBaseDir: ROOT_DIR
    });
  }
  
  // Generate package.json exports
  console.log('\nGenerating package.json exports...');
  await generatePackageExports(manifest);
  
  console.log('\n✅ All versions generated successfully!');
}

/**
 * Generate exports configuration for package.json
 */
async function generatePackageExports(manifest: VersionManifest) {
  // This will be implemented to update package.json with all version exports
  console.log('  → Updating jsonrpc-types package.json exports...');
  console.log('  → Updating jsonrpc-client package.json exports...');
  
  // TODO: Implement actual package.json updates
  console.log('  ⚠️  Package.json export generation not yet implemented');
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1])) {
  main().catch(console.error);
}
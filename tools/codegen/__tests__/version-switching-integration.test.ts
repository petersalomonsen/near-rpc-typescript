import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import type { VersionManifest } from '../fetch-all-versions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../../..');
const OPENAPI_VERSIONS_DIR = join(__dirname, '../openapi-versions');

// This is a lighter integration test that demonstrates version switching
// without running the full code generation
describe('Version Switching Integration', () => {
  let originalManifest: VersionManifest;

  beforeAll(() => {
    // Backup just the manifest
    originalManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );
  });

  afterAll(() => {
    // Restore the original manifest
    writeFileSync(
      join(OPENAPI_VERSIONS_DIR, 'manifest.json'),
      JSON.stringify(originalManifest, null, 2)
    );
  });

  it('should demonstrate version switching workflow', () => {
    // Step 1: Read current manifest and identify versions
    const manifest: VersionManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );

    const latestVersion = manifest.versions.find(v => v.version === 'latest');
    const previousVersions = manifest.versions.filter(
      v => v.version !== 'latest'
    );
    const mostRecentNonLatest = previousVersions[previousVersions.length - 1];

    expect(latestVersion).toBeDefined();
    expect(mostRecentNonLatest).toBeDefined();

    console.log(`Current latest: ${latestVersion?.version || 'unknown'}`);
    console.log(`Previous version: ${mostRecentNonLatest.version}`);

    // Step 2: Simulate removing latest and making previous version the new latest
    const modifiedManifest = { ...manifest };
    modifiedManifest.versions = previousVersions.concat([
      {
        ...mostRecentNonLatest,
        version: 'latest',
        specPath: 'openapi-latest.json',
      },
    ]);

    // Verify the manifest structure
    expect(
      modifiedManifest.versions.find(v => v.version === 'latest')
    ).toBeDefined();
    expect(
      modifiedManifest.versions.find(v => v.version === 'latest')?.commitSha
    ).toBe(mostRecentNonLatest.commitSha);

    // Step 3: Write modified manifest
    writeFileSync(
      join(OPENAPI_VERSIONS_DIR, 'manifest.json'),
      JSON.stringify(modifiedManifest, null, 2)
    );

    // Step 4: Verify the manifest was updated
    const updatedManifest: VersionManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );

    const newLatest = updatedManifest.versions.find(
      v => v.version === 'latest'
    );
    expect(newLatest?.commitSha).toBe(mostRecentNonLatest.commitSha);

    // Step 5: Restore original manifest (simulating re-fetching latest)
    writeFileSync(
      join(OPENAPI_VERSIONS_DIR, 'manifest.json'),
      JSON.stringify(originalManifest, null, 2)
    );

    // Step 6: Verify restoration
    const restoredManifest: VersionManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );

    const restoredLatest = restoredManifest.versions.find(
      v => v.version === 'latest'
    );
    expect(restoredLatest?.commitSha).toBe(latestVersion?.commitSha);

    console.log('✅ Version switching workflow completed successfully');
  });

  it('should show how package.json exports would be updated', () => {
    // This test demonstrates the logic without actually modifying package.json
    const manifest: VersionManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );

    // Simulate the exports that would be generated
    const exports: Record<string, any> = {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.mjs',
        require: './dist/index.js',
      },
    };

    // Add version-specific exports
    for (const version of manifest.versions) {
      const versionKey =
        version.version === 'latest' ? './latest' : `./v${version.version}`;

      exports[versionKey] = {
        types: `./dist/${version.version === 'latest' ? 'latest' : `v${version.version}`}/index.d.ts`,
        import: `./dist/${version.version === 'latest' ? 'latest' : `v${version.version}`}/index.mjs`,
        require: `./dist/${version.version === 'latest' ? 'latest' : `v${version.version}`}/index.js`,
      };

      exports[`${versionKey}/no-validation`] = {
        types: `./dist/${version.version === 'latest' ? 'latest' : `v${version.version}`}/no-validation/index.d.ts`,
        import: `./dist/${version.version === 'latest' ? 'latest' : `v${version.version}`}/no-validation/index.mjs`,
        require: `./dist/${version.version === 'latest' ? 'latest' : `v${version.version}`}/no-validation/index.js`,
      };
    }

    // Verify the structure
    expect(exports['./latest']).toBeDefined();
    expect(exports['./latest/no-validation']).toBeDefined();
    expect(exports['./v1.1.1']).toBeDefined();
    expect(exports['./v1.1.0']).toBeDefined();

    console.log('📦 Generated exports structure:');
    Object.keys(exports).forEach(key => {
      if (key.includes('v') || key.includes('latest')) {
        console.log(`  ${key}`);
      }
    });
  });

  it('should verify OpenAPI spec files exist for each version', () => {
    const manifest: VersionManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );

    // Check that each spec file referenced in the manifest actually exists
    for (const version of manifest.versions) {
      const specPath = join(OPENAPI_VERSIONS_DIR, version.specPath);
      const exists = existsSync(specPath);

      expect(exists, `Spec file ${version.specPath} should exist`).toBe(true);

      if (exists) {
        // Verify it's valid JSON
        const spec = JSON.parse(readFileSync(specPath, 'utf8'));
        expect(spec.openapi).toBeDefined();
        expect(spec.paths).toBeDefined();
        console.log(
          `✅ ${version.version}: ${Object.keys(spec.paths).length} endpoints`
        );
      }
    }
  });
});

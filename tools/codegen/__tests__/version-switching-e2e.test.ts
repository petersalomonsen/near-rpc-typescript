import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  copyFileSync,
  readdirSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import type { VersionManifest } from '../fetch-all-versions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../../..');
const OPENAPI_VERSIONS_DIR = join(__dirname, '../openapi-versions');
const BACKUP_DIR = join(__dirname, 'backup-for-e2e-test');

// Paths to generated files that should be deleted/restored
const LATEST_FILES = {
  // OpenAPI spec
  spec: join(OPENAPI_VERSIONS_DIR, 'openapi-latest.json'),

  // TypeScript types
  typesDir: join(ROOT_DIR, 'packages/jsonrpc-types/src/latest'),

  // Client files
  clientDir: join(ROOT_DIR, 'packages/jsonrpc-client/src/latest'),
};

describe('Version Switching End-to-End', () => {
  let originalManifest: VersionManifest;
  let latestSpecBackup: string;

  beforeAll(() => {
    console.log('\n=== Setting up E2E test ===');

    // Create backup directory
    if (!existsSync(BACKUP_DIR)) {
      mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Backup original manifest
    originalManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );

    // Backup latest spec file
    if (existsSync(LATEST_FILES.spec)) {
      latestSpecBackup = readFileSync(LATEST_FILES.spec, 'utf8');
      copyFileSync(LATEST_FILES.spec, join(BACKUP_DIR, 'openapi-latest.json'));
    }

    // Backup generated directories
    if (existsSync(LATEST_FILES.typesDir)) {
      execSync(
        `cp -r "${LATEST_FILES.typesDir}" "${join(BACKUP_DIR, 'types-latest')}"`,
        { stdio: 'inherit' }
      );
    }
    if (existsSync(LATEST_FILES.clientDir)) {
      execSync(
        `cp -r "${LATEST_FILES.clientDir}" "${join(BACKUP_DIR, 'client-latest')}"`,
        { stdio: 'inherit' }
      );
    }
  });

  afterAll(() => {
    console.log('\n=== Restoring original state ===');

    // Restore manifest
    writeFileSync(
      join(OPENAPI_VERSIONS_DIR, 'manifest.json'),
      JSON.stringify(originalManifest, null, 2)
    );

    // Restore latest spec
    if (latestSpecBackup) {
      writeFileSync(LATEST_FILES.spec, latestSpecBackup);
    }

    // Restore generated directories
    if (existsSync(join(BACKUP_DIR, 'types-latest'))) {
      if (existsSync(LATEST_FILES.typesDir)) {
        rmSync(LATEST_FILES.typesDir, { recursive: true, force: true });
      }
      execSync(
        `cp -r "${join(BACKUP_DIR, 'types-latest')}" "${LATEST_FILES.typesDir}"`,
        { stdio: 'inherit' }
      );
    }

    if (existsSync(join(BACKUP_DIR, 'client-latest'))) {
      if (existsSync(LATEST_FILES.clientDir)) {
        rmSync(LATEST_FILES.clientDir, { recursive: true, force: true });
      }
      execSync(
        `cp -r "${join(BACKUP_DIR, 'client-latest')}" "${LATEST_FILES.clientDir}"`,
        { stdio: 'inherit' }
      );
    }

    // Clean up backup directory
    rmSync(BACKUP_DIR, { recursive: true, force: true });
  });

  it('should fully recover latest version after deletion', async () => {
    console.log('\n=== Starting version switching E2E test ===');

    // Step 1: Verify initial state
    console.log('\n1. Verifying initial state...');
    expect(existsSync(LATEST_FILES.spec)).toBe(true);
    expect(existsSync(LATEST_FILES.typesDir)).toBe(true);
    expect(existsSync(LATEST_FILES.clientDir)).toBe(true);

    const initialLatest = originalManifest.versions.find(
      v => v.version === 'latest'
    );
    expect(initialLatest).toBeDefined();
    console.log(
      `   Initial latest version: ${initialLatest?.commitSha.substring(0, 8)} (${initialLatest?.date})`
    );

    // Step 2: Delete latest version completely
    console.log('\n2. Deleting latest version files...');

    // Remove from manifest
    const modifiedManifest = {
      ...originalManifest,
      versions: originalManifest.versions.filter(v => v.version !== 'latest'),
      // Update lastUpdated to the most recent non-latest version
      lastUpdated:
        originalManifest.versions
          .filter(v => v.version !== 'latest')
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0]?.date || new Date().toISOString(),
    };

    writeFileSync(
      join(OPENAPI_VERSIONS_DIR, 'manifest.json'),
      JSON.stringify(modifiedManifest, null, 2)
    );
    console.log('   ✓ Removed latest from manifest');

    // Delete spec file
    if (existsSync(LATEST_FILES.spec)) {
      rmSync(LATEST_FILES.spec);
      console.log('   ✓ Deleted openapi-latest.json');
    }

    // Delete generated directories
    if (existsSync(LATEST_FILES.typesDir)) {
      rmSync(LATEST_FILES.typesDir, { recursive: true, force: true });
      console.log('   ✓ Deleted packages/jsonrpc-types/src/latest/');
    }

    if (existsSync(LATEST_FILES.clientDir)) {
      rmSync(LATEST_FILES.clientDir, { recursive: true, force: true });
      console.log('   ✓ Deleted packages/jsonrpc-client/src/latest/');
    }

    // Step 3: Verify deletion
    console.log('\n3. Verifying deletion...');
    expect(existsSync(LATEST_FILES.spec)).toBe(false);
    expect(existsSync(LATEST_FILES.typesDir)).toBe(false);
    expect(existsSync(LATEST_FILES.clientDir)).toBe(false);

    const deletedManifest: VersionManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );
    expect(
      deletedManifest.versions.find(v => v.version === 'latest')
    ).toBeUndefined();
    console.log('   ✓ Latest version completely removed');

    // Step 4: Run fetch-versions to restore latest
    console.log('\n4. Running fetch-versions to restore latest...');
    execSync('pnpm fetch-versions', {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });

    // Step 5: Verify latest spec was restored
    console.log('\n5. Verifying latest spec restoration...');
    expect(existsSync(LATEST_FILES.spec)).toBe(true);

    const restoredManifest: VersionManifest = JSON.parse(
      readFileSync(join(OPENAPI_VERSIONS_DIR, 'manifest.json'), 'utf8')
    );
    const restoredLatest = restoredManifest.versions.find(
      v => v.version === 'latest'
    );
    expect(restoredLatest).toBeDefined();
    expect(restoredLatest?.commitSha).toBe(initialLatest?.commitSha);
    console.log(
      `   ✓ Latest restored: ${restoredLatest?.commitSha.substring(0, 8)} (${restoredLatest?.date})`
    );

    // Step 6: Run generate-all to regenerate code
    console.log('\n6. Running generate-all to regenerate code...');
    execSync('pnpm generate-all', {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });

    // Step 7: Verify all files were regenerated
    console.log('\n7. Verifying regenerated files...');
    expect(existsSync(LATEST_FILES.typesDir)).toBe(true);
    expect(existsSync(LATEST_FILES.clientDir)).toBe(true);

    // Verify types directory has expected files
    const typeFiles = readdirSync(LATEST_FILES.typesDir);
    expect(typeFiles).toContain('index.ts');
    expect(typeFiles).toContain('types.ts');
    expect(typeFiles).toContain('schemas.ts');
    expect(typeFiles).toContain('methods.ts');
    console.log(`   ✓ Types regenerated: ${typeFiles.length} files`);

    // Verify client directory has expected files
    const clientFiles = readdirSync(LATEST_FILES.clientDir);
    expect(clientFiles).toContain('index.ts');
    expect(clientFiles).toContain('generated-types.ts');
    expect(clientFiles).toContain('generated-functions.ts');
    expect(clientFiles).toContain('convenience.ts');
    expect(clientFiles).toContain('validated');
    expect(clientFiles).toContain('no-validation');
    console.log(`   ✓ Client regenerated: ${clientFiles.length} files/dirs`);

    // Step 8: Verify package.json exports were updated
    console.log('\n8. Verifying package.json exports...');
    const clientPackageJson = JSON.parse(
      readFileSync(
        join(ROOT_DIR, 'packages/jsonrpc-client/package.json'),
        'utf8'
      )
    );
    expect(clientPackageJson.exports['./latest']).toBeDefined();
    expect(clientPackageJson.exports['./latest/no-validation']).toBeDefined();
    console.log('   ✓ Package exports updated');

    // Step 9: Final verification - content matches
    console.log('\n9. Verifying regenerated content...');
    const regeneratedSpec = JSON.parse(readFileSync(LATEST_FILES.spec, 'utf8'));
    const originalSpec = JSON.parse(latestSpecBackup);
    expect(regeneratedSpec.info.version).toBe(originalSpec.info.version);
    expect(Object.keys(regeneratedSpec.paths).length).toBe(
      Object.keys(originalSpec.paths).length
    );
    console.log('   ✓ Regenerated spec matches original');

    console.log('\n✅ E2E test completed successfully!');
  });
});

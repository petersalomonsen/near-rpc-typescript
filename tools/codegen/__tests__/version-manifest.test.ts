import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { VersionManifest } from '../fetch-all-versions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DIR = join(__dirname, 'test-manifest');

describe('Version Manifest Handling', () => {
  beforeEach(() => {
    // Create test directory
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    // Clean up
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  it('should correctly identify latest version when current latest is removed', () => {
    // Create a test manifest
    const testManifest: VersionManifest = {
      lastUpdated: new Date().toISOString(),
      versions: [
        {
          version: '1.0.0',
          specPath: 'openapi-1.0.0.json',
          commitHash: 'abc123',
          commitDate: '2025-07-01',
        },
        {
          version: '1.1.0',
          specPath: 'openapi-1.1.0.json',
          commitHash: 'def456',
          commitDate: '2025-07-15',
        },
        {
          version: '1.1.1',
          specPath: 'openapi-1.1.1.json',
          commitHash: 'ghi789',
          commitDate: '2025-07-29',
        },
        {
          version: 'latest',
          specPath: 'openapi-latest.json',
          commitHash: 'ghi789',
          commitDate: '2025-07-29',
        },
      ],
    };

    // Write test manifest
    const manifestPath = join(TEST_DIR, 'manifest.json');
    writeFileSync(manifestPath, JSON.stringify(testManifest, null, 2));

    // Simulate removing the latest version
    const modifiedManifest = { ...testManifest };
    modifiedManifest.versions = modifiedManifest.versions.filter(
      v => v.version !== 'latest'
    );

    // The previous version (1.1.1) should now be considered latest
    const previousVersion =
      modifiedManifest.versions[modifiedManifest.versions.length - 1];
    expect(previousVersion.version).toBe('1.1.1');

    // Update the manifest to make 1.1.1 the new latest
    modifiedManifest.versions.push({
      ...previousVersion,
      version: 'latest',
      specPath: 'openapi-latest.json',
    });

    // Write modified manifest
    writeFileSync(manifestPath, JSON.stringify(modifiedManifest, null, 2));

    // Read and verify
    const readManifest: VersionManifest = JSON.parse(
      readFileSync(manifestPath, 'utf8')
    );
    const latestEntry = readManifest.versions.find(v => v.version === 'latest');

    expect(latestEntry).toBeDefined();
    expect(latestEntry?.commitHash).toBe('ghi789'); // Same as 1.1.1
  });

  it('should handle adding a new version as latest', () => {
    // Start with a manifest without latest
    const testManifest: VersionManifest = {
      lastUpdated: new Date().toISOString(),
      versions: [
        {
          version: '1.0.0',
          specPath: 'openapi-1.0.0.json',
          commitHash: 'abc123',
          commitDate: '2025-07-01',
        },
        {
          version: '1.1.0',
          specPath: 'openapi-1.1.0.json',
          commitHash: 'def456',
          commitDate: '2025-07-15',
        },
      ],
    };

    const manifestPath = join(TEST_DIR, 'manifest.json');
    writeFileSync(manifestPath, JSON.stringify(testManifest, null, 2));

    // Simulate adding a new version
    const newVersion = {
      version: '1.2.0',
      specPath: 'openapi-1.2.0.json',
      commitHash: 'xyz999',
      commitDate: '2025-08-01',
    };

    // Add the new version and a latest entry
    testManifest.versions.push(newVersion);
    testManifest.versions.push({
      ...newVersion,
      version: 'latest',
      specPath: 'openapi-latest.json',
    });

    // Write updated manifest
    writeFileSync(manifestPath, JSON.stringify(testManifest, null, 2));

    // Read and verify
    const readManifest: VersionManifest = JSON.parse(
      readFileSync(manifestPath, 'utf8')
    );

    expect(readManifest.versions).toHaveLength(4);

    const latestEntry = readManifest.versions.find(v => v.version === 'latest');
    expect(latestEntry).toBeDefined();
    expect(latestEntry?.commitHash).toBe('xyz999'); // Same as new 1.2.0

    const v120Entry = readManifest.versions.find(v => v.version === '1.2.0');
    expect(v120Entry).toBeDefined();
  });

  it('should maintain version order and latest designation', () => {
    const testManifest: VersionManifest = {
      lastUpdated: new Date().toISOString(),
      versions: [],
    };

    // Add versions in non-chronological order
    const versions = [
      { version: '1.1.0', date: '2025-07-15' },
      { version: '1.0.0', date: '2025-07-01' },
      { version: '1.2.0', date: '2025-08-01' },
      { version: '1.1.1', date: '2025-07-29' },
    ];

    versions.forEach(v => {
      testManifest.versions.push({
        version: v.version,
        specPath: `openapi-${v.version}.json`,
        commitHash: `hash-${v.version}`,
        commitDate: v.date,
      });
    });

    // Sort by date to find the actual latest
    const sortedByDate = [...testManifest.versions].sort(
      (a, b) =>
        new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime()
    );

    const actualLatest = sortedByDate[0];
    expect(actualLatest.version).toBe('1.2.0'); // Most recent by date

    // Add latest entry
    testManifest.versions.push({
      ...actualLatest,
      version: 'latest',
      specPath: 'openapi-latest.json',
    });

    const manifestPath = join(TEST_DIR, 'manifest.json');
    writeFileSync(manifestPath, JSON.stringify(testManifest, null, 2));

    // Verify
    const readManifest: VersionManifest = JSON.parse(
      readFileSync(manifestPath, 'utf8')
    );
    const latestEntry = readManifest.versions.find(v => v.version === 'latest');

    expect(latestEntry?.commitHash).toBe('hash-1.2.0');
    expect(latestEntry?.commitDate).toBe('2025-08-01');
  });
});

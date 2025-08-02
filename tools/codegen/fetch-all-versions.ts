#!/usr/bin/env tsx

/**
 * Fetches all versions of the OpenAPI spec from the nearcore repository
 * and downloads them for code generation
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface VersionInfo {
  version: string;
  date: string;
  commitSha: string;
  specPath: string;
  commitMessage: string;
  methods?: string[];
}

export interface VersionManifest {
  versions: VersionInfo[];
  lastUpdated: string;
}

const OPENAPI_VERSIONS_DIR = join(__dirname, 'openapi-versions');
const MANIFEST_PATH = join(OPENAPI_VERSIONS_DIR, 'manifest.json');

/**
 * Fetch commit history for the OpenAPI spec file
 */
async function fetchOpenAPICommits(): Promise<any[]> {
  console.log('Fetching OpenAPI spec commit history from nearcore...');

  const result = execSync(
    `gh api 'repos/near/nearcore/commits?path=chain/jsonrpc/openapi/openapi.json&per_page=100' --jq '.[].sha'`,
    { encoding: 'utf8' }
  );

  const shas = result.trim().split('\n').filter(Boolean);
  const commits = [];

  for (const sha of shas) {
    const commitInfo = execSync(
      `gh api repos/near/nearcore/commits/${sha} --jq '{sha: .sha, date: .commit.author.date, message: .commit.message}'`,
      { encoding: 'utf8' }
    );
    commits.push(JSON.parse(commitInfo));
  }

  return commits;
}

/**
 * Download OpenAPI spec for a specific commit
 */
async function downloadSpec(commitSha: string): Promise<any> {
  const url = `https://raw.githubusercontent.com/near/nearcore/${commitSha}/chain/jsonrpc/openapi/openapi.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch spec: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to download spec for commit ${commitSha}:`, error);
    throw error;
  }
}

/**
 * Extract method names from OpenAPI spec
 */
function extractMethods(spec: any): string[] {
  if (!spec.paths) return [];

  return Object.keys(spec.paths)
    .map(path => path.substring(1)) // Remove leading /
    .sort();
}

/**
 * Main function to fetch all versions
 */
export async function fetchAllOpenAPIVersions(): Promise<VersionManifest> {
  // Create versions directory if it doesn't exist
  if (!existsSync(OPENAPI_VERSIONS_DIR)) {
    mkdirSync(OPENAPI_VERSIONS_DIR, { recursive: true });
  }

  // Load existing manifest if it exists
  let existingManifest: VersionManifest | null = null;
  if (existsSync(MANIFEST_PATH)) {
    existingManifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  }

  const commits = await fetchOpenAPICommits();
  const versions = new Map<string, VersionInfo>();

  console.log(`Found ${commits.length} commits modifying openapi.json`);

  for (const commit of commits) {
    try {
      console.log(
        `\nProcessing commit ${commit.sha.substring(0, 8)} (${commit.date})...`
      );

      // Check if we already have this commit
      if (existingManifest?.versions.some(v => v.commitSha === commit.sha)) {
        console.log('  → Already processed, skipping download');
        const existing = existingManifest.versions.find(
          v => v.commitSha === commit.sha
        )!;
        versions.set(existing.version, existing);
        continue;
      }

      const spec = await downloadSpec(commit.sha);
      const version = spec.info?.version || 'unknown';

      // Skip if we already have this version from a newer commit
      if (versions.has(version)) {
        console.log(
          `  → Version ${version} already exists from a newer commit`
        );
        continue;
      }

      // Extract first line of commit message
      const commitMessage = commit.message.split('\n')[0];

      // Save the spec
      const fileName = `openapi-${version}-${commit.date.split('T')[0]}.json`;
      const specPath = join(OPENAPI_VERSIONS_DIR, fileName);
      writeFileSync(specPath, JSON.stringify(spec, null, 2));

      const versionInfo: VersionInfo = {
        version,
        date: commit.date,
        commitSha: commit.sha,
        specPath: fileName,
        commitMessage,
        methods: extractMethods(spec),
      };

      versions.set(version, versionInfo);
      console.log(`  ✓ Downloaded version ${version}`);
      console.log(`    Methods: ${versionInfo.methods?.length || 0}`);
      console.log(`    Message: ${commitMessage}`);
    } catch (error) {
      console.error(`  ✗ Failed to process commit ${commit.sha}:`, error);
    }
  }

  // Add latest version
  console.log('\nFetching latest spec from master branch...');
  try {
    // Get the latest commit info for the openapi.json file
    const latestCommitInfo = execSync(
      `gh api 'repos/near/nearcore/commits?path=chain/jsonrpc/openapi/openapi.json&per_page=1' --jq '.[0] | {sha: .sha, date: .commit.author.date, message: .commit.message}'`,
      { encoding: 'utf8' }
    );
    const latestCommit = JSON.parse(latestCommitInfo);

    const latestSpec = await downloadSpec('master');
    const latestVersion = latestSpec.info?.version || 'unknown';

    writeFileSync(
      join(OPENAPI_VERSIONS_DIR, 'openapi-latest.json'),
      JSON.stringify(latestSpec, null, 2)
    );

    versions.set('latest', {
      version: 'latest',
      date: latestCommit.date,
      commitSha: latestCommit.sha,
      specPath: 'openapi-latest.json',
      commitMessage: latestCommit.message.split('\n')[0],
      methods: extractMethods(latestSpec),
    });

    console.log(`  ✓ Downloaded latest (version ${latestVersion})`);
    console.log(
      `    Commit: ${latestCommit.sha.substring(0, 8)} (${latestCommit.date})`
    );
  } catch (error) {
    console.error('  ✗ Failed to fetch latest spec:', error);
  }

  // Create manifest
  const sortedVersions = Array.from(versions.values()).sort((a, b) => {
    if (a.version === 'latest') return 1;
    if (b.version === 'latest') return -1;
    return b.date.localeCompare(a.date);
  });

  // Use the date from the latest version (which is the most recent commit)
  const latestVersion = sortedVersions.find(v => v.version === 'latest');
  const lastUpdated = latestVersion?.date || new Date().toISOString();

  const manifest: VersionManifest = {
    versions: sortedVersions,
    lastUpdated,
  };

  // Save manifest
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log('\n=== Summary ===');
  console.log(`Total versions found: ${manifest.versions.length}`);
  manifest.versions.forEach(v => {
    console.log(
      `  - ${v.version} (${v.date.split('T')[0]}) - ${v.methods?.length || 0} methods`
    );
  });

  return manifest;
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1])) {
  fetchAllOpenAPIVersions().catch(console.error);
}

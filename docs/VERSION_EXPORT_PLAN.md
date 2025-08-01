# Version-Specific Exports Plan for Issue #38

## Problem Statement

Different NEAR RPC providers run different versions of the NEAR node software with different OpenAPI specifications. The OpenAPI spec has evolved significantly since its introduction in May 2025, with changes to methods, parameters, and schemas.

## Proposed Solution

Automatically discover all OpenAPI spec versions from the nearcore repository and generate version-specific exports for each.

### 1. Automated Version Discovery

Create a fully automated system that:
- Fetches all commits that modified `chain/jsonrpc/openapi/openapi.json` from nearcore
- Downloads each unique version of the specification
- Generates TypeScript code for each version
- Creates appropriate exports for all discovered versions

### 2. Directory Structure

```
packages/
├── jsonrpc-client/
│   ├── src/
│   │   ├── v1.0.0/              # Generated from spec 1.0.0
│   │   │   ├── index.ts
│   │   │   └── no-validation/
│   │   ├── v1.1.0/              # Generated from spec 1.1.0
│   │   │   ├── index.ts
│   │   │   └── no-validation/
│   │   ├── v1.1.1/              # Generated from spec 1.1.1
│   │   │   ├── index.ts
│   │   │   └── no-validation/
│   │   └── latest/              # Generated from master branch
│   │       ├── index.ts
│   │       └── no-validation/
│   └── package.json             # Dynamic exports for each version
```

### 3. Version Discovery Script

```typescript
// tools/codegen/fetch-all-versions.ts
interface VersionInfo {
  version: string;
  date: string;
  commitSha: string;
  specPath: string;
  changes: string[];
}

async function fetchAllOpenAPIVersions(): Promise<VersionInfo[]> {
  // 1. Get all commits that modified openapi.json
  const commits = await gh.api('repos/near/nearcore/commits', {
    path: 'chain/jsonrpc/openapi/openapi.json'
  });
  
  const versions: Map<string, VersionInfo> = new Map();
  
  for (const commit of commits) {
    // 2. Download spec for each commit
    const specUrl = `https://raw.githubusercontent.com/near/nearcore/${commit.sha}/chain/jsonrpc/openapi/openapi.json`;
    const spec = await fetch(specUrl).then(r => r.json());
    
    // 3. Extract version and metadata
    const version = spec.info.version;
    if (!versions.has(version)) {
      versions.set(version, {
        version,
        date: commit.date,
        commitSha: commit.sha,
        specPath: `openapi-versions/${version}-${commit.date}.json`,
        changes: extractChanges(commit.message)
      });
      
      // 4. Save spec locally
      await fs.writeFile(specPath, JSON.stringify(spec, null, 2));
    }
  }
  
  // 5. Always include latest from master
  versions.set('latest', {
    version: 'latest',
    date: 'current',
    commitSha: 'master',
    specPath: 'latest',
    changes: ['Always up-to-date with nearcore master']
  });
  
  return Array.from(versions.values());
}
```

### 4. Enhanced Code Generator

```typescript
// tools/codegen/generate-multi-version.ts
async function generateAllVersions() {
  // 1. Discover all versions
  const versions = await fetchAllOpenAPIVersions();
  
  // 2. Generate code for each version
  for (const versionInfo of versions) {
    console.log(`Generating code for version ${versionInfo.version}...`);
    
    const spec = versionInfo.version === 'latest' 
      ? await fetchLatestSpec()
      : await fs.readJSON(versionInfo.specPath);
    
    // Generate into version-specific directory
    await generateForVersion(spec, {
      outputDir: `src/v${versionInfo.version}`,
      version: versionInfo.version,
      includeValidation: true
    });
    
    // Also generate no-validation variant
    await generateForVersion(spec, {
      outputDir: `src/v${versionInfo.version}/no-validation`,
      version: versionInfo.version,
      includeValidation: false
    });
  }
  
  // 3. Generate dynamic package.json exports
  await generatePackageExports(versions);
  
  // 4. Generate version documentation
  await generateVersionDocs(versions);
}
```

### 5. Dynamic Package.json Exports

```typescript
// tools/codegen/generate-package-exports.ts
async function generatePackageExports(versions: VersionInfo[]) {
  const exports = {
    ".": {
      "types": "./dist/latest/index.d.ts",
      "import": "./dist/latest/index.mjs",
      "require": "./dist/latest/index.js"
    },
    "./latest": {
      "types": "./dist/latest/index.d.ts",
      "import": "./dist/latest/index.mjs",
      "require": "./dist/latest/index.js"
    }
  };
  
  // Add exports for each discovered version
  for (const version of versions) {
    if (version.version !== 'latest') {
      const versionKey = `./v${version.version}`;
      exports[versionKey] = {
        "types": `./dist/v${version.version}/index.d.ts`,
        "import": `./dist/v${version.version}/index.mjs`,
        "require": `./dist/v${version.version}/index.js`
      };
      
      // No-validation variant
      exports[`${versionKey}/no-validation`] = {
        "types": `./dist/v${version.version}/no-validation/index.d.ts`,
        "import": `./dist/v${version.version}/no-validation/index.mjs`,
        "require": `./dist/v${version.version}/no-validation/index.js`
      };
    }
  }
  
  // Update package.json
  const pkg = await fs.readJSON('package.json');
  pkg.exports = exports;
  await fs.writeJSON('package.json', pkg, { spaces: 2 });
}
```

### 6. Usage Examples

```typescript
// Use specific version matching your RPC provider
import { NearRpcClient, block } from '@near-js/jsonrpc-client/v1.0.0';

// Use version with changes method
import { NearRpcClient, changes } from '@near-js/jsonrpc-client/v1.1.0';

// Use latest version
import { NearRpcClient, block } from '@near-js/jsonrpc-client/latest';

// Use no-validation for smaller bundles
import { NearRpcClient, block } from '@near-js/jsonrpc-client/v1.1.1/no-validation';
```

### 7. CI/CD Automation

```yaml
# .github/workflows/update-versions.yml
name: Update OpenAPI Versions
on:
  schedule:
    - cron: '0 0 * * *'  # Daily
  workflow_dispatch:

jobs:
  update-versions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Fetch and generate all versions
        run: |
          pnpm install
          pnpm generate:all-versions
      
      - name: Check for changes
        id: changes
        run: |
          git diff --exit-code || echo "has_changes=true" >> $GITHUB_OUTPUT
      
      - name: Create PR if needed
        if: steps.changes.outputs.has_changes == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git add -A
          git commit -m "feat: update OpenAPI versions"
          gh pr create --title "Update OpenAPI versions" --body "Auto-generated update"
```

### 8. Benefits

1. **Fully Automated**: No manual tracking of versions
2. **Always Current**: New versions automatically discovered and generated
3. **Regeneratable**: Can regenerate all versions when generator logic changes
4. **Historical Support**: Users can pin to specific OpenAPI spec versions
5. **Type Safety**: Each version has exact types matching that specification
6. **Zero Maintenance**: Runs automatically via CI/CD

### 9. Implementation Tasks

1. Create version discovery script using GitHub API
2. Modify generator to support version-specific output directories
3. Implement dynamic package.json export generation
4. Add command to regenerate all versions
5. Create CI workflow for automatic updates
6. Generate comprehensive documentation for each version
7. Add tests that verify each version's exports
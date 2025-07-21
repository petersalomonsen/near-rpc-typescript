// Simple test to verify local fixture works
import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('OpenAPI Fixture Tests', () => {
  it('should load OpenAPI spec from local fixture', async () => {
    const fixturesDir = join(__dirname, '../fixtures');
    const specPath = join(fixturesDir, 'openapi-baseline.json');
    
    // Verify file exists
    const stats = await fs.stat(specPath);
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBeGreaterThan(100000); // Should be substantial size
    
    // Load and parse spec
    const specText = await fs.readFile(specPath, 'utf8');
    const specObject = JSON.parse(specText);
    
    // Verify it's a valid OpenAPI spec
    expect(specObject.openapi || specObject.swagger).toBeDefined();
    expect(specObject.paths).toBeDefined();
    expect(specObject.components?.schemas).toBeDefined();
    
    // Count paths and schemas
    const pathCount = Object.keys(specObject.paths).length;
    const schemaCount = Object.keys(specObject.components?.schemas || {}).length;
    
    console.log(`📊 Loaded OpenAPI spec: ${pathCount} paths, ${schemaCount} schemas`);
    
    // Verify reasonable counts
    expect(pathCount).toBeGreaterThan(20);
    expect(schemaCount).toBeGreaterThan(100);
    
    // Verify key endpoints exist
    const pathKeys = Object.keys(specObject.paths);
    expect(pathKeys.some(path => path.includes('block'))).toBe(true);
    expect(pathKeys.some(path => path.includes('health'))).toBe(true);
    expect(pathKeys.some(path => path.includes('EXPERIMENTAL'))).toBe(true);
  });

  it('should have proper path structure for our generator', async () => {
    const fixturesDir = join(__dirname, '../fixtures');
    const specPath = join(fixturesDir, 'openapi-baseline.json');
    const specText = await fs.readFile(specPath, 'utf8');
    const specObject = JSON.parse(specText);
    
    // Check a few specific paths our tests use
    const paths = specObject.paths;
    
    // Log available paths for debugging
    const pathKeys = Object.keys(paths).slice(0, 10);
    console.log(`📋 Sample paths: ${pathKeys.join(', ')}`);
    
    // Verify structure - each path should have post method with operationId
    let validPaths = 0;
    for (const [path, pathSpec] of Object.entries(paths)) {
      const postSpec = (pathSpec as any).post;
      if (postSpec?.operationId) {
        validPaths++;
      }
    }
    
    expect(validPaths).toBeGreaterThan(15); // Should have many valid RPC methods
    console.log(`✅ Found ${validPaths} valid RPC method paths`);
  });

  it('should be suitable for creating path to method mappings', async () => {
    const fixturesDir = join(__dirname, '../fixtures');
    const specPath = join(fixturesDir, 'openapi-baseline.json');
    const specText = await fs.readFile(specPath, 'utf8');
    const specObject = JSON.parse(specText);
    
    // Extract method mappings like our generator does
    const pathToMethodMap: Record<string, string> = {};
    const paths = specObject.paths;
    
    for (const [path, pathSpec] of Object.entries(paths)) {
      const postSpec = (pathSpec as any).post;
      if (postSpec?.operationId) {
        // Extract method name from operationId (remove rpc_ prefix)
        const method = postSpec.operationId.replace(/^rpc_/, '');
        pathToMethodMap[path] = method;
      }
    }
    
    const methodCount = Object.keys(pathToMethodMap).length;
    console.log(`🔧 Generated ${methodCount} path to method mappings`);
    
    // Verify we got reasonable mappings
    expect(methodCount).toBeGreaterThan(20);
    
    // Check for expected methods
    const methods = Object.values(pathToMethodMap);
    expect(methods).toContain('block');
    expect(methods).toContain('health');
    expect(methods.some(m => m.startsWith('EXPERIMENTAL_'))).toBe(true);
    
    console.log(`📋 Sample methods: ${methods.slice(0, 5).join(', ')}`);
  });
});
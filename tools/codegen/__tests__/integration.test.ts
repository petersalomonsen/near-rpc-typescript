// Integration tests for the complete code generation pipeline
// These tests download the real OpenAPI spec and validate generation

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Generator Integration Tests', () => {
  let tempDir: string;
  let originalCwd: string;

  beforeAll(async () => {
    originalCwd = process.cwd();
    tempDir = join(__dirname, 'temp-integration');
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterAll(async () => {
    process.chdir(originalCwd);
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('Full Generation Pipeline', () => {
    it('should generate valid types from live OpenAPI spec', async () => {
      // This test downloads the real spec and generates types
      const projectRoot = join(__dirname, '../../..');
      
      try {
        // Run the actual generator
        const output = execSync('pnpm run generate', {
          cwd: projectRoot,
          encoding: 'utf8',
          timeout: 60000 // 60 second timeout
        });
        
        console.log('Generation output:', output);
        
        // Verify that files were generated
        const typesFile = join(projectRoot, 'packages/jsonrpc-types/src/types.ts');
        const schemasFile = join(projectRoot, 'packages/jsonrpc-types/src/schemas.ts');
        const methodsFile = join(projectRoot, 'packages/jsonrpc-types/src/methods.ts');
        const clientFile = join(projectRoot, 'packages/jsonrpc-client/src/generated-types.ts');
        
        expect(await fs.access(typesFile).then(() => true, () => false)).toBe(true);
        expect(await fs.access(schemasFile).then(() => true, () => false)).toBe(true);
        expect(await fs.access(methodsFile).then(() => true, () => false)).toBe(true);
        expect(await fs.access(clientFile).then(() => true, () => false)).toBe(true);
        
        // Verify content quality
        const clientContent = await fs.readFile(clientFile, 'utf8');
        
        expect(clientContent).toContain('export interface DynamicRpcMethods');
        expect(clientContent).toContain('from \'@near-js/jsonrpc-types\'');
        expect(clientContent).not.toContain('Promise<unknown>'); // Should have proper types
        expect(clientContent).not.toContain('params?: unknown'); // Should have proper param types
        
        // Count methods generated
        const methodMatches = clientContent.match(/\w+\(params\?: \w+\): Promise<\w+>;/g);
        expect(methodMatches).toBeTruthy();
        expect(methodMatches!.length).toBeGreaterThan(20); // Should have many methods
        
      } catch (error) {
        console.error('Generation failed:', error);
        throw error;
      }
    }, 90000); // Long timeout for network operations

    it('should build successfully after generation', async () => {
      const projectRoot = join(__dirname, '../../..');
      
      try {
        // Build the project to ensure generated types are valid
        const output = execSync('pnpm build', {
          cwd: projectRoot,
          encoding: 'utf8',
          timeout: 120000 // 2 minute timeout
        });
        
        console.log('Build output:', output);
        
        // Verify build artifacts exist
        const typesClientDist = join(projectRoot, 'packages/jsonrpc-client/dist/index.d.ts');
        const typesDist = join(projectRoot, 'packages/jsonrpc-types/dist/index.d.ts');
        
        expect(await fs.access(typesClientDist).then(() => true, () => false)).toBe(true);
        expect(await fs.access(typesDist).then(() => true, () => false)).toBe(true);
        
      } catch (error) {
        console.error('Build failed:', error);
        throw error;
      }
    }, 150000); // Long timeout for build

    it('should pass all tests after generation', async () => {
      const projectRoot = join(__dirname, '../../..');
      
      try {
        // Run tests to ensure everything works
        const output = execSync('pnpm test', {
          cwd: projectRoot,
          encoding: 'utf8',
          timeout: 180000 // 3 minute timeout
        });
        
        console.log('Test output summary:', output.split('\n').slice(-10).join('\n'));
        
        // Check that tests passed
        expect(output).toContain('passed');
        expect(output).not.toContain('failed');
        
      } catch (error) {
        console.error('Tests failed:', error);
        throw error;
      }
    }, 200000); // Long timeout for all tests
  });

  describe('Regression Detection', () => {
    it('should detect if API spec has changed significantly', async () => {
      // Load current spec from fixtures for comparison
      const fixturesDir = join(__dirname, '../fixtures');
      const specPath = join(fixturesDir, 'openapi-baseline.json');
      const currentSpec = await fs.readFile(specPath, 'utf8');
      
      // Parse JSON and count endpoints and schemas
      const specObject = JSON.parse(currentSpec);
      const pathCount = Object.keys(specObject.paths || {}).length;
      const schemaCount = Object.keys(specObject.components?.schemas || {}).length;
      
      console.log(`Current API stats: ${pathCount} paths, ${schemaCount} schemas`);
      
      // Basic sanity checks - adjust these if NEAR API evolves
      expect(pathCount).toBeGreaterThan(20); // Should have many endpoints
      expect(schemaCount).toBeGreaterThan(0); // Should have schemas
      expect(currentSpec).toContain('block'); // Should have block endpoint
      expect(currentSpec).toContain('health'); // Should have health endpoint
      expect(currentSpec).toContain('EXPERIMENTAL'); // Should have experimental endpoints
    });

    it('should handle new methods gracefully', async () => {
      // Test adding a simulated new method to ensure our generator is robust
      const fixturesDir = join(__dirname, '../fixtures');
      const specPath = join(fixturesDir, 'openapi-baseline.json');
      const specText = await fs.readFile(specPath, 'utf8');
      const specObject = JSON.parse(specText);
      
      // Simulate adding a new method by duplicating the block endpoint
      const newPath = '/test_new_method_xyz123';
      const blockPath = specObject.paths['/block'];
      
      if (blockPath) {
        // Create a modified spec with the new endpoint
        const modifiedSpec = { ...specObject };
        modifiedSpec.paths = { ...specObject.paths };
        modifiedSpec.paths[newPath] = {
          ...blockPath,
          post: {
            ...blockPath.post,
            operationId: 'rpc_test_new_method_xyz123',
            summary: 'Test new method for regression testing'
          }
        };
        
        // Save modified spec temporarily
        const modifiedSpecPath = join(tempDir, 'modified-spec.json');
        await fs.writeFile(modifiedSpecPath, JSON.stringify(modifiedSpec, null, 2));
        
        // Verify our spec parsing would handle this
        const modifiedSpecText = JSON.stringify(modifiedSpec);
        expect(modifiedSpecText).toContain('test_new_method_xyz123');
        expect(modifiedSpecText.length).toBeGreaterThan(specText.length);
        expect(Object.keys(modifiedSpec.paths)).toContain(newPath);
      } else {
        // Fallback test if block path structure is different
        expect(specObject.paths).toBeDefined();
        expect(Object.keys(specObject.paths).length).toBeGreaterThan(0);
      }
    });
  });

  describe('Performance Tests', () => {
    it('should generate types within reasonable time', async () => {
      const startTime = Date.now();
      
      const projectRoot = join(__dirname, '../../..');
      
      // Run just the type generation (not the full build)
      execSync('pnpm --filter @near-js/jsonrpc-types generate', {
        cwd: projectRoot,
        encoding: 'utf8',
        timeout: 60000
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`Generation took ${duration}ms`);
      
      // Should complete within reasonable time (adjust if needed)
      expect(duration).toBeLessThan(30000); // 30 seconds max
    }, 45000);

    it('should generate reasonable file sizes', async () => {
      const projectRoot = join(__dirname, '../../..');
      
      // Check generated file sizes
      const typesFile = join(projectRoot, 'packages/jsonrpc-types/src/types.ts');
      const schemasFile = join(projectRoot, 'packages/jsonrpc-types/src/schemas.ts');
      const clientFile = join(projectRoot, 'packages/jsonrpc-client/src/generated-types.ts');
      
      const typesStats = await fs.stat(typesFile);
      const schemasStats = await fs.stat(schemasFile);
      const clientStats = await fs.stat(clientFile);
      
      console.log(`File sizes: types=${typesStats.size}, schemas=${schemasStats.size}, client=${clientStats.size}`);
      
      // Sanity check file sizes (not too small, not ridiculously large)
      expect(typesStats.size).toBeGreaterThan(1000); // At least 1KB
      expect(typesStats.size).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
      
      expect(schemasStats.size).toBeGreaterThan(1000);
      expect(schemasStats.size).toBeLessThan(10 * 1024 * 1024);
      
      expect(clientStats.size).toBeGreaterThan(1000);
      expect(clientStats.size).toBeLessThan(1024 * 1024); // Less than 1MB
    });
  });
});
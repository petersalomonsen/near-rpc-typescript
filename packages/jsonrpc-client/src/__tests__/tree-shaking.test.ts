import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Tree-shaking validation', () => {
  const testDir = join(__dirname, 'tree-shaking-test');
  const distDir = join(testDir, 'dist');

  beforeAll(async () => {
    // Create test directory
    await fs.mkdir(testDir, { recursive: true });
    await fs.mkdir(distDir, { recursive: true });
  });

  it('should only include schemas for used functions with validation', async () => {
    // Create a test file that only uses block function
    const testCode = `
import { block, NearRpcClient } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'test' });
await block(client, { finality: 'final' });
`;

    await fs.writeFile(join(testDir, 'test-block-only.js'), testCode);

    // Create rollup config
    const rollupConfig = `
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'test-block-only.js',
  output: {
    file: 'dist/bundle-block-only.js',
    format: 'esm',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
  ],
  external: [],
  treeshake: {
    moduleSideEffects: false,
  },
};
`;

    await fs.writeFile(join(testDir, 'rollup.config.js'), rollupConfig);

    // Build the bundle
    await execAsync('npx rollup -c', { cwd: testDir });

    // Read the bundle
    const bundle = await fs.readFile(join(distDir, 'bundle-block-only.js'), 'utf8');

    // Check that BlockRequestSchema and BlockResponseSchema are included
    expect(bundle).toContain('BlockRequestSchema');
    expect(bundle).toContain('BlockResponseSchema');

    // Check that other method schemas are NOT included
    expect(bundle).not.toContain('QueryRequestSchema');
    expect(bundle).not.toContain('QueryResponseSchema');
    expect(bundle).not.toContain('StatusRequestSchema');
    expect(bundle).not.toContain('StatusResponseSchema');
    expect(bundle).not.toContain('GasPriceRequestSchema');
    expect(bundle).not.toContain('ChunkRequestSchema');
  }, 30000); // 30 second timeout for build

  it('should include no validation schemas in no-validation export', async () => {
    // Create a test file that uses no-validation export
    const testCode = `
import { block, NearRpcClient } from '@near-js/jsonrpc-client/no-validation';

const client = new NearRpcClient({ endpoint: 'test' });
await block(client, { finality: 'final' });
`;

    await fs.writeFile(join(testDir, 'test-no-validation.js'), testCode);

    // Create rollup config for no-validation
    const rollupConfig = `
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'test-no-validation.js',
  output: {
    file: 'dist/bundle-no-validation.js',
    format: 'esm',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
  ],
  external: [],
  treeshake: {
    moduleSideEffects: false,
  },
};
`;

    await fs.writeFile(join(testDir, 'rollup-no-val.config.js'), rollupConfig);

    // Build the bundle
    await execAsync('npx rollup -c rollup-no-val.config.js', { cwd: testDir });

    // Read the bundle
    const bundle = await fs.readFile(join(distDir, 'bundle-no-validation.js'), 'utf8');

    // Check that NO validation schemas are included
    expect(bundle).not.toContain('BlockRequestSchema');
    expect(bundle).not.toContain('BlockResponseSchema');
    expect(bundle).not.toContain('RequestSchema');
    expect(bundle).not.toContain('ResponseSchema');
    
    // Check that Zod is not included at all
    expect(bundle).not.toContain('ZodMini');
    expect(bundle).not.toContain('parse(');
    
    // But the RPC function should still be there
    expect(bundle).toContain('makeRequest');
    expect(bundle).toContain('block');
  }, 30000);

  it('should keep bundle size small with validation', async () => {
    // Create a test file that uses two functions
    const testCode = `
import { block, status, NearRpcClient } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'test' });
await block(client, { finality: 'final' });
await status(client);
`;

    await fs.writeFile(join(testDir, 'test-two-functions.js'), testCode);

    // Create rollup config
    const rollupConfig = `
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'test-two-functions.js',
  output: {
    file: 'dist/bundle-two-functions.js',
    format: 'esm',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
  ],
  external: [],
  treeshake: {
    moduleSideEffects: false,
  },
};
`;

    await fs.writeFile(join(testDir, 'rollup-two.config.js'), rollupConfig);

    // Build the bundle
    await execAsync('npx rollup -c rollup-two.config.js', { cwd: testDir });

    // Check file size
    const stats = await fs.stat(join(distDir, 'bundle-two-functions.js'));
    const bundle = await fs.readFile(join(distDir, 'bundle-two-functions.js'), 'utf8');

    // Bundle should be reasonably sized (less than 80KB for 2 functions)
    expect(stats.size).toBeLessThan(80 * 1024);

    // Should include schemas for both functions
    expect(bundle).toContain('BlockRequestSchema');
    expect(bundle).toContain('StatusRequestSchema');
    
    // Should NOT include schemas for unused functions
    expect(bundle).not.toContain('ChunkRequestSchema');
    expect(bundle).not.toContain('ValidatorsRequestSchema');
  }, 30000);

  it('no-validation bundle should be tiny', async () => {
    // Check the size of no-validation bundle
    const stats = await fs.stat(join(distDir, 'bundle-no-validation.js'));
    
    // No-validation bundle should be very small (less than 15KB)
    expect(stats.size).toBeLessThan(15 * 1024);
  });

  // Clean up after tests
  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });
});
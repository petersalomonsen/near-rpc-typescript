import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Tree-shaking validation', () => {
  it('should export validated functions from main index', async () => {
    const mainExports = await import('../index.js');

    // Check that validated functions are exported
    expect(mainExports.block).toBeDefined();
    expect(mainExports.status).toBeDefined();
    expect(mainExports.viewAccount).toBeDefined();
    expect(mainExports.query).toBeDefined();

    // Check convenience functions
    expect(mainExports.parseCallResultToJson).toBeDefined();
    expect(mainExports.viewFunctionAsJson).toBeDefined();
  });

  it('should export no-validation functions from no-validation path', async () => {
    const noValidationExports = await import('../no-validation/index.js');

    // Check that unvalidated functions are exported
    expect(noValidationExports.block).toBeDefined();
    expect(noValidationExports.status).toBeDefined();
    expect(noValidationExports.query).toBeDefined();

    // Check convenience functions
    expect(noValidationExports.viewAccount).toBeDefined();
    expect(noValidationExports.parseCallResultToJson).toBeDefined();
    expect(noValidationExports.viewFunctionAsJson).toBeDefined();

    // Check enableValidation is a no-op
    expect(noValidationExports.enableValidation).toBeDefined();
    expect(noValidationExports.enableValidation()).toBeUndefined();
  });

  it('should not import VALIDATION_SCHEMA_MAP in the codebase', () => {
    // Read all source files
    const srcDir = path.join(__dirname, '..');
    const files = [
      'index.ts',
      'validated/index.ts',
      'no-validation/index.ts',
      'generated-functions.ts',
      'convenience.ts',
      'client.ts',
    ];

    // Check that VALIDATION_SCHEMA_MAP is not imported anywhere
    for (const file of files) {
      const filePath = path.join(srcDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).not.toContain('VALIDATION_SCHEMA_MAP');
      }
    }
  });

  it('validated functions should use per-function schema imports', () => {
    const validatedIndexPath = path.join(__dirname, '../validated/index.ts');
    const content = fs.readFileSync(validatedIndexPath, 'utf-8');

    // Check for individual schema imports
    expect(content).toContain('BlockRequestSchema');
    expect(content).toContain('BlockResponseSchema');
    expect(content).toContain('StatusRequestSchema');
    expect(content).toContain('StatusResponseSchema');
    expect(content).toContain('QueryRequestSchema');
    expect(content).toContain('QueryResponseSchema');

    // Ensure we're importing specific schemas, not a map
    expect(content).not.toContain('VALIDATION_SCHEMA_MAP');
  });

  it('no-validation export should not import validation-specific schemas', () => {
    const noValidationPath = path.join(__dirname, '../no-validation/index.ts');
    const content = fs.readFileSync(noValidationPath, 'utf-8');

    // Check that validation-specific schemas are NOT imported
    expect(content).not.toContain('BlockRequestSchema');
    expect(content).not.toContain('BlockResponseSchema');
    expect(content).not.toContain('StatusRequestSchema');
    expect(content).not.toContain('StatusResponseSchema');
    expect(content).not.toContain('QueryRequestSchema');
    expect(content).not.toContain('QueryResponseSchema');
    expect(content).not.toContain('VALIDATION_SCHEMA_MAP');

    // Should re-export functions
    expect(content).toContain("export * from '../generated-functions.js'");

    // It's OK to export JsonRpcRequestSchema/JsonRpcResponseSchema as they're basic types
    // that don't include the heavy validation schemas
  });

  it('package.json should have correct export paths', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // Check main export
    expect(packageJson.exports['.']).toBeDefined();
    expect(packageJson.exports['.'].import).toContain('index.mjs');
    expect(packageJson.exports['.'].require).toContain('index.js');

    // Check no-validation export
    expect(packageJson.exports['./no-validation']).toBeDefined();
    expect(packageJson.exports['./no-validation'].import).toContain(
      'no-validation/index.mjs'
    );
    expect(packageJson.exports['./no-validation'].require).toContain(
      'no-validation/index.js'
    );
  });

  it('tree-shaking example files should exist', () => {
    const examplesDir = path.join(
      __dirname,
      '../../../../examples/tree-shaking'
    );

    // Check that example files exist
    expect(fs.existsSync(path.join(examplesDir, 'main.ts'))).toBe(true);
    expect(
      fs.existsSync(path.join(examplesDir, 'main-with-validation.ts'))
    ).toBe(true);
    expect(fs.existsSync(path.join(examplesDir, 'main-no-validation.ts'))).toBe(
      true
    );
    expect(fs.existsSync(path.join(examplesDir, 'rollup.config.js'))).toBe(
      true
    );
    expect(
      fs.existsSync(path.join(examplesDir, 'rollup.validation.config.js'))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(examplesDir, 'rollup.no-validation.config.js'))
    ).toBe(true);
  });
});

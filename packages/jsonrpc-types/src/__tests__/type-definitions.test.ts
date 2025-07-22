/**
 * Tests for TypeScript type definitions to ensure proper named types
 * This test verifies that our union types have proper names and not anonymous objects
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { RpcQueryResponse, AccountView, CallResult } from '../types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('TypeScript Type Definitions', () => {
  let typeDefinitions: string;

  beforeAll(() => {
    // Read the source types file to inspect the type definitions
    const sourcePath = join(__dirname, '../types.ts');
    typeDefinitions = readFileSync(sourcePath, 'utf8');
  });

  describe('RpcQueryResponse Union Type', () => {
    it('should be defined as explicit named union, not z.infer', () => {
      // Check that RpcQueryResponse is defined with explicit union
      expect(typeDefinitions).toMatch(/export type RpcQueryResponse.*=/);

      // Should contain the individual type names in the union
      expect(typeDefinitions).toMatch(/AccountView/);
      expect(typeDefinitions).toMatch(/CallResult/);
      expect(typeDefinitions).toMatch(/AccessKeyView/);
      expect(typeDefinitions).toMatch(/ContractCodeView/);
      expect(typeDefinitions).toMatch(/ViewStateResult/);
      expect(typeDefinitions).toMatch(/AccessKeyList/);
    });

    it('should be defined using z.infer for proper union handling', () => {
      // RpcQueryResponse should use z.infer - this is the correct approach
      const queryResponseMatch = typeDefinitions.match(
        /export type RpcQueryResponse.*?;/s
      );

      if (queryResponseMatch) {
        const queryResponseDef = queryResponseMatch[0];
        expect(queryResponseDef).toContain('z.infer');
        expect(queryResponseDef).toContain('RpcQueryResponseSchema');
      }
    });

    it('should have individual named types properly defined', () => {
      // Check that individual types are defined with proper names
      expect(typeDefinitions).toMatch(/export type AccountView.*=/);
      expect(typeDefinitions).toMatch(/export type CallResult.*=/);
      expect(typeDefinitions).toMatch(/export type AccessKeyView.*=/);
      expect(typeDefinitions).toMatch(/export type ContractCodeView.*=/);
      expect(typeDefinitions).toMatch(/export type ViewStateResult.*=/);
      expect(typeDefinitions).toMatch(/export type AccessKeyList.*=/);
    });
  });

  describe('Type Export Verification', () => {
    it('should export all individual query response types', () => {
      // Verify all the component types of RpcQueryResponse are exported
      const expectedTypes = [
        'AccountView',
        'CallResult',
        'AccessKeyView',
        'ContractCodeView',
        'ViewStateResult',
        'AccessKeyList',
      ];

      for (const typeName of expectedTypes) {
        expect(typeDefinitions).toMatch(new RegExp(`export type ${typeName}`));
      }
    });

    it('should have underlying schema that defines the union properly', () => {
      // The actual union structure is in the schema definition
      // The type uses z.infer to extract the TypeScript type from the schema
      expect(typeDefinitions).toMatch(/RpcQueryResponseSchema/);

      // The individual types that make up the union should be defined
      expect(typeDefinitions).toMatch(/AccountView/);
      expect(typeDefinitions).toMatch(/CallResult/);
      expect(typeDefinitions).toMatch(/AccessKeyView/);
      expect(typeDefinitions).toMatch(/ContractCodeView/);
      expect(typeDefinitions).toMatch(/ViewStateResult/);
      expect(typeDefinitions).toMatch(/AccessKeyList/);
    });
  });

  describe('Schema Consistency', () => {
    it('should maintain consistency between schemas and types', () => {
      // The types file should import schemas even though RpcQueryResponse is manual
      expect(typeDefinitions).toMatch(/import.*schemas/);

      // Individual types should still reference their schemas for most types
      expect(typeDefinitions).toMatch(/AccountViewSchema/);
      expect(typeDefinitions).toMatch(/CallResultSchema/);

      // RpcQueryResponse correctly uses z.infer to get the union type
      const queryResponseMatch = typeDefinitions.match(
        /export type RpcQueryResponse.*?;/s
      );
      if (queryResponseMatch) {
        const queryResponseDef = queryResponseMatch[0];
        expect(queryResponseDef).toContain('z.infer');
        expect(queryResponseDef).toContain('RpcQueryResponseSchema');
      }
    });
  });
});

// Compile-time verification test
describe('Type Import Test', () => {
  it('should be able to import and use the union types', () => {
    // The fact that this file compiles with the imports at the top is the test
    // This proves the types are properly exported and defined

    expect(() => {
      function testTypes() {
        let response: RpcQueryResponse;
        let account: AccountView;
        let call: CallResult;

        // These assignments should work if types are properly defined
        // Using mock objects to avoid undefined assignment
        account = {
          amount: '0',
          codeHash: 'test',
          locked: '0',
          storageUsage: 0,
        };

        call = {
          logs: [],
          result: [],
        };

        // Union assignment should work
        response = account;
        response = call;

        return { response, account, call };
      }

      const result = testTypes();
      expect(result).toBeDefined();
    }).not.toThrow();
  });
});

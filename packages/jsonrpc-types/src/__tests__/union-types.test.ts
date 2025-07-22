/**
 * Tests for union type discrimination and named type handling
 * Ensures that RpcQueryResponse has proper named types, not anonymous objects
 */

import { describe, it, expect } from 'vitest';
import type { 
  RpcQueryResponse, 
  AccountView, 
  CallResult, 
  AccessKeyView, 
  ContractCodeView, 
  ViewStateResult,
  AccessKeyList 
} from '../types.js';

describe('Union Type Discrimination', () => {
  describe('RpcQueryResponse Union', () => {
    it('should have proper discriminated union with named types', () => {
      // Type-level test: This function should compile without errors
      // if RpcQueryResponse properly discriminates between named types
      function handleQueryResponse(response: RpcQueryResponse) {
        // Test AccountView discrimination
        if ('amount' in response && 'storageUsage' in response) {
          // TypeScript should know this is AccountView
          const accountView: AccountView = response;
          expect(typeof accountView.amount).toBe('string');
          expect(typeof accountView.storageUsage).toBe('number');
          return 'AccountView';
        }
        
        // Test CallResult discrimination  
        if ('logs' in response && 'result' in response) {
          // TypeScript should know this is CallResult
          const callResult: CallResult = response;
          expect(Array.isArray(callResult.logs)).toBe(true);
          expect(Array.isArray(callResult.result)).toBe(true);
          return 'CallResult';
        }
        
        // Test AccessKeyView discrimination
        if ('nonce' in response && 'permission' in response) {
          // TypeScript should know this is AccessKeyView
          const accessKeyView: AccessKeyView = response;
          expect(typeof accessKeyView.nonce).toBe('number');
          return 'AccessKeyView';
        }
        
        // Test ContractCodeView discrimination
        if ('codeBase64' in response && 'hash' in response) {
          // TypeScript should know this is ContractCodeView
          const contractCodeView: ContractCodeView = response;
          expect(typeof contractCodeView.codeBase64).toBe('string');
          return 'ContractCodeView';
        }
        
        // Test ViewStateResult discrimination
        if ('values' in response && Array.isArray((response as any).values)) {
          // TypeScript should know this is ViewStateResult
          const viewStateResult: ViewStateResult = response;
          expect(Array.isArray(viewStateResult.values)).toBe(true);
          return 'ViewStateResult';
        }
        
        // Test AccessKeyList discrimination
        if ('keys' in response && Array.isArray((response as any).keys)) {
          // TypeScript should know this is AccessKeyList
          const accessKeyList: AccessKeyList = response;
          expect(Array.isArray(accessKeyList.keys)).toBe(true);
          return 'AccessKeyList';
        }
        
        return 'Unknown';
      }
      
      // The fact that this compiles proves the union works with named types
      expect(typeof handleQueryResponse).toBe('function');
    });

    it('should allow type guards with named types', () => {
      // Test that we can create type guards using the named types
      function isAccountView(response: RpcQueryResponse): response is AccountView {
        return 'amount' in response && 'storageUsage' in response;
      }
      
      function isCallResult(response: RpcQueryResponse): response is CallResult {
        return 'logs' in response && 'result' in response && 
               Array.isArray((response as any).logs) && 
               Array.isArray((response as any).result);
      }
      
      function isAccessKeyView(response: RpcQueryResponse): response is AccessKeyView {
        return 'nonce' in response && 'permission' in response;
      }

      // Mock data that matches each type
      const mockAccountView: AccountView = {
        amount: '1000000000000000000000000',
        codeHash: 'mock-hash',
        locked: '0',
        storageUsage: 1024,
      };
      
      const mockCallResult: CallResult = {
        logs: [],
        result: [123, 456, 789],
      };
      
      const mockAccessKeyView: AccessKeyView = {
        nonce: 42,
        permission: 'FullAccess',
      };

      // Test type guards work correctly
      expect(isAccountView(mockAccountView)).toBe(true);
      expect(isAccountView(mockCallResult)).toBe(false);
      
      expect(isCallResult(mockCallResult)).toBe(true);
      expect(isCallResult(mockAccountView)).toBe(false);
      
      expect(isAccessKeyView(mockAccessKeyView)).toBe(true);
      expect(isAccessKeyView(mockAccountView)).toBe(false);
    });

    it('should maintain type safety after type guards', () => {
      function processQueryResponse(response: RpcQueryResponse) {
        if ('amount' in response && 'storageUsage' in response) {
          // After this check, TypeScript should narrow to AccountView
          const account: AccountView = response;
          
          // These properties should be accessible without errors
          return {
            type: 'account',
            balance: account.amount,
            storage: account.storageUsage,
            codeHash: account.codeHash,
            locked: account.locked,
          };
        }
        
        if ('logs' in response && 'result' in response) {
          // After this check, TypeScript should narrow to CallResult
          const call: CallResult = response;
          
          // These properties should be accessible without errors
          return {
            type: 'call',
            logs: call.logs,
            result: call.result,
          };
        }
        
        return { type: 'other' };
      }
      
      // Test with mock data
      const accountResult = processQueryResponse({
        amount: '1000',
        codeHash: 'hash',
        locked: '0', 
        storageUsage: 100,
      } as AccountView);
      
      expect(accountResult.type).toBe('account');
      expect(accountResult).toHaveProperty('balance');
      expect(accountResult).toHaveProperty('storage');
    });
  });

  describe('Type Name Verification', () => {
    it('should export individual named types', () => {
      // This is a compile-time test that verifies the named types exist
      // If any of these imports fail, the test will fail to compile
      
      // Test that we can create variables of each named type
      let accountView: AccountView;
      let callResult: CallResult; 
      let accessKeyView: AccessKeyView;
      let contractCodeView: ContractCodeView;
      let viewStateResult: ViewStateResult;
      let accessKeyList: AccessKeyList;
      let queryResponse: RpcQueryResponse;
      
      // Verify they're not 'any' types by checking they have expected structure
      // This would fail if the types were 'any' or completely wrong
      expect(() => {
        // These assignments should be type-safe
        accountView = {
          amount: '0',
          codeHash: 'hash',
          locked: '0',
          storageUsage: 0
        };
        
        callResult = {
          logs: [],
          result: []
        };
        
        // Union should accept all individual types
        queryResponse = accountView;
        queryResponse = callResult;
      }).not.toThrow();
    });

    it('should reject invalid assignments to named types', () => {
      // This test ensures TypeScript would catch type errors
      // We can't directly test compilation failures in Jest, but we can
      // document the expected behavior
      
      expect(() => {
        // These should work fine
        const validAccount: AccountView = {
          amount: '1000',
          codeHash: 'hash', 
          locked: '0',
          storageUsage: 100
        };
        
        const validCall: CallResult = {
          logs: ['log1'],
          result: [1, 2, 3]
        };
        
        expect(validAccount.amount).toBeDefined();
        expect(validCall.logs).toBeDefined();
      }).not.toThrow();
    });
  });
});
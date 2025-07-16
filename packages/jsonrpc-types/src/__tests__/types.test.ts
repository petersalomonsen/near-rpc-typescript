// Test suite for generated TypeScript types
import { describe, it, expect } from 'vitest';
import type { 
  AccessKey,
  AccountView,
  RpcError
} from '../types';
import { z } from 'zod';
import { 
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
  JsonRpcErrorSchema
} from '../schemas';

// Infer types from schemas for testing
type JsonRpcRequest<T = unknown> = z.infer<typeof JsonRpcRequestSchema> & { params?: T };
type JsonRpcResponse<T = unknown> = z.infer<typeof JsonRpcResponseSchema> & { result?: T };
type JsonRpcError = z.infer<typeof JsonRpcErrorSchema>;

describe('TypeScript Types', () => {
  describe('AccessKey', () => {
    it('should allow valid AccessKey objects', () => {
      const accessKey: AccessKey = {
        nonce: 12345,
        permission: 'FullAccess'
      };

      expect(accessKey.nonce).toBe(12345);
      expect(accessKey.permission).toBe('FullAccess');
    });

    it('should allow FunctionCall permission', () => {
      const accessKey: AccessKey = {
        nonce: 12345,
        permission: {
          FunctionCall: {
            allowance: '1000000000000000000000000',
            methodNames: ['method1', 'method2'],
            receiverId: 'contract.testnet'
          }
        }
      };

      expect(accessKey.permission).toHaveProperty('FunctionCall');
    });
  });

  describe('AccountView', () => {
    it('should allow valid AccountView objects', () => {
      const account: AccountView = {
        amount: '1000000000000000000000000',
        codeHash: '11111111111111111111111111111111',
        locked: '0',
        storageUsage: 182
      };

      expect(account.amount).toBe('1000000000000000000000000');
      expect(account.storageUsage).toBe(182);
    });

    it('should allow optional fields', () => {
      const account: AccountView = {
        amount: '1000000000000000000000000',
        codeHash: '11111111111111111111111111111111',
        locked: '0',
        storageUsage: 182,
        storagePaidAt: 100,
        globalContractAccountId: 'global.testnet',
        globalContractHash: '22222222222222222222222222222222'
      };

      expect(account.storagePaidAt).toBe(100);
      expect(account.globalContractAccountId).toBe('global.testnet');
    });
  });

  describe('JsonRpcRequest', () => {
    it('should allow typed requests', () => {
      const request: JsonRpcRequest<{ finality: string }> = {
        jsonrpc: '2.0',
        id: 'test-id',
        method: 'block',
        params: { finality: 'final' }
      };

      expect(request.jsonrpc).toBe('2.0');
      expect(request.params?.finality).toBe('final');
    });

    it('should allow requests without params', () => {
      const request: JsonRpcRequest = {
        jsonrpc: '2.0',
        id: 'test-id',
        method: 'status'
      };

      expect(request.params).toBeUndefined();
    });
  });

  describe('JsonRpcResponse', () => {
    it('should allow success responses', () => {
      const response: JsonRpcResponse<{ height: number }> = {
        jsonrpc: '2.0',
        id: 'test-id',
        result: { height: 12345 }
      };

      expect(response.result?.height).toBe(12345);
      expect(response.error).toBeUndefined();
    });

    it('should allow error responses', () => {
      const response: JsonRpcResponse = {
        jsonrpc: '2.0',
        id: 'test-id',
        error: {
          code: -32601,
          message: 'Method not found'
        }
      };

      expect(response.error?.code).toBe(-32601);
      expect(response.result).toBeUndefined();
    });
  });

  describe('JsonRpcError', () => {
    it('should allow basic error structure', () => {
      const error: JsonRpcError = {
        code: -32602,
        message: 'Invalid params'
      };

      expect(error.code).toBe(-32602);
      expect(error.message).toBe('Invalid params');
    });

    it('should allow error with data', () => {
      const error: JsonRpcError = {
        code: -32602,
        message: 'Invalid params',
        data: { details: 'Missing required field' }
      };

      expect(error.data).toEqual({ details: 'Missing required field' });
    });
  });

  describe('Type Compilation', () => {
    it('should compile without TypeScript errors', () => {
      // This test ensures that all exported types can be imported and used
      // without TypeScript compilation errors
      const testVar: AccessKey | AccountView | JsonRpcRequest | JsonRpcResponse | JsonRpcError | undefined = undefined;
      expect(testVar).toBeUndefined();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CallResult } from '@near-js/jsonrpc-types';
import { parseCallResultToJson, viewFunctionAsJson } from '../convenience.js';
import type { NearRpcClient } from '../client.js';
import * as generatedFunctions from '../generated-functions.js';

describe('JSON parsing convenience functions', () => {
  describe('parseCallResultToJson', () => {
    it('should parse JSON from byte array result', () => {
      const testData = { message: 'Hello, World!', count: 42 };
      const jsonString = JSON.stringify(testData);
      const bytes = new TextEncoder().encode(jsonString);

      const callResult: CallResult = {
        result: Array.from(bytes),
        logs: [],
      };

      const parsed = parseCallResultToJson(callResult);
      expect(parsed).toEqual(testData);
    });

    it('should parse typed JSON with generic type parameter', () => {
      interface TestType {
        name: string;
        value: number;
      }

      const testData: TestType = { name: 'test', value: 123 };
      const jsonString = JSON.stringify(testData);
      const bytes = new TextEncoder().encode(jsonString);

      const callResult: CallResult = {
        result: Array.from(bytes),
        logs: [],
      };

      const parsed = parseCallResultToJson<TestType>(callResult);
      expect(parsed).toEqual(testData);
      expect(parsed.name).toBe('test');
      expect(parsed.value).toBe(123);
    });

    it('should handle empty result', () => {
      const callResult: CallResult = {
        result: [],
        logs: [],
      };

      expect(() => parseCallResultToJson(callResult)).toThrow();
    });

    it('should throw on invalid JSON', () => {
      const invalidJson = 'not valid json';
      const bytes = new TextEncoder().encode(invalidJson);

      const callResult: CallResult = {
        result: Array.from(bytes),
        logs: [],
      };

      expect(() => parseCallResultToJson(callResult)).toThrow(SyntaxError);
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        users: [
          { id: 1, name: 'Alice', metadata: { role: 'admin' } },
          { id: 2, name: 'Bob', metadata: { role: 'user' } },
        ],
        settings: {
          theme: 'dark',
          notifications: true,
        },
      };

      const jsonString = JSON.stringify(complexData);
      const bytes = new TextEncoder().encode(jsonString);

      const callResult: CallResult = {
        result: Array.from(bytes),
        logs: ['log1', 'log2'],
      };

      const parsed = parseCallResultToJson(callResult);
      expect(parsed).toEqual(complexData);
    });
  });

  describe('viewFunctionAsJson', () => {
    let mockClient: NearRpcClient;
    let queryMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockClient = {} as NearRpcClient;
      queryMock = vi.fn();
      vi.spyOn(generatedFunctions, 'query').mockImplementation(queryMock);
    });

    it('should call viewFunction and parse result as JSON', async () => {
      const testData = { status: 'success', data: [1, 2, 3] };
      const jsonString = JSON.stringify(testData);
      const bytes = new TextEncoder().encode(jsonString);

      const mockCallResult: CallResult = {
        result: Array.from(bytes),
        logs: [],
      };

      queryMock.mockResolvedValue(mockCallResult);

      const result = await viewFunctionAsJson(mockClient, {
        accountId: 'test.near',
        methodName: 'get_status',
        finality: 'final',
      });

      expect(result).toEqual(testData);
      expect(queryMock).toHaveBeenCalledWith(mockClient, {
        requestType: 'call_function',
        accountId: 'test.near',
        methodName: 'get_status',
        argsBase64: '',
        finality: 'final',
      });
    });

    it('should handle typed responses', async () => {
      interface ContractResponse {
        tokens: string[];
        totalSupply: string;
      }

      const testData: ContractResponse = {
        tokens: ['token1', 'token2'],
        totalSupply: '1000000',
      };

      const jsonString = JSON.stringify(testData);
      const bytes = new TextEncoder().encode(jsonString);

      const mockCallResult: CallResult = {
        result: Array.from(bytes),
        logs: [],
      };

      queryMock.mockResolvedValue(mockCallResult);

      const result = await viewFunctionAsJson<ContractResponse>(mockClient, {
        accountId: 'contract.near',
        methodName: 'ft_metadata',
      });

      expect(result).toEqual(testData);
      expect(result.tokens).toHaveLength(2);
      expect(result.totalSupply).toBe('1000000');
    });

    it('should pass through function arguments', async () => {
      const args = { user_id: 'alice.near' };
      const argsBase64 = Buffer.from(JSON.stringify(args)).toString('base64');

      const testData = { balance: '100' };
      const jsonString = JSON.stringify(testData);
      const bytes = new TextEncoder().encode(jsonString);

      const mockCallResult: CallResult = {
        result: Array.from(bytes),
        logs: [],
      };

      queryMock.mockResolvedValue(mockCallResult);

      await viewFunctionAsJson(mockClient, {
        accountId: 'contract.near',
        methodName: 'get_balance',
        argsBase64,
        blockId: 12345,
      });

      expect(queryMock).toHaveBeenCalledWith(mockClient, {
        requestType: 'call_function',
        accountId: 'contract.near',
        methodName: 'get_balance',
        argsBase64,
        blockId: 12345,
      });
    });
  });
});

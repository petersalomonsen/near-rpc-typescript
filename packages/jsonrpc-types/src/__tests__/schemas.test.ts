// Test suite for Zod schema validation
import { describe, it, expect } from 'vitest';
import {
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
  JsonRpcErrorSchema,
} from '../schemas';

describe('JsonRpcRequestSchema', () => {
  it('should validate a valid JSON-RPC request', () => {
    const validRequest = {
      jsonrpc: '2.0' as const,
      id: 'test-id',
      method: 'block',
      params: { finality: 'final' },
    };

    const result = JsonRpcRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('should reject request without jsonrpc field', () => {
    const invalidRequest = {
      id: 'test-id',
      method: 'block',
    };

    const result = JsonRpcRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should reject request with wrong jsonrpc version', () => {
    const invalidRequest = {
      jsonrpc: '1.0',
      id: 'test-id',
      method: 'block',
    };

    const result = JsonRpcRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should reject request without id field', () => {
    const invalidRequest = {
      jsonrpc: '2.0',
      method: 'block',
    };

    const result = JsonRpcRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should reject request without method field', () => {
    const invalidRequest = {
      jsonrpc: '2.0',
      id: 'test-id',
    };

    const result = JsonRpcRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should allow request without params field', () => {
    const validRequest = {
      jsonrpc: '2.0' as const,
      id: 'test-id',
      method: 'block',
    };

    const result = JsonRpcRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('should accept string id types', () => {
    const testCases = [
      { jsonrpc: '2.0' as const, id: 'string-id', method: 'block' },
      { jsonrpc: '2.0' as const, id: 'another-string-id', method: 'block' },
    ];

    testCases.forEach(request => {
      const result = JsonRpcRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });
  });
});

describe('JsonRpcResponseSchema', () => {
  it('should validate a valid JSON-RPC success response', () => {
    const validResponse = {
      jsonrpc: '2.0' as const,
      id: 'test-id',
      result: { someData: 'value' },
    };

    const result = JsonRpcResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should validate a valid JSON-RPC error response', () => {
    const validResponse = {
      jsonrpc: '2.0' as const,
      id: 'test-id',
      error: {
        code: -32601,
        message: 'Method not found',
      },
    };

    const result = JsonRpcResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should reject response without jsonrpc field', () => {
    const invalidResponse = {
      id: 'test-id',
      result: { someData: 'value' },
    };

    const result = JsonRpcResponseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('should reject response with wrong jsonrpc version', () => {
    const invalidResponse = {
      jsonrpc: '1.0',
      id: 'test-id',
      result: { someData: 'value' },
    };

    const result = JsonRpcResponseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('should reject response without id field', () => {
    const invalidResponse = {
      jsonrpc: '2.0',
      result: { someData: 'value' },
    };

    const result = JsonRpcResponseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('should allow response with both result and error (per current schema)', () => {
    const responseWithBoth = {
      jsonrpc: '2.0',
      id: 'test-id',
      result: { someData: 'value' },
      error: { code: -32601, message: 'Method not found' },
    };

    const result = JsonRpcResponseSchema.safeParse(responseWithBoth);
    // Current schema allows both - this is technically against JSON-RPC spec but matches our schema
    expect(result.success).toBe(true);
  });

  it('should allow response with neither result nor error (per current schema)', () => {
    const responseWithNeither = {
      jsonrpc: '2.0',
      id: 'test-id',
    };

    const result = JsonRpcResponseSchema.safeParse(responseWithNeither);
    // Current schema allows this - both result and error are optional
    expect(result.success).toBe(true);
  });
});

describe('JsonRpcErrorSchema', () => {
  it('should validate a valid JSON-RPC error', () => {
    const validError = {
      code: -32601,
      message: 'Method not found',
    };

    const result = JsonRpcErrorSchema.safeParse(validError);
    expect(result.success).toBe(true);
  });

  it('should validate error with data field', () => {
    const validError = {
      code: -32602,
      message: 'Invalid params',
      data: { details: 'Missing required parameter' },
    };

    const result = JsonRpcErrorSchema.safeParse(validError);
    expect(result.success).toBe(true);
  });

  it('should reject error without code field', () => {
    const invalidError = {
      message: 'Method not found',
    };

    const result = JsonRpcErrorSchema.safeParse(invalidError);
    expect(result.success).toBe(false);
  });

  it('should reject error without message field', () => {
    const invalidError = {
      code: -32601,
    };

    const result = JsonRpcErrorSchema.safeParse(invalidError);
    expect(result.success).toBe(false);
  });

  it('should accept various data types in data field', () => {
    const testCases = [
      { code: -32602, message: 'Error', data: 'string data' },
      { code: -32602, message: 'Error', data: 123 },
      { code: -32602, message: 'Error', data: { object: 'data' } },
      { code: -32602, message: 'Error', data: ['array', 'data'] },
      { code: -32602, message: 'Error', data: null },
      { code: -32602, message: 'Error', data: true },
    ];

    testCases.forEach(error => {
      const result = JsonRpcErrorSchema.safeParse(error);
      expect(result.success).toBe(true);
    });
  });
});

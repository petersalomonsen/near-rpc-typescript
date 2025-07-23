// Test the mini version specifically
import { describe, it, expect } from 'vitest';

// Import both versions to compare
import * as regular from '../index';
import * as mini from '../index.mini';

describe('Mini Version Tests', () => {
  it('should export equivalent client classes', () => {
    expect(typeof regular.NearRpcClient).toBe('function');
    expect(typeof mini.NearRpcClient).toBe('function');
    expect(regular.NearRpcClient.name).toBe(mini.NearRpcClient.name);
  });

  it('should export JsonRpc schemas from both versions', () => {
    expect(typeof regular.JsonRpcRequestSchema).toBe('object');
    expect(typeof mini.JsonRpcRequestSchema).toBe('object');

    // Both should have parse methods
    expect(typeof regular.JsonRpcRequestSchema.parse).toBe('function');
    expect(typeof mini.JsonRpcRequestSchema.parse).toBe('function');
  });

  it('should validate the same data with both schemas', () => {
    const testRequest = {
      jsonrpc: '2.0' as const,
      id: 'test-123',
      method: 'query',
      params: {
        request_type: 'view_account',
        finality: 'final',
        account_id: 'test.near',
      },
    };

    // Both should successfully validate the same data
    expect(() => regular.JsonRpcRequestSchema.parse(testRequest)).not.toThrow();
    expect(() => mini.JsonRpcRequestSchema.parse(testRequest)).not.toThrow();
  });

  it('should have the same RPC methods available', () => {
    expect(regular.RPC_METHODS).toEqual(mini.RPC_METHODS);
    expect(regular.RPC_METHODS.length).toBeGreaterThan(20);
  });

  it('should create working client instances from both versions', async () => {
    const regularClient = new regular.NearRpcClient({
      endpoint: 'https://rpc.testnet.near.org',
    });

    const miniClient = new mini.NearRpcClient({
      endpoint: 'https://rpc.testnet.near.org',
    });

    // Both should be instances of their respective classes
    expect(regularClient).toBeInstanceOf(regular.NearRpcClient);
    expect(miniClient).toBeInstanceOf(mini.NearRpcClient);

    // Both should have the same methods available
    expect(typeof regularClient.status).toBe('function');
    expect(typeof miniClient.status).toBe('function');
  });
});

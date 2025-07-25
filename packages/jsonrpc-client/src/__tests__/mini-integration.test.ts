// Integration test comparing regular vs mini in real scenarios
import { describe, it, expect } from 'vitest';
import * as regular from '../index';
import * as mini from '../index.mini';

describe('Mini Integration Tests', () => {
  const testnetUrl = 'https://rpc.testnet.near.org';

  it('should get network status with both versions', async () => {
    const regularClient = new regular.NearRpcClient({ endpoint: testnetUrl });
    const miniClient = new mini.NearRpcClient({ endpoint: testnetUrl });

    const [regularResult, miniResult] = await Promise.all([
      regularClient.status(),
      mini.status(miniClient),
    ]);

    // Results should have the same structure (both now use camelCase)
    expect(regularResult).toHaveProperty('chainId');
    expect(miniResult).toHaveProperty('chainId');
    expect(regularResult.chainId).toBe(miniResult.chainId);
  });

  it('should get latest block with both versions', async () => {
    const regularClient = new regular.NearRpcClient({ endpoint: testnetUrl });
    const miniClient = new mini.NearRpcClient({ endpoint: testnetUrl });

    const [regularBlock, miniBlock] = await Promise.all([
      regularClient.block({ finality: 'final' }),
      mini.block(miniClient, { finality: 'final' }),
    ]);

    // Both should return block data with same structure
    expect(regularBlock).toHaveProperty('header');
    expect(miniBlock).toHaveProperty('header');
    expect(regularBlock.header).toHaveProperty('height');
    expect(miniBlock.header).toHaveProperty('height');
    expect(typeof regularBlock.header.height).toBe('number');
    expect(typeof miniBlock.header.height).toBe('number');
  });

  it('should validate all RPC methods are available in both versions', () => {
    const regularClient = new regular.NearRpcClient({ endpoint: testnetUrl });

    // Check that all major RPC methods exist on both clients
    const rpcMethods = [
      'status',
      'block',
      'chunk',
      'gasPrice',
      'query',
      'networkInfo',
      'validators',
      'health',
    ];

    rpcMethods.forEach(method => {
      expect(typeof regularClient[method]).toBe('function');
      expect(typeof mini[method]).toBe('function'); // Mini uses static functions
    });
  });

  it('should have identical schemas functionality', () => {
    // Both should export the same schema types
    expect(typeof regular.JsonRpcRequestSchema).toBe('object');
    expect(typeof mini.JsonRpcRequestSchema).toBe('function');
    expect(typeof regular.JsonRpcResponseSchema).toBe('object');
    expect(typeof mini.JsonRpcResponseSchema).toBe('function');

    // Test data
    const testRequest = {
      jsonrpc: '2.0' as const,
      id: 'test-123',
      method: 'status',
    };

    // Both should validate the same data successfully
    expect(() => regular.JsonRpcRequestSchema.parse(testRequest)).not.toThrow();
    expect(() => mini.JsonRpcRequestSchema().parse(testRequest)).not.toThrow();
  });

  it('should have equivalent client classes', () => {
    // The clients should be functionally equivalent (but different class instances)
    expect(typeof regular.NearRpcClient).toBe('function');
    expect(typeof mini.NearRpcClient).toBe('function');
    expect(regular.NearRpcClient.name).toBe(mini.NearRpcClient.name);
    expect(typeof regular.default).toBe('function');
    expect(typeof mini.default).toBe('function');
  });

  it('should have same RPC methods list', () => {
    expect(regular.RPC_METHODS).toEqual(mini.RPC_METHODS);
    expect(regular.RPC_METHODS.length).toBeGreaterThan(20);
  });
});

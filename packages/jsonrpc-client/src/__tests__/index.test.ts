// Test suite for package exports
import { describe, it, expect } from 'vitest';

describe('@near-js/jsonrpc-client exports', () => {
  it('should export NearRpcClient', async () => {
    const module = await import('../index');
    
    expect(module.NearRpcClient).toBeDefined();
    expect(typeof module.NearRpcClient).toBe('function');
  });

  it('should export error classes', async () => {
    const module = await import('../index');
    
    expect(module.JsonRpcClientError).toBeDefined();
    expect(module.JsonRpcNetworkError).toBeDefined();
  });

  it('should export default client', async () => {
    const module = await import('../index');
    
    expect(module.default).toBeDefined();
    expect(module.default).toBe(module.NearRpcClient);
  });

  it('should re-export RPC_METHODS from jsonrpc-types', async () => {
    const module = await import('../index');
    
    expect(module.RPC_METHODS).toBeDefined();
    expect(Array.isArray(module.RPC_METHODS)).toBe(true);
  });

  it('should allow creating client instance', async () => {
    const { default: NearRpcClient } = await import('../index');
    
    const client = new NearRpcClient('https://rpc.testnet.near.org');
    expect(client).toBeInstanceOf(NearRpcClient);
  });
});

// Test suite for package exports
import { describe, it, expect } from 'vitest';

describe('@near-js/jsonrpc-types exports', () => {
  it('should export schemas', async () => {
    const module = await import('@near-js/jsonrpc-types');
    
    expect(module.JsonRpcRequestSchema).toBeDefined();
    expect(module.JsonRpcResponseSchema).toBeDefined();
    expect(module.JsonRpcErrorSchema).toBeDefined();
  });

  it('should export methods', async () => {
    const module = await import('@near-js/jsonrpc-types');
    
    expect(module.RPC_METHODS).toBeDefined();
    expect(Array.isArray(module.RPC_METHODS)).toBe(true);
  });

  it('should export types', async () => {
    const module = await import('@near-js/jsonrpc-types');
    
    // Check that some key types are available (they should be available as type exports)
    // We can't directly test type exports at runtime, but we can ensure the module loads
    expect(typeof module).toBe('object');
  });
});

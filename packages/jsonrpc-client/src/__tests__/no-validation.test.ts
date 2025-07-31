import { describe, it, expect, vi } from 'vitest';
import {
  NearRpcClient,
  block,
  viewAccount,
  parseCallResultToJson,
} from '../no-validation/index.js';

describe('No-validation exports', () => {
  it('should export all necessary functions without validation', () => {
    // Check that key exports are available
    expect(NearRpcClient).toBeDefined();
    expect(block).toBeDefined();
    expect(viewAccount).toBeDefined();
    expect(parseCallResultToJson).toBeDefined();
  });

  it('should not export enableValidation', () => {
    // @ts-expect-error - enableValidation should not be exported
    import('../no-validation/index.js').then(module => {
      expect(module.enableValidation).toBeUndefined();
    });
  });

  it('should create client without validation', async () => {
    const client = new NearRpcClient({
      endpoint: 'https://rpc.testnet.fastnear.com',
    });

    // Mock fetch to verify no validation occurs
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        jsonrpc: '2.0',
        id: 'dontcare',
        result: {
          header: {
            height: 123456,
            hash: 'test-hash',
            timestamp: Date.now().toString(),
          },
        },
      }),
    });

    global.fetch = mockFetch;

    // This should work without any validation
    const result = await block(client, { finality: 'final' });

    expect(result).toBeDefined();
    expect(result.header.height).toBe(123456);

    // Verify the request was made
    expect(mockFetch).toHaveBeenCalledWith(
      'https://rpc.testnet.fastnear.com',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('"method":"block"'),
      })
    );
  });

  it('should handle invalid responses without validation errors', async () => {
    const client = new NearRpcClient({
      endpoint: 'https://rpc.testnet.fastnear.com',
    });

    // Mock fetch with invalid response structure
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        // Missing jsonrpc field - would fail validation
        id: 'dontcare',
        result: 'invalid-result', // Wrong type - would fail validation
      }),
    });

    global.fetch = mockFetch;

    // Without validation, this should not throw validation errors
    const result = await block(client);

    // It returns whatever the server sends
    expect(result).toBe('invalid-result');
  });
});

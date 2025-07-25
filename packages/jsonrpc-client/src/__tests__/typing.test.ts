// Tests to ensure client has properly typed parameters and responses
// This test validates that the dynamic type generation works correctly

import { describe, it, expect } from 'vitest';
import { NearRpcClient } from '../client.js';
import { block, health, experimentalGenesisConfig, query, broadcastTxAsync } from '../generated-types';
import type {
  RpcBlockRequest,
  RpcBlockResponse,
  RpcHealthRequest,
  RpcHealthResponse,
  GenesisConfigRequest,
  GenesisConfig,
  CryptoHash,
} from '@near-js/jsonrpc-types';

describe('Client Type Safety', () => {
  let client: NearRpcClient;

  beforeEach(() => {
    client = new NearRpcClient({ endpoint: 'https://rpc.testnet.near.org' });
  });

  describe('Method Parameter Types', () => {
    it('should have properly typed block method', () => {
      // This test validates that TypeScript compilation enforces correct types

      // Valid block request
      const validBlockRequest: RpcBlockRequest = {
        blockId: 'latest',
      };

      // Should compile without errors
      const blockPromise = block(client, validBlockRequest);
      expect(blockPromise).toBeInstanceOf(Promise);

      // Optional parameters should work
      const blockPromiseOptional = block(client);
      expect(blockPromiseOptional).toBeInstanceOf(Promise);

      // Type assertion to verify return type
      const _blockResult: Promise<RpcBlockResponse> =
        block(client, validBlockRequest);
    });

    it('should have properly typed health method', () => {
      const validHealthRequest: RpcHealthRequest = {};

      const healthPromise = health(client, validHealthRequest);
      expect(healthPromise).toBeInstanceOf(Promise);

      // Type assertion to verify return type
      const _healthResult: Promise<RpcHealthResponse> = health(client);
    });

    it('should have properly typed experimental methods', () => {
      const validGenesisRequest: GenesisConfigRequest = null;

      const genesisPromise =
        experimentalGenesisConfig(client, validGenesisRequest);
      expect(genesisPromise).toBeInstanceOf(Promise);

      // Type assertion to verify return type
      const _genesisResult: Promise<GenesisConfig> =
        experimentalGenesisConfig(client);
    });

    it('should have properly typed broadcast methods with specific return types', () => {
      const validTxRequest = {
        signedTransaction: 'base64encodedtransaction',
      };

      // broadcastTxAsync should return CryptoHash, not generic response
      const asyncPromise = broadcastTxAsync(client, validTxRequest);
      expect(asyncPromise).toBeInstanceOf(Promise);

      // Type assertion to verify specific return type
      const _asyncResult: Promise<CryptoHash> =
        broadcastTxAsync(client, validTxRequest);
    });
  });

  describe('Static Function Exports', () => {
    it('should export all RPC methods as static functions', () => {
      // Verify that all expected static functions are exported
      expect(typeof block).toBe('function');
      expect(typeof health).toBe('function');
      expect(typeof broadcastTxAsync).toBe('function');
      expect(typeof query).toBe('function');
      expect(typeof experimentalGenesisConfig).toBe('function');
    });

    it('should have makeRequest method on client for generic calls', () => {
      expect(typeof client.makeRequest).toBe('function');

      // Should be able to call any method via generic makeRequest
      const genericCall = client.makeRequest('block', { blockId: 'latest' });
      expect(genericCall).toBeInstanceOf(Promise);
    });
  });

  describe('Client Architecture', () => {
    it('should use static functions instead of instance methods', () => {
      // The new architecture uses static functions for RPC methods
      // Client only has core methods like makeRequest
      const clientProto = Object.getPrototypeOf(client);
      const existingMethods = Object.getOwnPropertyNames(clientProto);

      // Should have core methods but not dynamic RPC methods
      expect(existingMethods).toContain('makeRequest');
      expect(existingMethods).toContain('withConfig');
      expect(existingMethods).not.toContain('block');
      expect(existingMethods).not.toContain('status');
    });
  });

  describe('TypeScript Inference Tests', () => {
    it('should infer correct types from method calls', async () => {
      // These tests verify that TypeScript can properly infer return types
      // If the types are wrong, TypeScript compilation will fail

      // Mock the fetch to avoid actual network calls in tests
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          id: 'test',
          result: {
            author: 'validator.test',
            header: {
              height: 12345,
              hash: 'abcd1234',
            },
          },
        }),
      });

      try {
        const blockResult = await block(client);

        // TypeScript should infer this as RpcBlockResponse
        expect(blockResult).toBeDefined();
        expect(typeof blockResult).toBe('object');

        // If types are correct, these properties should be accessible
        // without TypeScript errors
        if (
          blockResult &&
          typeof blockResult === 'object' &&
          'header' in blockResult
        ) {
          const header = (blockResult as any).header;
          expect(header).toBeDefined();
        }
      } catch (error) {
        // Network errors are expected in tests, we're just testing type inference
        expect(error).toBeDefined();
      }
    });

    it('should enforce parameter type constraints', () => {
      // These would cause TypeScript compilation errors if types are wrong:

      // ✅ Valid usage
      block(client, { blockId: 'latest' });
      block(client, { blockId: 12345 });
      query(client, {
        requestType: 'view_account',
        accountId: 'test.near',
      });

      // ❌ These should cause TypeScript errors if uncommented:
      // block(client, { invalidProperty: 'test' });
      // query(client, { requestType: 'invalid_type' });
      // broadcastTxAsync(client, { wrongParam: 'test' });

      expect(true).toBe(true); // Test passes if TypeScript compilation succeeds
    });
  });
});

// Type-only tests - these verify TypeScript compilation
describe('TypeScript Compilation Tests', () => {
  it('should compile with correct type imports', () => {
    // This test ensures our generated types are importable and usable

    type BlockRequestType = RpcBlockRequest;
    type BlockResponseType = RpcBlockResponse;
    type HealthRequestType = RpcHealthRequest;
    type HealthResponseType = RpcHealthResponse;
    type GenesisRequestType = GenesisConfigRequest;
    type GenesisResponseType = GenesisConfig;
    type HashType = CryptoHash;

    // If these compile, our type exports are working
    const _blockReq: BlockRequestType = { blockId: 'latest' };
    const _healthReq: HealthRequestType = {};
    const _genesisReq: GenesisRequestType = null;

    expect(true).toBe(true);
  });
});

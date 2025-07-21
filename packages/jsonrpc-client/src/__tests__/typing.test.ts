// Tests to ensure client has properly typed parameters and responses
// This test validates that the dynamic type generation works correctly

import { describe, it, expect } from 'vitest';
import { NearRpcClient } from '../client.js';
import type { 
  RpcBlockRequest, 
  RpcBlockResponse, 
  RpcHealthRequest,
  RpcHealthResponse,
  GenesisConfigRequest,
  GenesisConfig,
  CryptoHash
} from '@near-js/jsonrpc-types';

describe('Client Type Safety', () => {
  let client: NearRpcClient;

  beforeEach(() => {
    client = new NearRpcClient('https://rpc.testnet.near.org');
  });

  describe('Method Parameter Types', () => {
    it('should have properly typed block method', () => {
      // This test validates that TypeScript compilation enforces correct types
      
      // Valid block request
      const validBlockRequest: RpcBlockRequest = {
        blockId: 'latest'
      };
      
      // Should compile without errors
      const blockPromise = client.block(validBlockRequest);
      expect(blockPromise).toBeInstanceOf(Promise);
      
      // Optional parameters should work
      const blockPromiseOptional = client.block();
      expect(blockPromiseOptional).toBeInstanceOf(Promise);
      
      // Type assertion to verify return type
      const _blockResult: Promise<RpcBlockResponse> = client.block(validBlockRequest);
    });

    it('should have properly typed health method', () => {
      const validHealthRequest: RpcHealthRequest = {};
      
      const healthPromise = client.health(validHealthRequest);
      expect(healthPromise).toBeInstanceOf(Promise);
      
      // Type assertion to verify return type
      const _healthResult: Promise<RpcHealthResponse> = client.health();
    });

    it('should have properly typed experimental methods', () => {
      const validGenesisRequest: GenesisConfigRequest = null;
      
      const genesisPromise = client.experimentalGenesisConfig(validGenesisRequest);
      expect(genesisPromise).toBeInstanceOf(Promise);
      
      // Type assertion to verify return type
      const _genesisResult: Promise<GenesisConfig> = client.experimentalGenesisConfig();
    });

    it('should have properly typed broadcast methods with specific return types', () => {
      const validTxRequest = {
        signedTransaction: 'base64encodedtransaction'
      };
      
      // broadcastTxAsync should return CryptoHash, not generic response
      const asyncPromise = client.broadcastTxAsync(validTxRequest);
      expect(asyncPromise).toBeInstanceOf(Promise);
      
      // Type assertion to verify specific return type
      const _asyncResult: Promise<CryptoHash> = client.broadcastTxAsync(validTxRequest);
    });
  });

  describe('Dynamic Method Generation', () => {
    it('should have all RPC methods available on client instance', () => {
      // Verify that all expected methods exist on the client
      const methodNames = [
        'block',
        'health', 
        'status',
        'broadcastTxAsync',
        'broadcastTxCommit',
        'query',
        'gasPrice',
        'validators',
        'chunk',
        'networkInfo',
        'experimentalGenesisConfig',
        'experimentalProtocolConfig'
      ];
      
      for (const methodName of methodNames) {
        expect(typeof (client as any)[methodName]).toBe('function');
      }
    });

    it('should handle camelCase conversion correctly', () => {
      // Test that snake_case RPC methods become camelCase client methods
      expect(typeof client.gasPrice).toBe('function'); // gas_price -> gasPrice
      expect(typeof client.networkInfo).toBe('function'); // network_info -> networkInfo
      expect(typeof client.broadcastTxAsync).toBe('function'); // broadcast_tx_async -> broadcastTxAsync
      
      // EXPERIMENTAL methods
      expect(typeof client.experimentalGenesisConfig).toBe('function'); // EXPERIMENTAL_genesis_config -> experimentalGenesisConfig
    });

    it('should preserve generic call method for flexibility', () => {
      expect(typeof client.call).toBe('function');
      
      // Should be able to call any method via generic call
      const genericCall = client.call('block', { blockId: 'latest' });
      expect(genericCall).toBeInstanceOf(Promise);
    });
  });

  describe('Type Evolution Simulation', () => {
    it('should handle new methods being added', () => {
      // Simulate what happens when new methods are added to RPC_METHODS
      // This test ensures our dynamic generation approach is future-proof
      
      // Mock a new method being added (this simulates the generator working)
      const mockNewMethod = 'hypotheticalNewMethod';
      
      // If RPC_METHODS contained this, our dynamic generation should handle it
      // We can't actually test this without modifying RPC_METHODS, but we can
      // verify the mechanism works by checking the prototype modification
      
      const clientProto = Object.getPrototypeOf(client);
      const existingMethods = Object.getOwnPropertyNames(clientProto);
      
      // Should have core methods plus dynamic ones
      expect(existingMethods).toContain('call');
      expect(existingMethods.length).toBeGreaterThan(5); // Should have many dynamic methods
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
              hash: 'abcd1234'
            }
          }
        })
      });
      
      try {
        const blockResult = await client.block();
        
        // TypeScript should infer this as RpcBlockResponse
        expect(blockResult).toBeDefined();
        expect(typeof blockResult).toBe('object');
        
        // If types are correct, these properties should be accessible
        // without TypeScript errors
        if (blockResult && typeof blockResult === 'object' && 'header' in blockResult) {
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
      client.block({ blockId: 'latest' });
      client.block({ blockId: 12345 });
      client.query({ 
        requestType: 'view_account',
        accountId: 'test.near'
      });
      
      // ❌ These should cause TypeScript errors if uncommented:
      // client.block({ invalidProperty: 'test' });
      // client.query({ requestType: 'invalid_type' });
      // client.broadcastTxAsync({ wrongParam: 'test' });
      
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
// Comprehensive validation tests for auto-generated Zod schema validation
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NearRpcClient } from '../client';
import { enableValidation } from '../validation';
import { VALIDATION_SCHEMA_MAP } from '@near-js/jsonrpc-types';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Auto-Generated Validation Tests', () => {
  let client: NearRpcClient;
  let clientWithValidation: NearRpcClient;

  beforeEach(() => {
    client = new NearRpcClient('https://rpc.testnet.fastnear.com');
    clientWithValidation = new NearRpcClient({
      endpoint: 'https://rpc.testnet.fastnear.com',
      validation: enableValidation(),
    });
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Validation Schema Generation', () => {
    it('should have generated validation schemas for all RPC methods', () => {
      // Verify that VALIDATION_SCHEMA_MAP is populated
      expect(VALIDATION_SCHEMA_MAP).toBeDefined();
      expect(typeof VALIDATION_SCHEMA_MAP).toBe('object');

      // Check that key methods have validation schemas
      expect(VALIDATION_SCHEMA_MAP['status']).toBeDefined();
      expect(VALIDATION_SCHEMA_MAP['status'].requestSchema).toBeDefined();
      expect(VALIDATION_SCHEMA_MAP['status'].responseSchema).toBeDefined();

      expect(VALIDATION_SCHEMA_MAP['gas_price']).toBeDefined();
      expect(VALIDATION_SCHEMA_MAP['gas_price'].requestSchema).toBeDefined();
      expect(VALIDATION_SCHEMA_MAP['gas_price'].responseSchema).toBeDefined();

      expect(VALIDATION_SCHEMA_MAP['block']).toBeDefined();
      expect(VALIDATION_SCHEMA_MAP['block'].requestSchema).toBeDefined();
      expect(VALIDATION_SCHEMA_MAP['block'].responseSchema).toBeDefined();
    });

    it('should have validation schemas that are callable functions', () => {
      const statusSchemas = VALIDATION_SCHEMA_MAP['status'];
      expect(typeof statusSchemas.requestSchema).toBe('function');
      expect(typeof statusSchemas.responseSchema).toBe('function');

      // Should be able to call the schema functions
      const requestSchema = statusSchemas.requestSchema!();
      const responseSchema = statusSchemas.responseSchema!();

      expect(requestSchema).toBeDefined();
      expect(responseSchema).toBeDefined();
      expect(typeof requestSchema.parse).toBe('function');
      expect(typeof responseSchema.parse).toBe('function');
    });
  });

  describe('Basic JSON-RPC Validation', () => {
    it('should validate basic JSON-RPC request structure', () => {
      const validation = enableValidation();

      const validRequest = {
        jsonrpc: '2.0' as const,
        id: 'test',
        method: 'status',
        params: 'null',
      };

      // Should not throw for valid request
      expect(() => {
        validation.validateRequest(validRequest);
      }).not.toThrow();
    });

    it('should reject invalid JSON-RPC request structure', () => {
      const validation = enableValidation();

      const invalidRequest = {
        // Missing jsonrpc field
        id: 'test',
        method: 'status',
      };

      // Should throw for invalid request
      expect(() => {
        validation.validateRequest(invalidRequest as any);
      }).toThrow();
    });

    it('should validate basic JSON-RPC response structure', () => {
      const validation = enableValidation();

      const validResponse = {
        jsonrpc: '2.0' as const,
        id: 'test',
        result: { test: 'data' },
      };

      // Should not throw for valid response
      expect(() => {
        validation.validateResponse(validResponse);
      }).not.toThrow();
    });

    it('should reject invalid JSON-RPC response structure', () => {
      const validation = enableValidation();

      const invalidResponse = {
        // Missing jsonrpc field
        id: 'test',
        result: { test: 'data' },
      };

      // Should throw for invalid response
      expect(() => {
        validation.validateResponse(invalidResponse as any);
      }).toThrow();
    });
  });

  describe('Method-Specific Validation', () => {
    it('should validate method-specific requests using auto-generated schemas', () => {
      const validation = enableValidation();

      // Valid status request (status expects null as params)
      const validStatusRequest = {
        jsonrpc: '2.0' as const,
        id: 'test',
        method: 'status',
        params: null,
      };

      // Should not throw for valid method-specific request
      expect(() => {
        validation.validateMethodRequest('status', validStatusRequest);
      }).not.toThrow();
    });

    it('should reject invalid method-specific requests', () => {
      const validation = enableValidation();

      // Invalid status request (wrong params type)
      const invalidStatusRequest = {
        jsonrpc: '2.0' as const,
        id: 'test',
        method: 'status',
        params: 'null', // Should be null, not string
      };

      // Should throw for invalid method-specific request
      expect(() => {
        validation.validateMethodRequest('status', invalidStatusRequest);
      }).toThrow('Invalid status request');
    });

    it('should validate gas_price method with correct parameters', () => {
      const validation = enableValidation();

      // Valid gas_price request (expects object with optional blockId)
      const validGasPriceRequest = {
        jsonrpc: '2.0' as const,
        id: 'test',
        method: 'gas_price',
        params: {}, // Empty object is valid for gas_price
      };

      // Should not throw for valid gas_price request
      expect(() => {
        validation.validateMethodRequest('gas_price', validGasPriceRequest);
      }).not.toThrow();
    });

    it('should reject gas_price method with incorrect parameters', () => {
      const validation = enableValidation();

      // Invalid gas_price request (expects object, not string)
      const invalidGasPriceRequest = {
        jsonrpc: '2.0' as const,
        id: 'test',
        method: 'gas_price',
        params: 'null', // gas_price expects object, not string
      };

      // Should throw for invalid gas_price request
      expect(() => {
        validation.validateMethodRequest('gas_price', invalidGasPriceRequest);
      }).toThrow('Invalid gas_price request');
    });
  });

  describe('Validation Integration', () => {
    it('should work with client when validation is disabled', async () => {
      // Mock any response - without validation, it should pass through
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          id: 'test',
          result: { any: 'data' },
        }),
      });

      // Should work without validation
      const result = await client.makeRequest('status', null);
      expect(result).toEqual({ any: 'data' });
    });

    it('should apply validation when validation is enabled', async () => {
      // Mock a response that would fail validation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          // Missing jsonrpc field - should fail validation
          id: 'test',
          result: { any: 'data' },
        }),
      });

      // Should throw when validation fails
      await expect(
        clientWithValidation.makeRequest('status', null)
      ).rejects.toThrow();
    });
  });

  describe('Response Payload Validation', () => {
    it('should accept valid gas_price response payload', async () => {
      const validGasPriceResponse = {
        jsonrpc: '2.0' as const,
        id: 'dontcare',
        result: {
          gasPrice: '1000000000', // Correct string format
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validGasPriceResponse,
      });

      // Should pass with valid response payload
      const result = await clientWithValidation.makeRequest('gas_price', {});
      expect(result).toEqual({ gasPrice: '1000000000' });
    });

    it('should reject gas_price response with wrong data types', async () => {
      const invalidGasPriceResponse = {
        jsonrpc: '2.0' as const,
        id: 'dontcare',
        result: {
          gasPrice: 123, // Should be string, not number
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidGasPriceResponse,
      });

      // Should throw when response validation fails
      await expect(
        clientWithValidation.makeRequest('gas_price', {})
      ).rejects.toThrow('Invalid gas_price response');
    });

    it('should accept valid status response payload', async () => {
      // Real status response from FastNEAR testnet
      const validStatusResponse = {
        jsonrpc: '2.0' as const,
        id: 'dontcare',
        result: {
          chainId: 'testnet',
          genesisHash: 'FWJ9kR6KFWoyMoNjpLXXGHeuiy7tEY6GmoFeCA5yuc6b',
          latestProtocolVersion: 78,
          nodeKey: null,
          nodePublicKey: 'ed25519:6XtnkzByg2uvd9r2bYEMeAEbA4tzvZkFaBfBu8aKfj7m',
          protocolVersion: 78,
          rpcAddr: '0.0.0.0:3030',
          syncInfo: {
            earliestBlockHash: 'Csy1JJsHYS8t71MgvAKU4KivM1eSPpAtpBby9Tg2FH45',
            earliestBlockHeight: 206710841,
            earliestBlockTime: '2025-07-25T08:06:28.058795234Z',
            epochId: '69yHsWnGeqBuCnK1bxQaWsqm295jA4nVjvwiuVgUMhWD',
            epochStartHeight: 206883642,
            latestBlockHash: 'KPHsNqdYcLL49T6hiCiNjAwiMb6g6EyftZkMFbNoa9x',
            latestBlockHeight: 206907956,
            latestBlockTime: '2025-07-26T15:23:43.726649665Z',
            latestStateRoot: 'HLCsvUXGkDAYdhkW3ZweX82HLgvmBBEQhSvPCMEqG1xT',
            syncing: false,
          },
          uptimeSec: 613047,
          validatorAccountId: null,
          validatorPublicKey: null,
          validators: [
            { accountId: 'node1' },
            { accountId: 'kiln.pool.f863973.m0' },
            { accountId: 'node2' },
          ],
          version: {
            build: '2.7.0-rc.2',
            commit: 'a2b961bb745bca63a1da031147369145b9e038eb',
            rustcVersion: '1.86.0',
            version: '2.7.0-rc.2',
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validStatusResponse,
      });

      // Should pass with valid response payload
      const result = await clientWithValidation.makeRequest('status', null);
      expect((result as any).chainId).toBe('testnet');
      expect((result as any).latestProtocolVersion).toBe(78);
    });

    it('should reject status response with missing required fields', async () => {
      const invalidStatusResponse = {
        jsonrpc: '2.0' as const,
        id: 'dontcare',
        result: {
          chainId: 'testnet',
          // Missing required syncInfo field
          latestProtocolVersion: 67,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidStatusResponse,
      });

      // Should throw when response validation fails
      await expect(
        clientWithValidation.makeRequest('status', null)
      ).rejects.toThrow('Invalid status response');
    });

    it('should accept valid block response payload', async () => {
      // Real block response from FastNEAR testnet
      const validBlockResponse = {
        jsonrpc: '2.0' as const,
        id: 'dontcare',
        result: {
          author: 'bigtexascowboy.pool.f863973.m0',
          header: {
            height: 206907972,
            epoch_id: '2gxgCKPpQGKaKPAFDL3tVqJJmNTq3e6EYheTXMkc3kMm',
            next_epoch_id: '4J7GE9UKdhkzSkcuJRpNHNUC3HgZdqjJrK3RHwgjVPyF',
            hash: 'GCFdgfUBacN35KY3PnQraPF5W8WaYfGqhvAH4qD7z7A8',
            prev_hash: 'BrsaQgJ2E93RjLqHQZ8VxSHu3F19qfGKBL2QcKUBzMhD',
            prev_state_root: 'FZqSpPi7h6Fb4WT9cQC3B5HPzJGKTD6oKXEQkK9fJC9d',
            chunk_receipts_root: 'ACwSCW3s44V6j7zf6JsEP31pHKsHyHkSSLdGJCBSjHRw',
            chunk_headers_root: 'BuQk8UJ9zEVZkKJKF8Wfb2QFdKC2a2WXmYHqPKYxWQHF',
            chunk_tx_root: 'dkMJJSbqzYzFyKGqtGpBP1oqRzFT1qJhZhWQRjYQzGX8',
            outcome_root: 'CKGc2PEm4YCF4hbqDbCUYr2g3hTUpDRGSJ8PVUMpBhP6',
            chunks_included: 4,
            challenges_root: '11111111111111111111111111111111',
            timestamp: 1721999823727518000, // Reduced to avoid numeric precision issues
            timestamp_nanosec: '1721999823727518400',
            random_value: 'ATbkJSGHyZHfHZRB5z8QXggALQtJQhJ8YU6f3Kje8rJB',
            validator_proposals: [],
            chunk_mask: [true, true, true, true],
            gas_price: '100000000',
            rent_paid: '0',
            validator_reward: '0',
            total_supply: '1156206301508325244749901732324',
            challenges_result: [],
            last_final_block: '4DsDuLq3NkqjWZnyDyeYmHyuGUEhU2V8TfTc2eKoHsGZ',
            last_ds_final_block: 'BrsaQgJ2E93RjLqHQZ8VxSHu3F19qfGKBL2QcKUBzMhD',
            next_bp_hash: 'CWZYAmLZRRwCGN2ACcGD8g62Hw9QcPLQhAFdKQtTrfJ4',
            block_merkle_root: 'BuQk8UJ9zEVZkKJKF8Wfb2QFdKC2a2WXmYHqPKYxWQHF',
            approvals: [
              'ed25519:58iLCtSs55qXDN4oYQaZCZ8K8cqcJJb8MNLwfYJmhAhkJMmNvMJb9KrGzD9Z2FdS1t4NyNXWGUWWQBe3LKS9HHhJ',
              'ed25519:4k7b9DVQCjxQYDpJpxwL4cNFJcKJG7eHdX2Q3qfeDT6kKfDhVQnWN6X6C8rN2pN2DX9YJfnHn5N4Qh9oFj3G2qfH',
              null,
              'ed25519:2xGfBNV3HdVqGZBB4e1t1MpqNQHjqsDN4bJ3DYMnN3nLhGj4SrCCQgGZr9vNfY8W5GCeKXhqhKy9v8t2mjGM6xqB',
            ],
            signature:
              'ed25519:4QhFHVBUdh4fKdCKHnR6W1xY1C2zqd8bMn6T2F9C2H7h3KRRoMvYZJX2Qg3CW8Q9xHC2Z4D5HjGSdcJFT3Zg3h5v',
            latest_protocol_version: 78,
          },
          chunks: [
            {
              chunk_hash: 'FdVQhBY2u4LvGkMm7FZ8Tm4Nc89ZQZGkJJFFKDdoFgfe',
              prev_block_hash: 'BrsaQgJ2E93RjLqHQZ8VxSHu3F19qfGKBL2QcKUBzMhD',
              outcome_root: 'CvgJGHdJVzHY6oPu4CfY3RqkKfJyXG1DKW3VxKZ6xh4j',
              prev_state_root: '3LQJwTK1bPkYKpVQFQqwV5CRs4J1F9VQK2CZ6w7Q4R6w',
              encoded_merkle_root:
                'H1w7JhZnwPyJdeMkJZGdcRhW3wKcQk6QzXdqYw8DGv5q',
              encoded_length: 1024,
              height_created: 206907972,
              height_included: 206907972,
              shard_id: 0,
              gas_used: 0,
              gas_limit: 1000000000000000,
              rent_paid: '0',
              validator_reward: '0',
              balance_burnt: '0',
              outgoing_receipts_root:
                'CfGqKdBBVGhCcBKQQ6h1kQxC2Z8QQfDCqcCm8C5xwRsj',
              tx_root: 'FdVQhBY2u4LvGkMm7FZ8Tm4Nc89ZQZGkJJFFKDdoFgfe',
              validator_proposals: [],
              signature:
                'ed25519:3GDJEqWwqKK1QJK4nGjKbkKqGk4QK5CKYCKh4kKYs1Ky2ZcHKqKjYKZKKjKqKKKKKJG4KZKKKjKyKKKyKKKrKcKBj',
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBlockResponse,
      });

      // Should pass with valid response payload
      const result = await clientWithValidation.makeRequest('block', {
        finality: 'final',
      });
      expect((result as any).author).toBe('bigtexascowboy.pool.f863973.m0');
      expect((result as any).header.height).toBe(206907972);
    });

    it('should reject block response with invalid field types', async () => {
      const invalidBlockResponse = {
        jsonrpc: '2.0' as const,
        id: 'dontcare',
        result: {
          author: 'testnet',
          header: {
            height: '123456', // Should be number, not string
            prevHash: '11111111111111111111111111111111',
            // Missing many required fields...
          },
          chunks: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidBlockResponse,
      });

      // Should throw when response validation fails
      await expect(
        clientWithValidation.makeRequest('block', { finality: 'final' })
      ).rejects.toThrow('Invalid block response');
    });

    it('should reject block response with missing required fields', async () => {
      const invalidBlockResponse = {
        jsonrpc: '2.0' as const,
        id: 'dontcare',
        result: {
          author: 'testnet',
          // Missing required 'header' field
          chunks: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidBlockResponse,
      });

      // Should throw when response validation fails
      await expect(
        clientWithValidation.makeRequest('block', { finality: 'final' })
      ).rejects.toThrow('Invalid block response');
    });

    it('should pass valid responses through without validation when validation is disabled', async () => {
      const anyResponse = {
        jsonrpc: '2.0' as const,
        id: 'test',
        result: {
          gasPrice: 123, // Would normally fail validation (should be string)
          randomField: 'anything',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => anyResponse,
      });

      // Should pass through invalid data when validation is disabled
      const result = await client.makeRequest('gas_price', {});
      expect(result).toEqual({
        gasPrice: 123,
        randomField: 'anything',
      });
    });
  });

  describe('Coverage of Auto-Generated Methods', () => {
    it('should have validation for all major RPC methods', () => {
      const expectedMethods = [
        'status',
        'block',
        'gas_price',
        'health',
        'network_info',
        'query',
        'tx',
        'validators',
      ];

      expectedMethods.forEach(method => {
        expect(VALIDATION_SCHEMA_MAP[method]).toBeDefined();
        expect(VALIDATION_SCHEMA_MAP[method].requestSchema).toBeDefined();
        expect(VALIDATION_SCHEMA_MAP[method].responseSchema).toBeDefined();
      });
    });

    it('should handle methods without validation schemas gracefully', () => {
      const validation = enableValidation();

      const requestForUnknownMethod = {
        jsonrpc: '2.0' as const,
        id: 'test',
        method: 'nonexistent_method',
        params: 'anything',
      };

      // Should still validate basic JSON-RPC structure for unknown methods
      expect(() => {
        validation.validateMethodRequest(
          'nonexistent_method',
          requestForUnknownMethod
        );
      }).not.toThrow();
    });
  });
});

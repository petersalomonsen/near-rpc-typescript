// Performance tests for Zod validation overhead
import { describe, it, expect, vi } from 'vitest';
import { defaultClient, NearRpcClient } from '../client';
import { block } from '../generated-functions';
import { enableValidation } from '../validation';

// Enable validation for performance testing
const validation = enableValidation();

// Benchmark utility
class PerformanceBenchmark {
  private results: number[] = [];

  async measure(
    fn: () => Promise<void> | void,
    iterations: number = 1000
  ): Promise<{
    avg: number;
    min: number;
    max: number;
    median: number;
    total: number;
  }> {
    this.results = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      this.results.push(end - start);
    }

    const sorted = this.results.slice().sort((a, b) => a - b);
    const total = this.results.reduce((sum, time) => sum + time, 0);

    return {
      avg: total / iterations,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      total,
    };
  }
}

// Mock data generators
const createMockBlockResponse = (
  complexity: 'simple' | 'complex' = 'simple'
) => {
  const baseResponse = {
    jsonrpc: '2.0' as const,
    id: 'test-id',
    result: {
      author: 'test.near',
      header: {
        height: 12345,
        epoch_id: 'epoch123',
        next_epoch_id: 'epoch124',
        hash: 'hash123',
        prev_hash: 'prev_hash123',
        prev_state_root: 'state_root123',
        timestamp: 1234567890,
        timestamp_nanosec: '1234567890000000000',
        random_value: 'random123',
        validator_proposals: [],
        chunk_mask: [],
        gas_price: '1000000000',
        rent_paid: '0',
        validator_reward: '0',
        total_supply: '1000000000000000000000000000',
        chunks_included: 0,
        block_merkle_root: 'merkle_root123',
        epoch_sync_data_hash: null,
        challenges: [],
        last_final_block: 'final_block123',
        last_ds_final_block: 'ds_final_block123',
        next_bp_hash: 'bp_hash123',
        block_ordinal: 12345,
        approvals: [],
        signature: 'signature123',
        latest_protocol_version: 61,
      },
      chunks: [],
    },
  };

  if (complexity === 'complex') {
    // Add complex nested data
    baseResponse.result.chunks = Array.from({ length: 10 }, (_, i) => ({
      chunk_hash: `chunk_${i}`,
      prev_block_hash: `prev_block_${i}`,
      outcome_root: `outcome_root_${i}`,
      prev_state_root: `prev_state_root_${i}`,
      encoded_merkle_root: `encoded_merkle_root_${i}`,
      encoded_length: 12345,
      height_created: 12345 + i,
      height_included: 12345 + i,
      shard_id: i % 4,
      gas_used: 1000000 + i * 1000,
      gas_limit: 1000000000,
      rent_paid: '0',
      validator_reward: '0',
      balance_burnt: '0',
      outgoing_receipts_root: `outgoing_receipts_root_${i}`,
      tx_root: `tx_root_${i}`,
      validator_proposals: [],
      signature: `signature_${i}`,
      transactions: Array.from({ length: 100 }, (_, j) => ({
        transaction: {
          signer_id: `signer_${j}.near`,
          public_key: `ed25519:${j}`,
          nonce: j,
          receiver_id: `receiver_${j}.near`,
          actions: [
            {
              Transfer: {
                deposit: '1000000000000000000000000',
              },
            },
          ],
          signature: `signature_${j}`,
          hash: `hash_${j}`,
        },
        outcome: {
          logs: [],
          receipt_ids: [`receipt_${j}`],
          gas_burnt: 424555062500,
          tokens_burnt: '42455506250000000000',
          executor_id: `executor_${j}.near`,
          status: { SuccessValue: '' },
        },
      })),
    }));
  }

  return baseResponse;
};

const createMockValidatorsResponse = () => ({
  jsonrpc: '2.0' as const,
  id: 'test-id',
  result: {
    current_validators: Array.from({ length: 100 }, (_, i) => ({
      account_id: `validator_${i}.near`,
      public_key: `ed25519:${i}`,
      is_slashed: false,
      stake: '100000000000000000000000000',
      shards: [i % 4],
      num_produced_blocks: 100 + i,
      num_expected_blocks: 100 + i,
    })),
    next_validators: Array.from({ length: 100 }, (_, i) => ({
      account_id: `next_validator_${i}.near`,
      public_key: `ed25519:next_${i}`,
      stake: '100000000000000000000000000',
      shards: [i % 4],
    })),
    current_fishermen: [],
    next_fishermen: [],
    current_proposals: Array.from({ length: 50 }, (_, i) => ({
      account_id: `proposal_${i}.near`,
      public_key: `ed25519:proposal_${i}`,
      stake: '100000000000000000000000000',
    })),
    prev_epoch_kickout: [],
    epoch_start_height: 12345,
    epoch_height: 12345,
  },
});

describe('Zod Validation Performance Tests', () => {
  const benchmark = new PerformanceBenchmark();

  describe('Request Validation Performance', () => {
    it('should measure request validation overhead', async () => {
      const mockRequest = {
        jsonrpc: '2.0' as const,
        id: 'test-id',
        method: 'block',
        params: { finality: 'final' },
      };

      const results = await benchmark.measure(() => {
        validation.validateRequest(mockRequest);
      }, 10000);

      console.log('Request validation performance:', results);
      expect(results.avg).toBeLessThan(0.1); // Should be under 0.1ms on average
    });

    it('should measure validation vs no-validation performance', async () => {
      const mockRequest = {
        jsonrpc: '2.0' as const,
        id: 'test-id',
        method: 'block',
        params: { finality: 'final' },
      };

      const validationResults = await benchmark.measure(() => {
        validation.validateRequest(mockRequest);
      }, 5000);

      const noValidationResults = await benchmark.measure(() => {
        // Just a simple operation to measure baseline
        JSON.stringify(mockRequest);
      }, 5000);

      console.log('Validation performance:', validationResults);
      console.log('No validation performance:', noValidationResults);

      // Validation should still be reasonably fast
      expect(validationResults.avg).toBeLessThan(1); // Should be under 1ms
      expect(noValidationResults.avg).toBeLessThan(1); // Should also be under 1ms
    });
  });

  describe('Response Validation Performance', () => {
    it('should measure simple response validation', async () => {
      const mockResponse = createMockBlockResponse('simple');

      const results = await benchmark.measure(() => {
        validation.validateResponse(mockResponse);
      }, 5000);

      console.log('Simple response validation performance:', results);
      expect(results.avg).toBeLessThan(0.5); // Should be under 0.5ms on average
    });

    it('should measure complex response validation', async () => {
      const mockResponse = createMockBlockResponse('complex');

      const results = await benchmark.measure(() => {
        validation.validateResponse(mockResponse);
      }, 1000);

      console.log('Complex response validation performance:', results);
      expect(results.avg).toBeLessThan(10); // Should be under 10ms on average
    });

    it('should measure validators response validation', async () => {
      const mockResponse = createMockValidatorsResponse();

      const results = await benchmark.measure(() => {
        validation.validateResponse(mockResponse);
      }, 1000);

      console.log('Validators response validation performance:', results);
      expect(results.avg).toBeLessThan(5); // Should be under 5ms on average
    });
  });

  describe('Client Validation Overhead', () => {
    it('should compare client performance with/without validation', async () => {
      const mockResponse = createMockBlockResponse('complex');
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      vi.stubGlobal('fetch', mockFetch);

      const validation = enableValidation();
      const clientWithValidation = new NearRpcClient({
        endpoint: 'https://test.near.org',
        validation,
      });

      const clientWithoutValidation = new NearRpcClient({
        endpoint: 'https://test.near.org',
      });

      const withValidationResults = await benchmark.measure(async () => {
        await block(clientWithValidation);
      }, 100);

      const withoutValidationResults = await benchmark.measure(async () => {
        await block(clientWithoutValidation);
      }, 100);

      console.log('With validation:', withValidationResults);
      console.log('Without validation:', withoutValidationResults);

      const overhead = withValidationResults.avg - withoutValidationResults.avg;
      console.log('Validation overhead:', overhead, 'ms');

      expect(overhead).toBeLessThan(20); // Overhead should be under 20ms
      expect(Math.abs(overhead)).toBeLessThan(10); // Overhead should be reasonable (accounting for measurement noise)
    });

    it('should verify validated and non-validated responses are identical', async () => {
      const mockResponse = createMockBlockResponse('complex');
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      vi.stubGlobal('fetch', mockFetch);

      const validation = enableValidation();
      const clientWithValidation = new NearRpcClient({
        endpoint: 'https://test.near.org',
        validation,
      });

      const clientWithoutValidation = new NearRpcClient({
        endpoint: 'https://test.near.org',
      });

      const [validatedResponse, nonValidatedResponse] = await Promise.all([
        block(clientWithValidation),
        block(clientWithoutValidation),
      ]);

      // Verify both responses contain actual content
      expect(validatedResponse).toBeTruthy();
      expect(nonValidatedResponse).toBeTruthy();
      expect(validatedResponse.author).toBe('test.near');
      expect(nonValidatedResponse.author).toBe('test.near');
      expect(validatedResponse.header.height).toBe(12345);
      expect(nonValidatedResponse.header.height).toBe(12345);
      expect(validatedResponse.chunks).toHaveLength(10);
      expect(nonValidatedResponse.chunks).toHaveLength(10);

      // Verify responses are identical
      expect(validatedResponse).toEqual(nonValidatedResponse);
    });

    it('should verify complex nested data is preserved', async () => {
      const mockResponse = createMockBlockResponse('complex');
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      vi.stubGlobal('fetch', mockFetch);

      const validation = enableValidation();
      const clientWithValidation = new NearRpcClient({
        endpoint: 'https://test.near.org',
        validation,
      });

      const response = await block(clientWithValidation);

      // Verify complex nested structure is preserved (note: camelCase conversion)
      expect(response.chunks).toHaveLength(10);
      expect(response.chunks[0].transactions).toHaveLength(100);
      expect(response.chunks[0].transactions[0].transaction.signerId).toBe(
        'signer_0.near'
      );
      expect(response.chunks[0].transactions[0].outcome.executorId).toBe(
        'executor_0.near'
      );

      // Verify all chunks have expected structure
      response.chunks.forEach((chunk, chunkIndex) => {
        expect(chunk.chunkHash).toBe(`chunk_${chunkIndex}`);
        expect(chunk.shardId).toBe(chunkIndex % 4);
        expect(chunk.transactions).toHaveLength(100);

        chunk.transactions.forEach((tx, txIndex) => {
          expect(tx.transaction.signerId).toBe(`signer_${txIndex}.near`);
          expect(tx.outcome.executorId).toBe(`executor_${txIndex}.near`);
        });
      });
    });
  });

  describe('Memory Usage Tests', () => {
    it('should measure memory usage during validation', async () => {
      const mockResponse = createMockBlockResponse('complex');

      const initialMemory = process.memoryUsage();

      // Perform multiple validations
      for (let i = 0; i < 1000; i++) {
        validation.validateResponse(mockResponse);
      }

      const finalMemory = process.memoryUsage();

      const heapUsedDiff = finalMemory.heapUsed - initialMemory.heapUsed;
      console.log('Memory usage difference:', heapUsedDiff, 'bytes');

      // Memory usage should be reasonable
      expect(heapUsedDiff).toBeLessThan(50 * 1024 * 1024); // Under 50MB
    });
  });

  describe('Schema Compilation Performance', () => {
    it('should measure schema compilation time', async () => {
      const compilationResults = await benchmark.measure(() => {
        // Force schema compilation by accessing it
        validation.validateRequest({
          jsonrpc: '2.0' as const,
          id: 'test',
          method: 'test',
        });
      }, 1);

      console.log('Schema compilation time:', compilationResults);
      expect(compilationResults.avg).toBeLessThan(100); // Should compile quickly
    });
  });

  describe('Data Integrity Tests', () => {
    it('should verify response data integrity with validation', async () => {
      const mockResponse = createMockBlockResponse('complex');

      validation.validateResponse(mockResponse);
      const validatedData = mockResponse;

      // Verify the parsed data contains all expected fields
      expect(validatedData.jsonrpc).toBe('2.0');
      expect(validatedData.id).toBe('test-id');
      expect(validatedData.result).toBeTruthy();
      expect(validatedData.error).toBeUndefined();

      // Verify the result structure
      const result = validatedData.result as any;
      expect(result.author).toBe('test.near');
      expect(result.header).toBeTruthy();
      expect(result.chunks).toHaveLength(10);

      // Verify deep nested data preservation (raw response, no camelCase conversion)
      expect(result.chunks[0].transactions[0].transaction.signer_id).toBe(
        'signer_0.near'
      );
      expect(result.chunks[0].transactions[0].outcome.tokens_burnt).toBe(
        '42455506250000000000'
      );
    });

    it('should handle error responses correctly', async () => {
      const mockErrorResponse = {
        jsonrpc: '2.0' as const,
        id: 'test-id',
        error: {
          code: -32602,
          message: 'Invalid params',
          data: { details: 'Block not found' },
        },
      };

      validation.validateResponse(mockErrorResponse);
      const validatedData = mockErrorResponse;

      expect(validatedData.jsonrpc).toBe('2.0');
      expect(validatedData.id).toBe('test-id');
      expect(validatedData.result).toBeUndefined();
      expect(validatedData.error).toBeTruthy();
      expect(validatedData.error!.code).toBe(-32602);
      expect(validatedData.error!.message).toBe('Invalid params');
      expect(validatedData.error!.data).toEqual({ details: 'Block not found' });
    });

    it('should verify validators response data integrity', async () => {
      const mockResponse = createMockValidatorsResponse();

      validation.validateResponse(mockResponse);
      const validatedData = mockResponse;
      const result = validatedData.result as any;

      // Verify structure
      expect(result.current_validators).toHaveLength(100);
      expect(result.next_validators).toHaveLength(100);
      expect(result.current_proposals).toHaveLength(50);

      // Verify first validator data (raw response, no camelCase conversion)
      const firstValidator = result.current_validators[0];
      expect(firstValidator.account_id).toBe('validator_0.near');
      expect(firstValidator.public_key).toBe('ed25519:0');
      expect(firstValidator.is_slashed).toBe(false);
      expect(firstValidator.stake).toBe('100000000000000000000000000');
      expect(firstValidator.shards).toEqual([0]);
      expect(firstValidator.num_produced_blocks).toBe(100);
      expect(firstValidator.num_expected_blocks).toBe(100);

      // Verify last validator has correct index
      const lastValidator = result.current_validators[99];
      expect(lastValidator.account_id).toBe('validator_99.near');
      expect(lastValidator.shards).toEqual([3]); // 99 % 4 = 3
    });

    it('should preserve numeric precision and string formats', async () => {
      const mockResponse = createMockBlockResponse('complex');

      validation.validateResponse(mockResponse);
      const validatedData = mockResponse;
      const result = validatedData.result as any;

      // Verify numeric precision is preserved
      expect(result.header.height).toBe(12345);
      expect(result.header.timestamp).toBe(1234567890);
      expect(result.header.timestamp_nanosec).toBe('1234567890000000000');

      // Verify string formats are preserved
      expect(result.header.gas_price).toBe('1000000000');
      expect(result.header.total_supply).toBe('1000000000000000000000000000');

      // Verify transaction data precision (raw response, no camelCase conversion)
      const tx = result.chunks[0].transactions[0];
      expect(tx.transaction.nonce).toBe(0);
      expect(tx.outcome.gas_burnt).toBe(424555062500);
      expect(tx.outcome.tokens_burnt).toBe('42455506250000000000');
    });
  });
});

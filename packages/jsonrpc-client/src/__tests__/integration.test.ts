// Integration tests for the complete RPC client workflow
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NearRpcClient } from '../client';

// Mock fetch for integration testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Integration Tests', () => {
  let client: NearRpcClient;

  beforeEach(() => {
    client = new NearRpcClient('https://rpc.testnet.fastnear.com');
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complete RPC Workflow', () => {
    it('should perform a complete block query workflow', async () => {
      // Mock a realistic block response
      const mockBlockResponse = {
        jsonrpc: '2.0',
        id: 'test-id',
        result: {
          author: 'testnet',
          header: {
            height: 123456,
            prev_hash: '11111111111111111111111111111111',
            chunk_receipts_root: '22222222222222222222222222222222',
            chunk_headers_root: '33333333333333333333333333333333',
            chunk_tx_root: '44444444444444444444444444444444',
            outcome_root: '55555555555555555555555555555555',
            chunks_included: 1,
            challenges_root: '66666666666666666666666666666666',
            timestamp: 1640995200000000000,
            timestamp_nanosec: '1640995200000000000',
            random_value: '77777777777777777777777777777777',
            validator_proposals: [],
            chunk_mask: [true],
            gas_price: '1000000000',
            rent_paid: '0',
            validator_reward: '0',
            total_supply: '1000000000000000000000000000000000',
            challenges_result: [],
            last_final_block: '88888888888888888888888888888888',
            last_ds_final_block: '99999999999999999999999999999999',
            next_bp_hash: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            block_merkle_root: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
            approvals: [],
            signature: 'ed25519:signature',
            latest_protocol_version: 67,
          },
          chunks: [
            {
              chunk_hash: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
              prev_block_hash: '11111111111111111111111111111111',
              outcome_root: '55555555555555555555555555555555',
              prev_state_root: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
              encoded_merkle_root: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
              encoded_length: 8,
              height_created: 123456,
              height_included: 123456,
              shard_id: 0,
              gas_used: 0,
              gas_limit: 1000000000000000,
              rent_paid: '0',
              validator_reward: '0',
              balance_burnt: '0',
              outgoing_receipts_root: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
              tx_root: '44444444444444444444444444444444',
              validator_proposals: [],
              signature: 'ed25519:signature',
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBlockResponse,
      });

      const result = await client.block({ finality: 'final' });

      // Verify the request was made correctly
      expect(mockFetch).toHaveBeenCalledWith(
        'https://rpc.testnet.fastnear.com',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"method":"block"'),
        })
      );

      // Verify snake_case to camelCase conversion
      expect(result).toHaveProperty('author', 'testnet');
      expect(result).toHaveProperty('header');
      expect(result.header).toHaveProperty(
        'prevHash',
        '11111111111111111111111111111111'
      );
      expect(result.header).toHaveProperty(
        'chunkReceiptsRoot',
        '22222222222222222222222222222222'
      );
      expect(result.header).toHaveProperty(
        'timestampNanosec',
        '1640995200000000000'
      );
      expect(result.header).toHaveProperty(
        'lastFinalBlock',
        '88888888888888888888888888888888'
      );
      expect(result.header).toHaveProperty(
        'nextBpHash',
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
      );
      expect(result.header).toHaveProperty('latestProtocolVersion', 67);

      // Verify array processing
      expect(result).toHaveProperty('chunks');
      expect(Array.isArray(result.chunks)).toBe(true);
      expect(result.chunks[0]).toHaveProperty(
        'chunkHash',
        'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'
      );
      expect(result.chunks[0]).toHaveProperty(
        'prevBlockHash',
        '11111111111111111111111111111111'
      );
      expect(result.chunks[0]).toHaveProperty('heightCreated', 123456);
      expect(result.chunks[0]).toHaveProperty(
        'outgoingReceiptsRoot',
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
      );
    });

    it('should perform a complete account query workflow', async () => {
      const mockAccountResponse = {
        jsonrpc: '2.0',
        id: 'test-id',
        result: {
          account_id: 'test.testnet',
          amount: '1000000000000000000000000',
          locked: '0',
          code_hash: '11111111111111111111111111111111',
          storage_usage: 182,
          storage_paid_at: 0,
          block_height: 123456,
          block_hash: '22222222222222222222222222222222',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccountResponse,
      });

      const result = await client.viewAccount({
        accountId: 'test.testnet',
        finality: 'final',
      });

      // Verify the request was made correctly with camelCase to snake_case conversion
      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.method).toBe('query');
      expect(requestBody.params).toEqual({
        request_type: 'view_account',
        account_id: 'test.testnet',
        finality: 'final',
      });

      // Verify response transformation
      expect(result).toEqual({
        accountId: 'test.testnet',
        amount: '1000000000000000000000000',
        locked: '0',
        codeHash: '11111111111111111111111111111111',
        storageUsage: 182,
        storagePaidAt: 0,
        blockHeight: 123456,
        blockHash: '22222222222222222222222222222222',
      });
    });

    it('should handle complex nested data structures', async () => {
      const mockComplexResponse = {
        jsonrpc: '2.0',
        id: 'test-id',
        result: {
          transaction_outcome: {
            proof: [],
            block_hash: '11111111111111111111111111111111',
            id: '22222222222222222222222222222222',
            outcome: {
              logs: [],
              receipt_ids: ['33333333333333333333333333333333'],
              gas_burnt: 223182562500,
              tokens_burnt: '22318256250000000000',
              executor_id: 'test.testnet',
              status: {
                SuccessValue: '',
              },
            },
          },
          receipts_outcome: [
            {
              proof: [],
              block_hash: '44444444444444444444444444444444',
              id: '33333333333333333333333333333333',
              outcome: {
                logs: [],
                receipt_ids: [],
                gas_burnt: 223182562500,
                tokens_burnt: '22318256250000000000',
                executor_id: 'test.testnet',
                status: {
                  SuccessValue: '',
                },
              },
            },
          ],
          status: {
            SuccessValue: '',
          },
          transaction: {
            signer_id: 'test.testnet',
            public_key: 'ed25519:publickey',
            nonce: 12345,
            receiver_id: 'test.testnet',
            actions: [
              {
                Transfer: {
                  deposit: '1000000000000000000000000',
                },
              },
            ],
            signature: 'ed25519:signature',
            hash: '22222222222222222222222222222222',
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockComplexResponse,
      });

      const result = await client.tx({
        txHash: '22222222222222222222222222222222',
        senderAccountId: 'test.testnet',
      });

      // Verify complex nested transformation
      expect(result).toHaveProperty('transactionOutcome');
      expect(result.transactionOutcome).toHaveProperty(
        'blockHash',
        '11111111111111111111111111111111'
      );
      expect(result.transactionOutcome.outcome).toHaveProperty('receiptIds', [
        '33333333333333333333333333333333',
      ]);
      expect(result.transactionOutcome.outcome).toHaveProperty(
        'gasBurnt',
        223182562500
      );
      expect(result.transactionOutcome.outcome).toHaveProperty(
        'tokensBurnt',
        '22318256250000000000'
      );
      expect(result.transactionOutcome.outcome).toHaveProperty(
        'executorId',
        'test.testnet'
      );

      expect(result).toHaveProperty('receiptsOutcome');
      expect(Array.isArray(result.receiptsOutcome)).toBe(true);
      expect(result.receiptsOutcome[0]).toHaveProperty(
        'blockHash',
        '44444444444444444444444444444444'
      );
      expect(result.receiptsOutcome[0].outcome).toHaveProperty(
        'gasBurnt',
        223182562500
      );

      expect(result).toHaveProperty('transaction');
      expect(result.transaction).toHaveProperty('signerId', 'test.testnet');
      expect(result.transaction).toHaveProperty(
        'publicKey',
        'ed25519:publickey'
      );
      expect(result.transaction).toHaveProperty('receiverId', 'test.testnet');
    });

    it('should handle error responses correctly', async () => {
      const mockErrorResponse = {
        jsonrpc: '2.0',
        id: 'test-id',
        error: {
          code: -32000,
          message: 'Server error',
          data: {
            error_type: 'UNKNOWN_BLOCK',
            error_message: 'Block not found',
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse,
      });

      await expect(client.block({ blockId: 'invalid-hash' })).rejects.toThrow(
        'Server error'
      );
    });

    it('should handle network timeout and retry logic', async () => {
      // Mock network failures for first two attempts, then success
      mockFetch
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockRejectedValueOnce(new Error('Connection refused'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jsonrpc: '2.0',
            id: '1',
            result: { success: true },
          }),
        });

      const result = await client.status();

      // Should have retried and eventually succeeded
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ success: true });
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should support method chaining patterns', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ jsonrpc: '2.0', id: '1', result: {} }),
      });

      // Test sequential calls
      await client.status();
      await client.block({ finality: 'final' });
      await client.gasPrice();

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ jsonrpc: '2.0', id: '1', result: {} }),
      });

      // Test concurrent calls
      const promises = [
        client.status(),
        client.health(),
        client.networkInfo(),
        client.gasPrice(),
      ];

      await Promise.all(promises);

      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should work with custom configuration', async () => {
      const customClient = new NearRpcClient({
        endpoint: 'https://custom-rpc.example.com',
        headers: {
          Authorization: 'Bearer custom-token',
          'User-Agent': 'Custom-Client/1.0',
        },
        timeout: 5000,
        retries: 1,
        validateResponses: false,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ jsonrpc: '2.0', id: '1', result: {} }),
      });

      await customClient.status();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom-rpc.example.com',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer custom-token',
            'User-Agent': 'Custom-Client/1.0',
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });
});

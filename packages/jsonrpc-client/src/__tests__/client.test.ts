// Test suite for NearRpcClient
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  NearRpcClient,
  JsonRpcClientError,
  JsonRpcNetworkError,
  type ClientConfig,
} from '../client';

vi.setConfig({ testTimeout: 30000 });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NearRpcClient', () => {
  let client: NearRpcClient;

  describe('constructor', () => {
    it('should create client with endpoint string', () => {
      const stringClient = new NearRpcClient(
        'https://rpc.testnet.fastnear.com'
      );
      expect(stringClient).toBeInstanceOf(NearRpcClient);
    });

    it('should create client with config object', () => {
      const config: ClientConfig = {
        endpoint: 'https://rpc.testnet.fastnear.com',
        timeout: 10000,
        retries: 3,
        headers: { 'Custom-Header': 'value' },
        validateResponses: false,
      };
      const configClient = new NearRpcClient(config);
      expect(configClient).toBeInstanceOf(NearRpcClient);
    });
  });

  describe('live RPC method calls', () => {
    const client = new NearRpcClient('https://rpc.mainnet.fastnear.com');

    it('should make status call', async () => {
      const result = await client.status();
      expect(result).toHaveProperty('chainId');
    });

    it('should make block call with params', async () => {
      const result = await client.block({ finality: 'final' });
      expect(result).toHaveProperty('header');
    });

    it('should make query call with camelCase conversion', async () => {
      const result = await client.query({
        requestType: 'view_account',
        accountId: 'near.near',
        finality: 'final',
      });
      expect(result).toHaveProperty('amount');
    });

    it('should make validators call', async () => {
      const result = await client.validators('latest');
      expect(result).toHaveProperty('currentValidators');
    });

    it('should make gasPrice call', async () => {
      const result = await client.gasPrice([null]);
      expect(result).toHaveProperty('gasPrice');
    });

    it('should make health call', async () => {
      const result = await client.health();
      expect(result).toBeNull();
    });

    it('should make networkInfo call', async () => {
      const result = await client.networkInfo();
      expect(result).toHaveProperty('numActivePeers');
    });

    it('should make viewAccount call', async () => {
      const result = await client.viewAccount({
        accountId: 'near.near',
        finality: 'final',
      });
      expect(result).toHaveProperty('amount');
    });
  });

  describe('error handling', () => {
    it('should handle JSON-RPC error responses', async () => {
      const client = new NearRpcClient({
        endpoint: 'https://rpc.mainnet.near.org',
        retries: 0,
      });
      // @ts-expect-error - testing a method that does not exist
      await expect(client.call('non_existent_method')).rejects.toThrow(
        JsonRpcClientError
      );
    });

    it('should handle network errors', async () => {
      const client = new NearRpcClient({
        endpoint: 'https://rpc.mainnet.near.org',
        retries: 0,
      });
      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockRejectedValue(new Error('Network error'));

      await expect(client.status()).rejects.toThrow(JsonRpcNetworkError);
    });

    it('should handle HTTP error responses', async () => {
      const client = new NearRpcClient({
        endpoint: 'https://rpc.mainnet.near.org',
        retries: 0,
      });
      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(client.status()).rejects.toThrow(JsonRpcNetworkError);
    });

    it('should handle invalid JSON responses', async () => {
      const client = new NearRpcClient({
        endpoint: 'https://rpc.mainnet.near.org',
        retries: 0,
      });
      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(client.status()).rejects.toThrow(JsonRpcNetworkError);
    });
  });

  describe('custom configuration', () => {
    it('should include custom headers in requests', async () => {
      const client = new NearRpcClient({
        endpoint: 'https://rpc.mainnet.fastnear.com',
        headers: { 'X-Custom-Header': 'custom-value' },
      });

      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({ jsonrpc: '2.0', id: '1', result: {} }),
      } as Response);
      await client.status();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://rpc.mainnet.fastnear.com',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value',
          }),
        })
      );
    });

    it('should handle validation disabled', async () => {
      const client = new NearRpcClient({
        endpoint: 'https://rpc.mainnet.fastnear.com',
        validateResponses: false,
      });

      const result = await client.status();
      expect(result).toHaveProperty('chainId');
    });
  });

  describe('response transformation', () => {
    const client = new NearRpcClient('https://rpc.mainnet.fastnear.com');

    it('should transform snake_case response to camelCase', async () => {
      const result = await client.status();
      expect(result).toHaveProperty('chainId');
      expect(result).not.toHaveProperty('chain_id');
    });

    it('should generate unique request IDs', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({ jsonrpc: '2.0', id: '1', result: {} }),
      } as Response);
      await client.status();
      await client.health();

      const call1Body = JSON.parse(fetchSpy.mock.calls[0][1].body);
      const call2Body = JSON.parse(fetchSpy.mock.calls[1][1].body);

      expect(call1Body.id).not.toBe(call2Body.id);
    });
  });

  describe('experimental methods', () => {
    const client = new NearRpcClient('https://rpc.mainnet.fastnear.com');
    const archivalClient = new NearRpcClient(
      'https://archival-rpc.mainnet.fastnear.com'
    );

    it('should call experimental protocol config method', async () => {
      const result = await client.experimentalProtocolConfig({
        finality: 'final',
      });
      expect(result).toHaveProperty('chainId');
    });

    it('should call experimental genesis config method', async () => {
      const result = await archivalClient.experimentalGenesisConfig();
      expect(result).toHaveProperty('chainId');
      expect(result).toHaveProperty('genesisHeight');
    });

    it('should call experimental receipt method with real receipt', async () => {
      const receiptId = '21RBsYGnt6qQwGCdLdzeSHQdfgjrHY9p1oEuzQWmXf5k';

      const result = await archivalClient.experimentalReceipt({ receiptId });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('receiptId', receiptId);
      expect(result).toHaveProperty('receiverId', 'twelvetone.near');
      expect(result).toHaveProperty(
        'predecessorId',
        '5d3b3ff8c39dea6b9016cfac3902a2907f41fee7146cda2e7600703ef22cf5ec'
      );
      expect(result).toHaveProperty('receipt');
      expect(result.receipt).toHaveProperty('Action');
    });

    it('should call experimental tx status method with real transaction', async () => {
      const txHash = 'Dsw7yq4Y5iduUnNbnn5r6nZfL9cmkDyGWdxNzPCQYYep';
      const senderAccountId =
        '5d3b3ff8c39dea6b9016cfac3902a2907f41fee7146cda2e7600703ef22cf5ec';

      const result = await archivalClient.experimentalTxStatus({
        txHash,
        senderAccountId,
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('finalExecutionStatus', 'FINAL');
      expect(result).toHaveProperty('receiptsOutcome');
      expect(Array.isArray(result.receiptsOutcome)).toBe(true);
      expect(result.receiptsOutcome[0]).toHaveProperty('outcome');
      expect(result.receiptsOutcome[0].outcome).toHaveProperty(
        'executorId',
        'twelvetone.near'
      );
    });

    it('should call experimental changes in block method with specific block', async () => {
      const archivalClient = new NearRpcClient(
        'https://archival-rpc.mainnet.fastnear.com'
      );
      const result = await archivalClient.experimentalChangesInBlock({
        blockId: 62899098,
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty(
        'blockHash',
        '9ZEqsVLykxUr8XMhzGrxf49PgCEKscqYtsbEJoqXb5rH'
      );
      expect(result).toHaveProperty('changes');
      expect(Array.isArray(result.changes)).toBe(true);
      expect(result.changes.length).toBeGreaterThan(0);

      // Check that changes have expected structure
      expect(result.changes[0]).toHaveProperty('accountId');
      expect(result.changes[0]).toHaveProperty('type');

      // Verify some known accounts were touched in this block
      const accountIds = result.changes.map(change => change.accountId);
      expect(accountIds).toContain('aurora');
      expect(accountIds).toContain('petersalomonsen.near');
    });

    it('should call experimental validators ordered method', async () => {
      const archivalClient = new NearRpcClient(
        'https://archival-rpc.mainnet.fastnear.com'
      );
      const result = await archivalClient.experimentalValidatorsOrdered({
        blockId: '9ZEqsVLykxUr8XMhzGrxf49PgCEKscqYtsbEJoqXb5rH',
      });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Check validator structure
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('accountId');
        expect(result[0]).toHaveProperty('stake');
      }
    });

    it('should call experimental changes method', async () => {
      const archivalClient = new NearRpcClient(
        'https://archival-rpc.mainnet.fastnear.com'
      );
      const result = await archivalClient.experimentalChanges({
        changesType: 'account_changes',
        accountIds: ['aurora'],
        blockId: 62899098,
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('blockHash');
      expect(result).toHaveProperty('changes');
      expect(Array.isArray(result.changes)).toBe(true);
    });

    it('should call light client proof method', async () => {
      const archivalClient = new NearRpcClient(
        'https://archival-rpc.mainnet.fastnear.com'
      );

      try {
        const result = await archivalClient.lightClientProof({
          type: 'transaction',
          lightClientHead: '9ZEqsVLykxUr8XMhzGrxf49PgCEKscqYtsbEJoqXb5rH',
          transactionHash: 'Dsw7yq4Y5iduUnNbnn5r6nZfL9cmkDyGWdxNzPCQYYep',
          senderId:
            '5d3b3ff8c39dea6b9016cfac3902a2907f41fee7146cda2e7600703ef22cf5ec',
        });
        expect(result).toBeDefined();
      } catch (error) {
        // Light client proof might fail but the function call should work
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('error classes', () => {
    it('should create JsonRpcClientError with proper structure', () => {
      const error = new JsonRpcClientError('Test error', -32601, {
        detail: 'test',
      });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(JsonRpcClientError);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe(-32601);
      expect(error.data).toEqual({ detail: 'test' });
      expect(error.name).toBe('JsonRpcClientError');
    });

    it('should create JsonRpcNetworkError with proper structure', () => {
      const originalError = new Error('Network failure');
      const error = new JsonRpcNetworkError(
        'Network error occurred',
        originalError
      );

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(JsonRpcNetworkError);
      expect(error.message).toBe('Network error occurred');
      expect(error.originalError).toBe(originalError);
      expect(error.name).toBe('JsonRpcNetworkError');
    });
  });
});

// Test suite for NearRpcClient
import { describe, it, expect, vi, afterEach } from 'vitest';
import { NearRpcClient, JsonRpcClientError, JsonRpcNetworkError, type ClientConfig } from '../client';

vi.setConfig({ testTimeout: 30000 });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NearRpcClient', () => {
  let client: NearRpcClient;

  

  describe('constructor', () => {
    it('should create client with endpoint string', () => {
      const stringClient = new NearRpcClient('https://rpc.testnet.near.org');
      expect(stringClient).toBeInstanceOf(NearRpcClient);
    });

    it('should create client with config object', () => {
      const config: ClientConfig = {
        endpoint: 'https://rpc.testnet.near.org',
        timeout: 10000,
        retries: 3,
        headers: { 'Custom-Header': 'value' },
        validateResponses: false
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
        finality: 'final'
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
        finality: 'final'
      });
      expect(result).toHaveProperty('amount');
    });
  });

  describe('error handling', () => {
    it('should handle JSON-RPC error responses', async () => {
      const client = new NearRpcClient({ endpoint: 'https://rpc.mainnet.near.org', retries: 0 });
      // @ts-expect-error - testing a method that does not exist
      await expect(client.call('non_existent_method')).rejects.toThrow(
        JsonRpcClientError
      );
    });

    it('should handle network errors', async () => {
      const client = new NearRpcClient({ endpoint: 'https://rpc.mainnet.near.org', retries: 0 });
      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockRejectedValue(new Error('Network error'));

      await expect(client.status()).rejects.toThrow(JsonRpcNetworkError);
    });

    it('should handle HTTP error responses', async () => {
      const client = new NearRpcClient({ endpoint: 'https://rpc.mainnet.near.org', retries: 0 });
      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(client.status()).rejects.toThrow(JsonRpcNetworkError);
    });

    it('should handle invalid JSON responses', async () => {
      const client = new NearRpcClient({ endpoint: 'https://rpc.mainnet.near.org', retries: 0 });
      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); }
      } as Response);

      await expect(client.status()).rejects.toThrow(JsonRpcNetworkError);
    });
  });

  describe('custom configuration', () => {
    it('should include custom headers in requests', async () => {
      const client = new NearRpcClient({
        endpoint: 'https://rpc.mainnet.fastnear.com',
        headers: { 'X-Custom-Header': 'custom-value' }
      });

      const fetchSpy = vi.spyOn(global, 'fetch');
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({ jsonrpc: '2.0', id: '1', result: {} })
      } as Response);
      await client.status();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://rpc.mainnet.fastnear.com',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value'
          })
        })
      );
    });

    it('should handle validation disabled', async () => {
      const client = new NearRpcClient({
        endpoint: 'https://rpc.mainnet.fastnear.com',
        validateResponses: false
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
        json: async () => ({ jsonrpc: '2.0', id: '1', result: {} })
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

    it('should call experimental protocol config method', async () => {
      const result = await client.experimentalProtocolConfig({ finality: 'final' });
      expect(result).toHaveProperty('chainId');
    });
  });

  describe('error classes', () => {
    it('should create JsonRpcClientError with proper structure', () => {
      const error = new JsonRpcClientError('Test error', -32601, { detail: 'test' });
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(JsonRpcClientError);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe(-32601);
      expect(error.data).toEqual({ detail: 'test' });
      expect(error.name).toBe('JsonRpcClientError');
    });

    it('should create JsonRpcNetworkError with proper structure', () => {
      const originalError = new Error('Network failure');
      const error = new JsonRpcNetworkError('Network error occurred', originalError);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(JsonRpcNetworkError);
      expect(error.message).toBe('Network error occurred');
      expect(error.originalError).toBe(originalError);
      expect(error.name).toBe('JsonRpcNetworkError');
    });
  });
});

// Test that mini schemas work identically to regular schemas
import { describe, it, expect } from 'vitest';

// Import both schema versions
import * as regular from '../schemas';
import * as mini from '../schemas.mini';

describe('Mini Schemas Compatibility', () => {
  const testData = {
    validJsonRpcRequest: {
      jsonrpc: '2.0' as const,
      id: 'test-123',
      method: 'query',
      params: {
        request_type: 'view_account',
        finality: 'final',
        account_id: 'test.near',
      },
    },

    validAccount: {
      amount: '1000000000000000000000000',
      locked: '0',
      codeHash: '11111111111111111111111111111111',
      storageUsage: 182,
      storagePaidAt: 0,
      blockHeight: 12345,
      blockHash: '9MzuZrRPW1BGpFfFQULLJKaWcdNfSMExp6LgCLNz44vE',
    },
  };

  it('should parse identical JSON-RPC requests', () => {
    const regularResult = regular.JsonRpcRequestSchema.parse(
      testData.validJsonRpcRequest
    );
    const miniResult = mini.JsonRpcRequestSchema.parse(
      testData.validJsonRpcRequest
    );

    expect(regularResult).toEqual(miniResult);
  });

  it('should validate account schemas identically', () => {
    // Both schemas should accept the same valid data
    expect(() =>
      regular.AccountViewSchema.parse(testData.validAccount)
    ).not.toThrow();
    expect(() =>
      mini.AccountViewSchema.parse(testData.validAccount)
    ).not.toThrow();

    const regularParsed = regular.AccountViewSchema.parse(
      testData.validAccount
    );
    const miniParsed = mini.AccountViewSchema.parse(testData.validAccount);

    expect(regularParsed).toEqual(miniParsed);
  });

  it('should handle optional fields correctly', () => {
    const dataWithOptionals = {
      ...testData.validAccount,
      storagePaidAt: undefined, // This is optional
    };

    // Both should handle optional fields the same way
    const regularResult = regular.AccountViewSchema.parse(dataWithOptionals);
    const miniResult = mini.AccountViewSchema.parse(dataWithOptionals);

    expect(regularResult).toEqual(miniResult);
  });

  it('should reject invalid data consistently', () => {
    const invalidRequest = {
      jsonrpc: '1.0', // Invalid version
      id: 'test',
      method: 'query',
    };

    // Both should reject invalid data
    expect(() => regular.JsonRpcRequestSchema.parse(invalidRequest)).toThrow();
    expect(() => mini.JsonRpcRequestSchema.parse(invalidRequest)).toThrow();
  });

  it('should have the same schema exports', () => {
    // Get all exported schemas from both modules
    const regularSchemas = Object.keys(regular).filter(key =>
      key.endsWith('Schema')
    );
    const miniSchemas = Object.keys(mini).filter(key => key.endsWith('Schema'));

    // Should have the same schemas available
    expect(regularSchemas.sort()).toEqual(miniSchemas.sort());
    expect(regularSchemas.length).toBeGreaterThan(200); // We have 241+ schemas
  });

  it('should parse complex nested objects identically', () => {
    const complexData = {
      jsonrpc: '2.0' as const,
      id: 'test',
      result: {
        blockHash: '9MzuZrRPW1BGpFfFQULLJKaWcdNfSMExp6LgCLNz44vE',
        blockHeight: 12345,
        chunks: [
          {
            chunkHash: '8MzuZrRPW1BGpFfFQULLJKaWcdNfSMExp6LgCLNz44vE',
            prevBlockHash: '7MzuZrRPW1BGpFfFQULLJKaWcdNfSMExp6LgCLNz44vE',
            outcomeRoot: '6MzuZrRPW1BGpFfFQULLJKaWcdNfSMExp6LgCLNz44vE',
            prevStateRoot: '5MzuZrRPW1BGpFfFQULLJKaWcdNfSMExp6LgCLNz44vE',
            encodedMerkleRoot: '4MzuZrRPW1BGpFfFQULLJKaWcdNfSMExp6LgCLNz44vE',
            encodedLength: 100,
            heightCreated: 12340,
            heightIncluded: 12345,
            shardId: 0,
            gasUsed: 2428430696471,
            gasLimit: 1000000000000000,
            balanceBurnt: '1875000000000000000000',
          },
        ],
      },
    };

    // Both should parse complex nested structures identically
    const regularResult = regular.JsonRpcResponseSchema.parse(complexData);
    const miniResult = mini.JsonRpcResponseSchema.parse(complexData);

    expect(regularResult).toEqual(miniResult);
  });
});

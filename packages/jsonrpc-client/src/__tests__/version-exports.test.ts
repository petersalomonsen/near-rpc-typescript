import { describe, it, expect } from 'vitest';

describe('Version-specific exports', () => {
  it('should export v1.0.0 functions', async () => {
    const v100 = await import('@near-js/jsonrpc-client/v1.0.0');

    expect(v100.status).toBeDefined();
    expect(v100.block).toBeDefined();
    expect(v100.query).toBeDefined();
    expect(v100.NearRpcClient).toBeDefined();
    expect(v100.parseCallResultToJson).toBeDefined();
    expect(v100.viewFunctionAsJson).toBeDefined();

    // v1.0.0 should have 28 methods
    const functionNames = Object.keys(v100).filter(
      key =>
        typeof v100[key as keyof typeof v100] === 'function' &&
        key !== 'NearRpcClient' &&
        key !== 'parseCallResultToJson' &&
        key !== 'viewFunctionAsJson' &&
        key !== 'viewAccount' &&
        key !== 'viewFunction' &&
        key !== 'viewAccessKey' &&
        key !== 'enableValidation'
    );
    expect(functionNames.length).toBe(28);
  });

  it('should export v1.1.0 functions', async () => {
    const v110 = await import('@near-js/jsonrpc-client/v1.1.0');

    expect(v110.status).toBeDefined();
    expect(v110.block).toBeDefined();
    expect(v110.query).toBeDefined();
    expect(v110.NearRpcClient).toBeDefined();

    // v1.1.0 should have 28 methods
    const functionNames = Object.keys(v110).filter(
      key =>
        typeof v110[key as keyof typeof v110] === 'function' &&
        key !== 'NearRpcClient' &&
        key !== 'parseCallResultToJson' &&
        key !== 'viewFunctionAsJson' &&
        key !== 'viewAccount' &&
        key !== 'viewFunction' &&
        key !== 'viewAccessKey' &&
        key !== 'enableValidation'
    );
    expect(functionNames.length).toBe(28);
  });

  it('should export v1.1.1 functions', async () => {
    const v111 = await import('@near-js/jsonrpc-client/v1.1.1');

    expect(v111.status).toBeDefined();
    expect(v111.block).toBeDefined();
    expect(v111.query).toBeDefined();
    expect(v111.NearRpcClient).toBeDefined();

    // v1.1.1 should have 31 methods (includes new methods)
    const functionNames = Object.keys(v111).filter(
      key =>
        typeof v111[key as keyof typeof v111] === 'function' &&
        key !== 'NearRpcClient' &&
        key !== 'parseCallResultToJson' &&
        key !== 'viewFunctionAsJson' &&
        key !== 'viewAccount' &&
        key !== 'viewFunction' &&
        key !== 'viewAccessKey' &&
        key !== 'enableValidation'
    );
    expect(functionNames.length).toBe(31);

    // Check for new methods in v1.1.1
    expect(v111.genesisConfig).toBeDefined();
    expect(v111.changes).toBeDefined();
    expect(v111.maintenanceWindows).toBeDefined();
  });

  it('should export latest version functions', async () => {
    const latest = await import('@near-js/jsonrpc-client/latest');

    expect(latest.status).toBeDefined();
    expect(latest.block).toBeDefined();
    expect(latest.query).toBeDefined();
    expect(latest.NearRpcClient).toBeDefined();

    // Latest should have the same methods as v1.1.1
    const functionNames = Object.keys(latest).filter(
      key =>
        typeof latest[key as keyof typeof latest] === 'function' &&
        key !== 'NearRpcClient' &&
        key !== 'parseCallResultToJson' &&
        key !== 'viewFunctionAsJson' &&
        key !== 'viewAccount' &&
        key !== 'viewFunction' &&
        key !== 'viewAccessKey' &&
        key !== 'enableValidation'
    );
    expect(functionNames.length).toBe(31);
  });

  it('should export no-validation versions', async () => {
    const v100NoVal = await import(
      '@near-js/jsonrpc-client/v1.0.0/no-validation'
    );

    expect(v100NoVal.status).toBeDefined();
    expect(v100NoVal.NearRpcClient).toBeDefined();
    expect(v100NoVal.parseCallResultToJson).toBeDefined();
    expect(v100NoVal.viewFunctionAsJson).toBeDefined();

    // No validation versions should not have enableValidation
    expect(v100NoVal.enableValidation).toBeUndefined();
  });

  it('should allow using different versions side by side', async () => {
    const v100 = await import('@near-js/jsonrpc-client/v1.0.0');
    const v111 = await import('@near-js/jsonrpc-client/v1.1.1');

    // Create clients for different versions
    const clientV100 = new v100.NearRpcClient(
      'https://rpc.mainnet.fastnear.com'
    );
    const clientV111 = new v111.NearRpcClient(
      'https://rpc.mainnet.fastnear.com'
    );

    // Both should work
    expect(clientV100).toBeDefined();
    expect(clientV111).toBeDefined();

    // v1.1.1 should have methods that v1.0.0 doesn't
    expect(v111.genesisConfig).toBeDefined();
    expect((v100 as any).genesisConfig).toBeUndefined();
  });
});

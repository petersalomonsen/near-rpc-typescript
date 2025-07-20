import { test, expect } from '@playwright/test';

test.describe('NEAR RPC One-Liner Browser Tests', () => {
  test('should work as one-liner dynamic import from any page', async ({ page }) => {
    // Go to any page (using about:blank for minimal load)
    await page.goto('about:blank');
    
    // Execute the one-liner from the README
    const result = await page.evaluate(async () => {
      const { NearRpcClient } = await import('https://unpkg.com/@psalomo/jsonrpc-client@0.1.0/dist/browser-standalone.js');
      const client = new NearRpcClient('https://rpc.testnet.near.org');
      const block = await client.block({ finality: 'final' });
      return {
        height: block.header.height,
        hash: block.header.hash,
        success: true
      };
    });

    // Verify the result
    expect(result).toHaveProperty('height');
    expect(result).toHaveProperty('hash');
    expect(result).toHaveProperty('success', true);
    expect(typeof result.height).toBe('number');
    expect(typeof result.hash).toBe('string');
    expect(result.height).toBeGreaterThan(0);
    expect(result.hash).toHaveLength(44); // NEAR block hashes are 44 characters
  });

  test('should work with local bundle via data URL', async ({ page }) => {
    // Go to any page
    await page.goto('about:blank');
    
    // Read the local bundle and create a data URL
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const bundlePath = join(process.cwd(), 'packages/jsonrpc-client/dist/browser-standalone.js');
    const bundleContent = readFileSync(bundlePath, 'utf8');
    const dataUrl = `data:text/javascript;base64,${Buffer.from(bundleContent).toString('base64')}`;
    
    // Execute using the data URL (simulates the one-liner but with local bundle)
    const result = await page.evaluate(async (bundleDataUrl) => {
      const { NearRpcClient } = await import(bundleDataUrl);
      const client = new NearRpcClient('https://rpc.testnet.near.org');
      const block = await client.block({ finality: 'final' });
      return {
        height: block.header.height,
        hash: block.header.hash,
        timestamp: block.header.timestamp,
        success: true
      };
    }, dataUrl);

    // Verify the result
    expect(result).toHaveProperty('height');
    expect(result).toHaveProperty('hash');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('success', true);
    expect(typeof result.height).toBe('number');
    expect(typeof result.hash).toBe('string');
    expect(typeof result.timestamp).toBe('number');
    expect(result.height).toBeGreaterThan(0);
  });

  test('should work when pasted into any website console', async ({ page }) => {
    // Go to a real website to simulate real-world usage
    await page.goto('https://example.com');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Execute the one-liner as if pasted into console
    const result = await page.evaluate(async () => {
      // This simulates what a user would paste into browser console
      const { NearRpcClient } = await import('https://unpkg.com/@psalomo/jsonrpc-client@0.1.0/dist/browser-standalone.js');
      const client = new NearRpcClient('https://rpc.testnet.near.org');
      
      // Test multiple RPC calls to ensure robustness
      const [block, status, gasPrice] = await Promise.all([
        client.block({ finality: 'final' }),
        client.status(),
        client.gasPrice({})
      ]);
      
      return {
        blockHeight: block.header.height,
        chainId: status.chainId,
        gasPrice: gasPrice.gasPrice,
        allSuccess: true
      };
    });

    // Verify multiple RPC calls worked
    expect(result).toHaveProperty('blockHeight');
    expect(result).toHaveProperty('chainId', 'testnet');
    expect(result).toHaveProperty('gasPrice');
    expect(result).toHaveProperty('allSuccess', true);
    expect(typeof result.blockHeight).toBe('number');
    expect(typeof result.gasPrice).toBe('string');
  });

  test('should handle errors gracefully in one-liner', async ({ page }) => {
    await page.goto('about:blank');
    
    // Test error handling with invalid endpoint
    const result = await page.evaluate(async () => {
      try {
        const { NearRpcClient } = await import('https://unpkg.com/@psalomo/jsonrpc-client@0.1.0/dist/browser-standalone.js');
        const client = new NearRpcClient('https://invalid-endpoint.example.com');
        await client.block({ finality: 'final' });
        return { success: false, error: 'Should have thrown' };
      } catch (error) {
        return { 
          success: true, 
          errorHandled: true,
          errorMessage: error.message || 'Unknown error'
        };
      }
    });

    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('errorHandled', true);
    expect(result).toHaveProperty('errorMessage');
    expect(typeof result.errorMessage).toBe('string');
  });

  test('should work with different RPC methods in one-liner style', async ({ page }) => {
    await page.goto('about:blank');
    
    // Test various RPC methods that can be called in one-liner style
    const result = await page.evaluate(async () => {
      const { NearRpcClient } = await import('https://unpkg.com/@psalomo/jsonrpc-client@0.1.0/dist/browser-standalone.js');
      const client = new NearRpcClient('https://rpc.testnet.near.org');
      
      // Get latest block for height
      const latestBlock = await client.block({ finality: 'final' });
      const targetHeight = latestBlock.header.height - 10;
      
      // Test different method signatures
      const results = await Promise.allSettled([
        client.block({ blockId: targetHeight }),
        client.status(),
        client.gasPrice({}),
        client.viewAccount({ accountId: 'example.testnet', finality: 'final' })
      ]);
      
      return {
        blockQuery: results[0].status === 'fulfilled',
        statusQuery: results[1].status === 'fulfilled',
        gasPriceQuery: results[2].status === 'fulfilled',
        accountQuery: results[3].status === 'fulfilled',
        allSuccessful: results.every(r => r.status === 'fulfilled')
      };
    });

    expect(result).toHaveProperty('blockQuery', true);
    expect(result).toHaveProperty('statusQuery', true);
    expect(result).toHaveProperty('gasPriceQuery', true);
    expect(result).toHaveProperty('accountQuery', true);
    expect(result).toHaveProperty('allSuccessful', true);
  });
});
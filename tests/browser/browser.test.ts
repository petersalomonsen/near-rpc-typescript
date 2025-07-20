import { test, expect } from '@playwright/test';

test.describe('NEAR RPC Client Browser Tests', () => {
  test('should load the test page successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle('NEAR RPC Client Browser Test');
    await expect(page.locator('h1')).toContainText(
      'NEAR RPC Client Browser Test'
    );

    // Check that all test buttons are present
    await expect(page.locator('#testLatestBlock')).toBeVisible();
    await expect(page.locator('#testAccountView')).toBeVisible();
    await expect(page.locator('#testSpecificBlock')).toBeVisible();
    await expect(page.locator('#testNetworkStatus')).toBeVisible();
    await expect(page.locator('#testGasPrice')).toBeVisible();
    await expect(page.locator('#runAllTests')).toBeVisible();
  });

  test('should successfully get latest block', async ({ page }) => {
    await page.goto('/');

    // Click the latest block test button
    await page.click('#testLatestBlock');

    // Wait for the result to appear and check it's successful
    await expect(page.locator('#latestBlockResult')).toHaveClass(/success/, {
      timeout: 10000,
    });

    // Check that the result contains expected fields
    const resultText = await page.locator('#latestBlockResult').textContent();
    const result = JSON.parse(resultText || '{}');

    expect(result).toHaveProperty('height');
    expect(result).toHaveProperty('hash');
    expect(result).toHaveProperty('timestamp');
    expect(typeof result.height).toBe('number');
    expect(typeof result.hash).toBe('string');
    expect(result.hash).toHaveLength(44); // NEAR block hashes are 44 characters
  });

  test('should successfully view account', async ({ page }) => {
    await page.goto('/');

    // Click the account view test button
    await page.click('#testAccountView');

    // Wait for the result to appear and check it's successful
    await expect(page.locator('#accountViewResult')).toHaveClass(/success/, {
      timeout: 10000,
    });

    // Check that the result contains expected fields
    const resultText = await page.locator('#accountViewResult').textContent();
    const result = JSON.parse(resultText || '{}');

    expect(result).toHaveProperty('accountId', 'example.testnet');
    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('storageUsage');
    expect(result).toHaveProperty('blockHeight');
    expect(typeof result.amount).toBe('string');
    expect(typeof result.storageUsage).toBe('number');
    expect(typeof result.blockHeight).toBe('number');
  });

  test('should successfully get network status', async ({ page }) => {
    await page.goto('/');

    // Click the network status test button
    await page.click('#testNetworkStatus');

    // Wait for the result to appear and check it's successful
    await expect(page.locator('#networkStatusResult')).toHaveClass(/success/, {
      timeout: 10000,
    });

    // Check that the result contains expected fields
    const resultText = await page.locator('#networkStatusResult').textContent();
    const result = JSON.parse(resultText || '{}');

    expect(result).toHaveProperty('chainId');
    expect(result).toHaveProperty('latestBlockHeight');
    expect(result).toHaveProperty('latestBlockHash');
    expect(result).toHaveProperty('syncing');
    expect(result.chainId).toBe('testnet');
    expect(typeof result.latestBlockHeight).toBe('number');
    expect(typeof result.syncing).toBe('boolean');
  });

  test('should successfully get gas price', async ({ page }) => {
    await page.goto('/');

    // Click the gas price test button
    await page.click('#testGasPrice');

    // Wait for the result to appear and check it's successful
    await expect(page.locator('#gasPriceResult')).toHaveClass(/success/, {
      timeout: 10000,
    });

    // Check that the result contains expected fields
    const resultText = await page.locator('#gasPriceResult').textContent();
    const result = JSON.parse(resultText || '{}');

    expect(result).toHaveProperty('gasPrice');
    expect(typeof result.gasPrice).toBe('string');
  });

  test('should successfully get specific block', async ({ page }) => {
    await page.goto('/');

    // First get latest block to establish a baseline
    await page.click('#testLatestBlock');
    await expect(page.locator('#latestBlockResult')).toHaveClass(/success/, {
      timeout: 10000,
    });

    // Then test specific block
    await page.click('#testSpecificBlock');

    // Wait for the result to appear and check it's successful
    await expect(page.locator('#specificBlockResult')).toHaveClass(/success/, {
      timeout: 10000,
    });

    // Check that the result contains expected fields
    const resultText = await page.locator('#specificBlockResult').textContent();
    const result = JSON.parse(resultText || '{}');

    expect(result).toHaveProperty('requestedHeight');
    expect(result).toHaveProperty('actualHeight');
    expect(result).toHaveProperty('hash');
    expect(result).toHaveProperty('prevHash');
    expect(result).toHaveProperty('chunksCount');
    expect(typeof result.actualHeight).toBe('number');
    expect(typeof result.hash).toBe('string');
    expect(typeof result.chunksCount).toBe('number');
  });

  test('should run all tests successfully', async ({ page }) => {
    await page.goto('/');

    // Click run all tests button
    await page.click('#runAllTests');

    // Wait for all tests to complete (increased timeout for multiple API calls)
    await expect(page.locator('#runAllTests')).toContainText('passed', {
      timeout: 30000,
    });

    // Check that the button shows success
    const buttonText = await page.locator('#runAllTests').textContent();
    expect(buttonText).toMatch(/\d+\/\d+ passed/);

    // Verify test results are available in window object
    const testResults = await page.evaluate(() => (window as any).testResults);
    expect(testResults).toBeDefined();
    expect(testResults.total).toBeGreaterThan(0);
    expect(testResults.passed).toBeGreaterThan(0);
    expect(testResults.success).toBe(true);

    // Check that all result divs have success class
    const resultDivs = await page.locator('.result').all();
    for (const div of resultDivs) {
      const className = await div.getAttribute('class');
      if (className && className.includes('success')) {
        // This div has results and they are successful
        const text = await div.textContent();
        expect(text).toBeTruthy();
        expect(text).not.toContain('Error:');
      }
    }
  });

  test('should handle errors gracefully', async ({ page }) => {
    await page.goto('/');

    // Test error handling by mocking network failure
    await page.route('https://rpc.testnet.fastnear.com', route => {
      route.abort('failed');
    });

    // Try to run a test that should fail
    await page.click('#testLatestBlock');

    // Wait for error result
    await expect(page.locator('#latestBlockResult')).toHaveClass(/error/, {
      timeout: 10000,
    });

    // Check that error message is displayed
    const resultText = await page.locator('#latestBlockResult').textContent();
    expect(resultText).toContain('Error:');
  });

  test('should clear results when clear button is clicked', async ({
    page,
  }) => {
    await page.goto('/');

    // Run a test to generate some results
    await page.click('#testLatestBlock');
    await expect(page.locator('#latestBlockResult')).toHaveClass(/success/, {
      timeout: 10000,
    });

    // Clear results
    await page.click('#clearResults');

    // Check that results are cleared
    const resultText = await page.locator('#latestBlockResult').textContent();
    expect(resultText).toBe('');

    // Check that result div no longer has success/error class
    const className = await page
      .locator('#latestBlockResult')
      .getAttribute('class');
    expect(className).toBe('result');
  });
});

/**
 * This example demonstrates how to call a smart contract method on the NEAR mainnet using the viewFunction helper.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/call-contract-method-view-function.ts` from the root of the repository.
 */

import { NearRpcClient, viewFunction, query, enableValidation } from '@near-js/jsonrpc-client';

const provider = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.fastnear.com',
  validation: enableValidation(),
});

try {
  const result = await viewFunction(provider, {
    accountId: 'intents.near',
    methodName: 'mt_tokens_for_owner',
    argsBase64: Buffer.from(
      JSON.stringify({ account_id: 'webassemblymusic-treasury.sputnik-dao.near' })
    ).toString('base64'),
    finality: 'final',
  });

  const parsedResult = JSON.parse(Buffer.from(result.result).toString());

  console.log('result', parsedResult);
} catch (error: any) {
  console.error('Validation error occurred');
  console.error('Error message:', error.message);
  
  // Debug the actual validation issue
  console.error('\nDEBUG: Let\'s check what the validation is receiving');
  
  // Try to extract more details from the error
  if (error.originalError) {
    console.error('Original validation error:', error.originalError);
  }
  
  // The viewFunction helper should be sending these parameters
  const expectedParams = {
    requestType: 'call_function',
    accountId: 'intents.near',
    methodName: 'mt_tokens_for_owner',
    argsBase64: Buffer.from(
      JSON.stringify({ account_id: 'webassemblymusic-treasury.sputnik-dao.near' })
    ).toString('base64'),
    finality: 'final'
  };
  
  console.error('\nExpected params structure:');
  console.error(JSON.stringify(expectedParams, null, 2));
  
  // Try calling query directly with the same params to see if it works
  console.error('\nTrying direct query call...');
  try {
    const directResult = await query(provider, expectedParams);
    console.error('Direct query call succeeded!');
    const parsedResult = JSON.parse(Buffer.from(directResult.result).toString());
    console.log('result', parsedResult);
  } catch (directError: any) {
    console.error('Direct query also failed:', directError.message);
  }
}

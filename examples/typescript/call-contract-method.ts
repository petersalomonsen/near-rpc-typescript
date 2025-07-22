/**
 * This example demonstrates two approaches for calling smart contract methods on NEAR.
 *
 * It shows both the convenience method and the generic query method with type guards,
 * highlighting the improved developer experience of the dynamic client implementation.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/call-contract-method.ts` from the root of the repository.
 */

import { NearRpcClient } from '@near-js/jsonrpc-client';
import { CallResult } from '@near-js/jsonrpc-types';

const provider = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.fastnear.com',
});

const contractId = 'intents.near';
const methodName = 'mt_tokens_for_owner';
const args = { account_id: 'webassemblymusic-treasury.sputnik-dao.near' };
const argsBase64 = Buffer.from(JSON.stringify(args)).toString('base64');

console.log(
  '🔧 Calling smart contract method using two different approaches...\n'
);

// ===== APPROACH 1: Convenience Method (Recommended) =====
console.log('📦 Approach 1: Using convenience method viewFunction()');
console.log('✅ Pros: Clean, type-safe, no union types to handle\n');

const result1 = await provider.viewFunction({
  accountId: contractId,
  methodName: methodName,
  argsBase64: argsBase64,
  finality: 'final',
});

// The convenience method returns CallResult directly - full type safety!
const parsedResult1 = JSON.parse(Buffer.from(result1.result).toString());
console.log('Result from convenience method:', parsedResult1);
console.log('Logs:', result1.logs);
console.log();

// ===== APPROACH 2: Generic Query Method with Type Guard =====
console.log('🔍 Approach 2: Using generic query() method with type guard');
console.log('✅ Pros: Maximum flexibility, works for any query type');
console.log('⚠️  Cons: Requires type guard to handle union types safely\n');

const result2 = await provider.query({
  requestType: 'call_function',
  finality: 'final',
  accountId: contractId,
  methodName: methodName,
  argsBase64: argsBase64,
});

// After runtime validation, we can safely cast to CallResult
// TypeScript's type narrowing with complex unions requires explicit casting
const callResult = result2 as CallResult;
const parsedResult2 = JSON.parse(Buffer.from(callResult.result).toString());
console.log('Result from generic query:', parsedResult2);
console.log('Logs:', callResult.logs);
console.log();

console.log('🎉 Both approaches return the same data!');
console.log(
  '💡 The convenience method provides better developer experience with automatic type safety.'
);

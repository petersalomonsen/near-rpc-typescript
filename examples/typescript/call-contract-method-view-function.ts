/**
 * This example demonstrates how to call a smart contract method on the NEAR mainnet using the viewFunction helper.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/typescript/call-contract-method-view-function.ts` from the root of the repository.
 */

import { NearRpcClient, viewFunction } from '@near-js/jsonrpc-client';

const provider = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.fastnear.com',
});

const result = await viewFunction(provider, {
  accountId: 'intents.near',
  methodName: 'mt_tokens_for_owner',
  argsBase64: Buffer.from(
    JSON.stringify({
      account_id: 'webassemblymusic-treasury.sputnik-dao.near',
    })
  ).toString('base64'),
  finality: 'final',
});

const parsedResult = JSON.parse(Buffer.from(result.result).toString());

console.log('result', parsedResult);

/**
 * This example demonstrates how to call a smart contract method on the NEAR mainnet.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/call-contract-method.ts` from the root of the repository.
 */

import { NearRpcClient } from '@near-js/jsonrpc-client';

const provider = new NearRpcClient({
    endpoint: 'https://rpc.mainnet.fastnear.com',
});

const result = await provider.query({
    request_type: 'call_function',
    finality: 'final',
    account_id: 'intents.near',
    method_name: 'mt_tokens_for_owner',
    args_base64: Buffer.from(JSON.stringify({ account_id: 'webassemblymusic-treasury.sputnik-dao.near' })).toString('base64'),
});

const parsedResult = JSON.parse(Buffer.from(result.result).toString());

console.log('result', parsedResult);

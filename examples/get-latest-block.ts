/**
 * This example demonstrates how to get the latest block from the NEAR mainnet.
 *
 * To run this example:
 * 1. Make sure you have pnpm installed (https://pnpm.io/installation).
 * 2. Run `pnpm install` from the root of the repository.
 * 3. Run `pnpm tsx examples/get-latest-block.ts` from the root of the repository.
 */

import { NearRpcClient } from '@near-js/jsonrpc-client';

const provider = new NearRpcClient({
    endpoint: 'https://rpc.mainnet.fastnear.com',
});

const block = await provider.block({
    finality: 'final',
});

console.log('block', block);

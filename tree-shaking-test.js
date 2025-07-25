// Test tree-shaking effectiveness
import { AccessKeySchema } from './packages/jsonrpc-types/dist/index.mini.mjs';

// Only use one schema to test tree-shaking
const schema = AccessKeySchema();
console.log('Schema created:', schema);

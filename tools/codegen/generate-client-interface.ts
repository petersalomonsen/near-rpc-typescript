// Generate TypeScript interface for NEAR RPC client with proper types
// Part of the codegen toolchain

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Types for the generation process
interface MethodMapping {
  rpcMethod: string;
  clientMethodName: string;
  requestType: string;
  responseType: string;
}

interface GeneratedInterface {
  content: string;
  methodCount: number;
  timestamp: string;
}

// Convert RPC method name to camelCase TypeScript method name
function rpcMethodToCamelCase(method: string): string {
  if (method.startsWith('EXPERIMENTAL_')) {
    const suffix = method.substring(13); // Remove 'EXPERIMENTAL_'
    return 'experimental' + suffix
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  } else {
    return method
      .split('_')
      .map((word, index) => 
        index === 0 
          ? word.toLowerCase() 
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }
}

// Extract parameter types by parsing schema definitions directly
function extractParameterTypesFromSchemas(
  pathToMethodMap: Record<string, string>,
  openApiSpec?: any
): Record<string, string> {
  const methodToParamType: Record<string, string> = {};
  
  if (openApiSpec) {
    console.log('🔍 Analyzing OpenAPI schema to extract parameter types...');
    
    // Parse each method's schema to find the actual params type
    for (const [path, method] of Object.entries(pathToMethodMap)) {
      const paramType = extractParamsTypeFromSchema(path, method, openApiSpec);
      if (paramType) {
        methodToParamType[method] = paramType;
        console.log(`  ${method} -> ${paramType} (from schema)`);
      } else {
        console.warn(`  ⚠️  Could not extract parameter type for ${method} from schema`);
      }
    }
  } else {
    console.warn('⚠️  No OpenAPI spec provided - cannot extract parameter types');
  }
  
  return methodToParamType;
}

// Extract the actual params type from OpenAPI schema
function extractParamsTypeFromSchema(path: string, method: string, openApiSpec: any): string | null {
  try {
    const pathSpec = openApiSpec.paths[path];
    const postSpec = pathSpec?.post;
    
    if (!postSpec) return null;
    
    // Look for the params schema in the request body
    const requestBodySchema = postSpec.requestBody?.content?.['application/json']?.schema;
    if (!requestBodySchema) return null;
    
    // If it's a reference, extract the schema name
    if (requestBodySchema.$ref) {
      const refPath = requestBodySchema.$ref; // e.g., "#/components/schemas/JsonRpcRequestForBlock"
      const schemaName = refPath.split('/').pop();
      
      // Get the actual schema definition
      const actualSchema = openApiSpec.components?.schemas?.[schemaName];
      if (actualSchema?.properties?.params) {
        const paramsSchema = actualSchema.properties.params;
        
        // Extract the params type from the schema reference
        if (paramsSchema.$ref) {
          const paramsRefPath = paramsSchema.$ref;
          const paramsSchemaName = paramsRefPath.split('/').pop();
          
          // Convert schema name to TypeScript type name
          const paramTypeName = schemaNameToTypeName(paramsSchemaName);
          return paramTypeName;
        }
        
        // Handle lazy references
        if (paramsSchema.properties?.lazy?.anyOf) {
          for (const option of paramsSchema.properties.lazy.anyOf) {
            if (option.$ref) {
              const paramsRefPath = option.$ref;
              const paramsSchemaName = paramsRefPath.split('/').pop();
              const paramTypeName = schemaNameToTypeName(paramsSchemaName);
              return paramTypeName;
            }
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn(`  ⚠️  Could not extract params type for ${method}:`, error);
    return null;
  }
}

// Convert schema name to TypeScript type name
function schemaNameToTypeName(schemaName: string): string {
  // Handle different schema naming patterns
  if (schemaName.startsWith('Rpc') && schemaName.endsWith('Schema')) {
    // RpcBlockRequestSchema -> RpcBlockRequest
    return schemaName.replace(/Schema$/, '');
  }
  
  // Special cases that should NOT get Rpc prefix
  const noPrefixTypes = ['GenesisConfigRequest'];
  if (noPrefixTypes.includes(schemaName)) {
    return schemaName;
  }
  
  // Add Rpc prefix if not present and convert to request type
  if (!schemaName.startsWith('Rpc') && !schemaName.startsWith('EXPERIMENTAL')) {
    return `Rpc${schemaName}`;
  }
  
  return schemaName;
}

// Note: Inference logic removed - now relies entirely on schema extraction


// Convert snake_case to PascalCase
function pascalCase(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Generate fallback request type name (the old approach)
function generateFallbackRequestType(method: string): string {
  if (method.startsWith('EXPERIMENTAL_')) {
    const baseName = method.substring(13);
    return `EXPERIMENTAL${pascalCase(baseName)}Request`;
  } else {
    return `${pascalCase(method)}Request`;
  }
}

// Note: Basic mapping removed - generator now requires OpenAPI spec for proper type extraction

// Convert RPC method name to TypeScript type name using dynamic mapping
function createTypeNameResolver(methodToParamType: Record<string, string>) {
  return function(method: string, suffix: 'Request' | 'Response'): string {
    if (suffix === 'Request') {
      // Use the dynamically discovered parameter type
      return methodToParamType[method] || generateFallbackRequestType(method);
    } else {
      // For response types, use the standard naming convention
      if (method.startsWith('EXPERIMENTAL_')) {
        const baseName = method.substring(13);
        return `EXPERIMENTAL${pascalCase(baseName)}${suffix}`;
      } else {
        return `${pascalCase(method)}${suffix}`;
      }
    }
  };
}

// Generate method mappings from RPC_METHODS array
function generateMethodMappings(
  rpcMethods: readonly string[], 
  pathToMethodMap?: Record<string, string>,
  openApiSpec?: any
): MethodMapping[] {
  // Get parameter type mappings from OpenAPI schema
  if (!pathToMethodMap || !openApiSpec) {
    throw new Error('OpenAPI spec and path mappings are required for type generation');
  }
  const methodToParamType = extractParameterTypesFromSchemas(pathToMethodMap, openApiSpec);
  
  // Create type name resolver with discovered mappings
  const rpcMethodToTypeName = createTypeNameResolver(methodToParamType);
  
  return rpcMethods.map(rpcMethod => ({
    rpcMethod,
    clientMethodName: rpcMethodToCamelCase(rpcMethod),
    requestType: rpcMethodToTypeName(rpcMethod, 'Request'),
    responseType: rpcMethodToTypeName(rpcMethod, 'Response'),
  }));
}

// Generate the TypeScript interface with proper types
function generateInterfaceContent(mappings: MethodMapping[]): GeneratedInterface {
  const timestamp = new Date().toISOString();
  
  // Generate method signatures with proper types
  const methodSignatures = mappings.map(mapping => {
    return `  ${mapping.clientMethodName}(params?: ${mapping.requestType}): Promise<${mapping.responseType}>;`;
  });

  // Generate type imports
  const requestTypes = [...new Set(mappings.map(m => m.requestType))].sort();
  const responseTypes = [...new Set(mappings.map(m => m.responseType))].sort();
  // Add QueryResponse for convenience methods (use Set to avoid duplicates)
  const allTypes = [...new Set([...requestTypes, ...responseTypes, 'QueryResponse'])].sort();
  
  const importStatement = `import type {\n  ${allTypes.join(',\n  ')}\n} from '@near-js/jsonrpc-types';`;

  const content = `// Auto-generated TypeScript interface for NEAR RPC client
// Generated at: ${timestamp}
// Total methods: ${mappings.length}
// 
// This file is automatically generated by tools/codegen/generate-client-interface.ts
// Do not edit manually - changes will be overwritten

${importStatement}

// Dynamic RPC methods interface with proper typing
export interface DynamicRpcMethods {
${methodSignatures.join('\n')}
}

// Convenience methods interface
export interface ConvenienceMethods {
  viewAccount(params: {
    accountId: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }): Promise<QueryResponse>;
  
  viewFunction(params: {
    accountId: string;
    methodName: string;
    argsBase64?: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }): Promise<QueryResponse>;
  
  viewAccessKey(params: {
    accountId: string;
    publicKey: string;
    finality?: 'final' | 'near-final' | 'optimistic';
    blockId?: string | number;
  }): Promise<QueryResponse>;
}

// Combined interface for the complete client
export interface CompleteClientInterface extends DynamicRpcMethods, ConvenienceMethods {
  // Generic call method for ultimate flexibility
  call<TParams = unknown, TResult = unknown>(
    method: string, 
    params?: TParams
  ): Promise<TResult>;
}
`;

  return {
    content,
    methodCount: mappings.length,
    timestamp,
  };
}

// Main generator function
export async function generateClientInterface(
  rpcMethods: readonly string[],
  outputPath: string,
  pathToMethodMap?: Record<string, string>,
  openApiSpec?: any
): Promise<GeneratedInterface> {
  console.log('🔧 Generating TypeScript client interface...');
  
  // Generate method mappings
  const mappings = generateMethodMappings(rpcMethods, pathToMethodMap, openApiSpec);
  console.log(`   Found ${mappings.length} RPC methods to generate`);
  
  // Generate the interface
  const generated = generateInterfaceContent(mappings);
  
  // Ensure output directory exists
  await fs.mkdir(dirname(outputPath), { recursive: true });
  
  // Write the generated interface
  await fs.writeFile(outputPath, generated.content, 'utf8');
  
  console.log(`✅ Generated client interface at ${outputPath}`);
  console.log(`   Methods: ${generated.methodCount}`);
  console.log(`   Timestamp: ${generated.timestamp}`);
  
  return generated;
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  async function main() {
    try {
      // Import RPC_METHODS from the types package
      const { RPC_METHODS } = await import('../../packages/jsonrpc-types/dist/index.mjs');
      
      // Output path - resolve relative to the project root, not codegen directory
      const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
      const outputPath = join(projectRoot, 'packages/jsonrpc-client/src/generated-types.ts');
      
      await generateClientInterface(RPC_METHODS, outputPath);
      
      console.log('🎉 Client interface generation complete!');
    } catch (error) {
      console.error('❌ Failed to generate client interface:', error);
      process.exit(1);
    }
  }
  
  main();
}
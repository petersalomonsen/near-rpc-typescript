// Main code generation script
// This will fetch the NEAR OpenAPI spec and generate TypeScript types and Zod schemas

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateClientInterface } from './generate-client-interface.js';

// OpenAPI spec types
interface OpenAPISpec {
  openapi: string;
  info: any;
  servers: any[];
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

interface Schema {
  type?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  $ref?: string;
  description?: string;
  enum?: string[];
  required?: string[];
  additionalProperties?: boolean | Schema;
  format?: string;
}

// Extract path to method mapping dynamically from OpenAPI spec
function extractPathToMethodMap(spec: OpenAPISpec): Record<string, string> {
  const map: Record<string, string> = {};

  Object.entries(spec.paths).forEach(([path, pathSpec]) => {
    // The operationId is the JSON-RPC method name
    const operationId = pathSpec.post?.operationId;
    if (operationId) {
      map[path] = operationId;
    } else {
      console.warn(`⚠️  Path ${path} has no operationId, skipping...`);
    }
  });

  return map;
}

// Case conversion utilities
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function pascalCase(str: string): string {
  const camel = snakeToCamel(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// Fetch OpenAPI spec
async function fetchOpenAPISpec(): Promise<OpenAPISpec> {
  const response = await fetch(
    'https://raw.githubusercontent.com/near/nearcore/master/chain/jsonrpc/openapi/openapi.json'
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${response.status}`);
  }
  return response.json();
}

// Type generation utilities
function resolveSchemaRef(
  ref: string,
  schemas: Record<string, Schema>
): Schema {
  const refName = ref.replace('#/components/schemas/', '');
  return schemas[refName] || { type: 'unknown' };
}

function generateTypeScriptType(
  schema: Schema,
  schemas: Record<string, Schema>,
  depth = 0
): string {
  if (depth > 10) return 'unknown'; // Prevent infinite recursion

  if (schema.$ref) {
    const refName = schema.$ref.replace('#/components/schemas/', '');
    return pascalCase(refName);
  }

  if (schema.oneOf) {
    return schema.oneOf
      .map(s => generateTypeScriptType(s, schemas, depth + 1))
      .join(' | ');
  }

  if (schema.anyOf) {
    return schema.anyOf
      .map(s => generateTypeScriptType(s, schemas, depth + 1))
      .join(' | ');
  }

  if (schema.allOf) {
    return schema.allOf
      .map(s => generateTypeScriptType(s, schemas, depth + 1))
      .join(' & ');
  }

  if (schema.enum) {
    return schema.enum.map(val => `"${val}"`).join(' | ');
  }

  switch (schema.type) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      const itemType = schema.items
        ? generateTypeScriptType(schema.items, schemas, depth + 1)
        : 'unknown';
      return `${itemType}[]`;
    case 'object':
      if (!schema.properties) {
        if (schema.additionalProperties === true) {
          return 'Record<string, unknown>';
        } else if (
          schema.additionalProperties &&
          typeof schema.additionalProperties === 'object'
        ) {
          const valueType = generateTypeScriptType(
            schema.additionalProperties,
            schemas,
            depth + 1
          );
          return `Record<string, ${valueType}>`;
        }
        return 'Record<string, unknown>';
      }

      const properties = Object.entries(schema.properties).map(
        ([key, prop]) => {
          const isOptional = !schema.required?.includes(key);
          const camelKey = snakeToCamel(key);
          const type = generateTypeScriptType(prop, schemas, depth + 1);
          return `  ${camelKey}${isOptional ? '?' : ''}: ${type};`;
        }
      );

      return `{\n${properties.join('\n')}\n}`;
    default:
      return 'unknown';
  }
}

function isComplexType(schema: Schema): boolean {
  return !!(
    schema.oneOf ||
    schema.anyOf ||
    schema.allOf ||
    (schema.type === 'object' && schema.properties)
  );
}

function formatComment(description: string): string {
  if (!description) return '';

  // Clean up the description
  const cleanDescription = description
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanDescription.length <= 80) {
    return `/** ${cleanDescription} */\n`;
  }

  // Multi-line comment
  const words = cleanDescription.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).length <= 75) {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return `/**\n${lines.map(line => ` * ${line}`).join('\n')}\n */\n`;
}

function generateZodSchema(
  schema: Schema,
  schemas: Record<string, Schema>,
  depth = 0,
  useMini = false
): string {
  if (depth > 10) return 'z.unknown()'; // Prevent infinite recursion

  if (schema.$ref) {
    const refName = schema.$ref.replace('#/components/schemas/', '');
    return `z.lazy(() => ${pascalCase(refName)}Schema)`;
  }

  if (schema.oneOf) {
    const options = schema.oneOf.map(s =>
      generateZodSchema(s, schemas, depth + 1, useMini)
    );
    if (options.length === 1) {
      return options[0];
    }
    return `z.union([${options.join(', ')}])`;
  }

  if (schema.anyOf) {
    const options = schema.anyOf.map(s =>
      generateZodSchema(s, schemas, depth + 1, useMini)
    );
    if (options.length === 1) {
      return options[0];
    }
    return `z.union([${options.join(', ')}])`;
  }

  if (schema.allOf) {
    const allSchemas = schema.allOf.map(s =>
      generateZodSchema(s, schemas, depth + 1, useMini)
    );
    if (allSchemas.length === 1) {
      return allSchemas[0];
    }
    return `z.intersection(${allSchemas.join(', ')})`;
  }

  if (schema.enum) {
    return `z.enum([${schema.enum.map(val => `"${val}"`).join(', ')}])`;
  }

  switch (schema.type) {
    case 'string':
      return 'z.string()';
    case 'number':
    case 'integer':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'array':
      const itemSchema = schema.items
        ? generateZodSchema(schema.items, schemas, depth + 1, useMini)
        : 'z.unknown()';
      return `z.array(${itemSchema})`;
    case 'object':
      if (!schema.properties) {
        if (schema.additionalProperties === true) {
          return 'z.record(z.string(), z.unknown())';
        } else if (
          schema.additionalProperties &&
          typeof schema.additionalProperties === 'object'
        ) {
          const valueSchema = generateZodSchema(
            schema.additionalProperties,
            schemas,
            depth + 1,
            useMini
          );
          return `z.record(z.string(), ${valueSchema})`;
        }
        return 'z.record(z.string(), z.unknown())';
      }

      const properties = Object.entries(schema.properties).map(
        ([key, prop]) => {
          const isOptional = !schema.required?.includes(key);
          const camelKey = snakeToCamel(key);
          const zodSchema = generateZodSchema(
            prop,
            schemas,
            depth + 1,
            useMini
          );
          if (useMini && isOptional) {
            return `  ${camelKey}: z.optional(${zodSchema})`;
          }
          return `  ${camelKey}: ${zodSchema}${isOptional && !useMini ? '.optional()' : ''}`;
        }
      );

      return `z.object({\n${properties.join(',\n')}\n})`;
    default:
      return 'z.unknown()';
  }
}

// Add explicit types for problematic schemas
function getSchemaExplicitType(
  schemaName: string,
  useMini = false
): string | null {
  const circularSchemas = [
    'Action',
    'DelegateAction',
    'NonDelegateAction',
    'SignedDelegateAction',
  ];
  if (circularSchemas.includes(schemaName)) {
    // zod/mini doesn't export ZodType, so we use a different approach
    return useMini ? ': any' : ': z.ZodType<any>';
  }
  return null;
}
export async function generateTypes() {
  console.log('🔄 Starting OpenAPI spec analysis and type generation...');

  try {
    // Fetch the OpenAPI spec
    console.log('📥 Fetching NEAR OpenAPI specification...');
    const spec = await fetchOpenAPISpec();
    console.log(
      `✅ Fetched spec with ${Object.keys(spec.paths).length} endpoints and ${Object.keys(spec.components.schemas).length} schemas`
    );

    const outputDir = join(process.cwd(), '../../packages/jsonrpc-types/src');
    const { schemas } = spec.components;

    // Extract path to method mapping from the OpenAPI spec
    const PATH_TO_METHOD_MAP = extractPathToMethodMap(spec);
    console.log(
      `📋 Extracted ${Object.keys(PATH_TO_METHOD_MAP).length} method mappings from OpenAPI spec`
    );

    // Generate TypeScript types using z.infer
    console.log('🔧 Generating TypeScript types using z.infer...');
    const typeExports: string[] = [];
    const typeDefinitions: string[] = [];

    // Generate types for each schema using z.infer
    Object.entries(schemas).forEach(([schemaName, schema]) => {
      const typeName = pascalCase(schemaName);
      const schemaTypeName = `${typeName}Schema`;

      // Add description as JSDoc if available
      const description = formatComment(schema.description || '');

      // Generate z.infer type
      typeDefinitions.push(
        `${description}export type ${typeName} = z.infer<typeof schemas.${schemaTypeName}>;`
      );

      typeExports.push(typeName);
    });

    // Generate method parameter and response types using z.infer
    const methodTypes: string[] = [];
    Object.entries(spec.paths).forEach(([path, pathSpec]) => {
      const methodName = PATH_TO_METHOD_MAP[path];
      if (!methodName) return;

      const post = pathSpec.post;
      if (!post) return;

      const methodNamePascal = pascalCase(methodName);

      // Generate request type using z.infer
      if (post.requestBody?.content?.['application/json']?.schema) {
        methodTypes.push(
          `export type ${methodNamePascal}Request = z.infer<typeof schemas.${methodNamePascal}RequestSchema>;`
        );
      }

      // Generate response type using z.infer
      if (post.responses?.['200']?.content?.['application/json']?.schema) {
        methodTypes.push(
          `export type ${methodNamePascal}Response = z.infer<typeof schemas.${methodNamePascal}ResponseSchema>;`
        );
      }
    });

    const typesContent = `// Auto-generated TypeScript types from NEAR OpenAPI spec using z.infer
// Generated on: ${new Date().toISOString()}
// Do not edit manually - run 'pnpm generate' to regenerate

import { z } from 'zod/v4';
import * as schemas from './schemas';

${typeDefinitions.join('\n\n')}

// Method-specific types
${methodTypes.join('\n\n')}

// Re-exports for convenience
export * from './schemas';
`;

    // Create mini types content
    const miniTypesContent = `// Auto-generated TypeScript types from NEAR OpenAPI spec using z.infer (zod/mini version)
// Generated on: ${new Date().toISOString()}
// Do not edit manually - run 'pnpm generate' to regenerate

import { z } from 'zod/mini';
import * as schemas from './schemas.mini';

${typeDefinitions.join('\n\n')}

// Method-specific types
${methodTypes.join('\n\n')}

// Re-exports for convenience
export * from './schemas.mini';
`;

    // Generate Zod schemas (both regular and mini versions)
    console.log('🔧 Generating Zod schemas...');
    const schemaExports: string[] = [];
    const schemaDefinitions: string[] = [];
    const miniSchemaDefinitions: string[] = [];

    Object.entries(schemas).forEach(([schemaName, schema]) => {
      const schemaTypeName = `${pascalCase(schemaName)}Schema`;
      const zodSchema = generateZodSchema(schema, schemas, 0, false);
      const zodMiniSchema = generateZodSchema(schema, schemas, 0, true);

      // Add description as comment if available
      const description = schema.description
        ? formatComment(schema.description)
            .replace(/\/\*\*/g, '//')
            .replace(/\*\//g, '')
            .replace(/\* /g, '// ')
        : '';

      // Handle circular references with explicit types
      const explicitType = getSchemaExplicitType(schemaName, false);
      const explicitTypeMini = getSchemaExplicitType(schemaName, true);
      const typeAnnotation = explicitType || '';
      const typeAnnotationMini = explicitTypeMini || '';

      schemaDefinitions.push(
        `${description}export const ${schemaTypeName}${typeAnnotation} = ${zodSchema};`
      );
      miniSchemaDefinitions.push(
        `${description}export const ${schemaTypeName}${typeAnnotationMini} = ${zodMiniSchema};`
      );
      schemaExports.push(schemaTypeName);
    });

    // Generate method schemas
    const methodSchemas: string[] = [];
    const miniMethodSchemas: string[] = [];
    Object.entries(spec.paths).forEach(([path, pathSpec]) => {
      const methodName = PATH_TO_METHOD_MAP[path];
      if (!methodName) return;

      const post = pathSpec.post;
      if (!post) return;

      const methodNamePascal = pascalCase(methodName);

      // Generate request schema
      if (post.requestBody?.content?.['application/json']?.schema) {
        const requestSchema =
          post.requestBody.content['application/json'].schema;
        const zodSchema = generateZodSchema(requestSchema, schemas, 0, false);
        const zodMiniSchema = generateZodSchema(
          requestSchema,
          schemas,
          0,
          true
        );
        methodSchemas.push(
          `export const ${methodNamePascal}RequestSchema = ${zodSchema};`
        );
        miniMethodSchemas.push(
          `export const ${methodNamePascal}RequestSchema = ${zodMiniSchema};`
        );
      }

      // Generate response schema
      if (post.responses?.['200']?.content?.['application/json']?.schema) {
        const responseSchema =
          post.responses['200'].content['application/json'].schema;
        const zodSchema = generateZodSchema(responseSchema, schemas, 0, false);
        const zodMiniSchema = generateZodSchema(
          responseSchema,
          schemas,
          0,
          true
        );
        methodSchemas.push(
          `export const ${methodNamePascal}ResponseSchema = ${zodSchema};`
        );
        miniMethodSchemas.push(
          `export const ${methodNamePascal}ResponseSchema = ${zodMiniSchema};`
        );
      }
    });

    const schemasContent = `// Auto-generated Zod schemas from NEAR OpenAPI spec
// Generated on: ${new Date().toISOString()}
// Do not edit manually - run 'pnpm generate' to regenerate

import { z } from 'zod/v4';

${schemaDefinitions.join('\n\n')}

// Method-specific schemas
${methodSchemas.join('\n\n')}

// Utility schemas
export const JsonRpcRequestSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.string(),
  method: z.string(),
  params: z.optional(z.unknown()),
});

export const JsonRpcErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.optional(z.unknown()),
});

export const JsonRpcResponseSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.string(),
  result: z.optional(z.unknown()),
  error: z.optional(JsonRpcErrorSchema),
});
`;

    // Generate method mapping
    const methodMappingContent = `// Auto-generated method mapping from NEAR OpenAPI spec
// Generated on: ${new Date().toISOString()}
// Do not edit manually - run 'pnpm generate' to regenerate

// Maps OpenAPI paths to actual JSON-RPC method names
export const PATH_TO_METHOD_MAP = ${JSON.stringify(PATH_TO_METHOD_MAP, null, 2)};

// Reverse mapping for convenience
export const METHOD_TO_PATH_MAP: Record<string, string> = {};
Object.entries(PATH_TO_METHOD_MAP).forEach(([path, method]) => {
  METHOD_TO_PATH_MAP[method] = path;
});

// Available RPC methods
export const RPC_METHODS = Object.values(PATH_TO_METHOD_MAP);
export type RpcMethod = typeof RPC_METHODS[number];
`;

    // Write all generated files
    // Create mini schemas content
    const miniSchemasContent = `// Auto-generated Zod schemas from NEAR OpenAPI spec (zod/mini version)
// Generated on: ${new Date().toISOString()}
// Do not edit manually - run 'pnpm generate' to regenerate

import { z } from 'zod/mini';

${miniSchemaDefinitions.join('\n\n')}

// Method-specific schemas
${miniMethodSchemas.join('\n\n')}

// Utility schemas
export const JsonRpcRequestSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.string(),
  method: z.string(),
  params: z.optional(z.unknown()),
});

export const JsonRpcErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.optional(z.unknown()),
});

export const JsonRpcResponseSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.string(),
  result: z.optional(z.unknown()),
  error: z.optional(JsonRpcErrorSchema),
});
`;

    await fs.writeFile(join(outputDir, 'types.ts'), typesContent);
    await fs.writeFile(join(outputDir, 'types.mini.ts'), miniTypesContent);
    await fs.writeFile(join(outputDir, 'schemas.ts'), schemasContent);
    await fs.writeFile(join(outputDir, 'schemas.mini.ts'), miniSchemasContent);
    await fs.writeFile(join(outputDir, 'methods.ts'), methodMappingContent);

    console.log('✅ Type generation complete!');
    console.log('📁 Generated files:');
    console.log(
      `  - packages/jsonrpc-types/src/types.ts (${typeExports.length} types)`
    );
    console.log(
      `  - packages/jsonrpc-types/src/schemas.ts (${schemaExports.length} schemas)`
    );
    console.log(
      `  - packages/jsonrpc-types/src/schemas.mini.ts (${schemaExports.length} schemas - zod/mini)`
    );
    console.log(
      `  - packages/jsonrpc-types/src/methods.ts (${Object.keys(PATH_TO_METHOD_MAP).length} methods)`
    );

    // Generate client interface with proper types
    console.log('\n🔧 Generating client interface...');
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const projectRoot = join(currentDir, '../..');
    const clientInterfacePath = join(
      projectRoot,
      'packages/jsonrpc-client/src/generated-types.ts'
    );
    await generateClientInterface(
      Object.values(PATH_TO_METHOD_MAP),
      clientInterfacePath,
      PATH_TO_METHOD_MAP,
      spec
    );
    console.log(
      '  - packages/jsonrpc-client/src/generated-types.ts (client interface)'
    );
  } catch (error) {
    console.error('❌ Generation failed:', error);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTypes().catch(console.error);
}

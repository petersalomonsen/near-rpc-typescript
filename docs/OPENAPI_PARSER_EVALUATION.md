# OpenAPI Parser Evaluation: Custom vs Library Approach

## Current Situation

This project uses a custom OpenAPI parser implementation in `tools/codegen/generate.ts` to generate TypeScript types and Zod schemas from the NEAR OpenAPI specification.

## Analysis Date: July 29, 2025

### Current Custom Implementation

#### Pros
- **NEAR-specific customizations**: Handles snake_case to camelCase conversions (NEAR uses snake_case in JSON-RPC)
- **Zod integration**: Generates Zod schemas for runtime validation alongside TypeScript types
- **Optimized output**: Generates exactly what's needed for this specific use case
- **Tree-shaking friendly**: Generates individual functions that can be tree-shaken
- **Full control**: Can handle NEAR's quirks and edge cases (like duplicate schema naming conflicts)

#### Cons
- **Maintenance burden**: We have to fix issues ourselves (e.g., duplicate schema bug from July 29, 2025)
- **Missing features**: Basic implementation of oneOf, anyOf, allOf - may miss complex schema patterns
- **No community support**: When OpenAPI spec evolves, we need to update the parser
- **Potential bugs**: Custom parsers can miss edge cases that established libraries handle

### Using Established Libraries

Popular options include:
- `openapi-typescript` (7.8.0) - Most popular, actively maintained
- `@openapitools/openapi-generator-cli` (2.21.4) - Official OpenAPI generator
- `@hey-api/openapi-ts` (0.80.1) - Modern alternative with good TypeScript support

#### Pros
- **Battle-tested**: Handles edge cases and complex schemas
- **Community maintained**: Updates when OpenAPI spec evolves
- **Full feature support**: Handles all OpenAPI 3.0/3.1 features properly
- **Less code to maintain**: Just configuration instead of implementation
- **Better error handling**: Mature libraries have robust error messages

#### Cons
- **Less control**: Harder to handle NEAR-specific requirements
- **May not integrate with Zod**: Would need additional work for runtime validation
- **Bundle size**: Might include features we don't need
- **Case conversion**: May need post-processing for snake_case → camelCase conversion
- **Two-step process**: Might need to generate types first, then process them for Zod schemas

## Recommendation

**Keep the custom implementation for now**, but improve it:

1. **Add robust error handling**: Better detection of duplicate schemas and naming conflicts
2. **Improve test coverage**: Add tests for edge cases we've encountered
3. **Consider hybrid approach**: Use an OpenAPI parser library just for parsing the spec, but keep custom generation logic
4. **Document thoroughly**: Add inline documentation explaining NEAR-specific logic

## Future Considerations

If we encounter more complex OpenAPI features or maintenance becomes burdensome, consider:

1. Using `openapi-typescript` for type generation + custom post-processor for Zod schemas
2. Contributing NEAR-specific features back to an existing library
3. Creating a plugin system for existing generators to handle our use cases

## Related Issues

- Duplicate schema generation bug (fixed July 29, 2025)
- Need for snake_case to camelCase conversion
- Requirement for both TypeScript types and Zod schemas
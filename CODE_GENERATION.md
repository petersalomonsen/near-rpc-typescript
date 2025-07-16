# Code Generation

The TypeScript types and Zod schemas in this project are automatically generated from the NEAR Protocol OpenAPI specification.

## Process

1.  The `update-types.yml` GitHub Actions workflow runs daily.
2.  The workflow fetches the latest OpenAPI specification from the `nearcore` repository.
3.  The `tools/codegen` script is executed to generate the new types and schemas.
4.  If there are any changes, a pull request is automatically created with the updated files.

## Running the Code Generation Manually

You can also run the code generation script manually:

```bash
pnpm generate
```

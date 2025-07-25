# Claude Assistant Notes

This file contains important notes and reminders for Claude when working on this project.

## Testing

- **Always run tests with `--run` flag** to avoid watch mode:
  - Use `pnpm test --run` instead of `pnpm test`
  - Use `vitest run` instead of `vitest`
  - Watch mode causes tests to hang waiting for file changes, leading to timeouts

## Project Structure

- This is a monorepo using pnpm workspaces
- Main packages:
  - `packages/jsonrpc-types`: TypeScript types and Zod schemas
  - `packages/jsonrpc-client`: RPC client implementation
  - `tools/codegen`: Code generation from OpenAPI spec

## Code Generation

- The `PATH_TO_METHOD_MAP` is now dynamically extracted from the OpenAPI spec
- Run `pnpm generate` to regenerate types and schemas from the latest NEAR OpenAPI spec
- The generator extracts method names from the `operationId` field in each path

## Git Workflow

- **Main branch is protected** - all changes must go through PRs, cannot push directly to main
- Create feature branches and submit PRs for any fixes or changes

## Release Management

- Uses Release Please to automate releases based on conventional commits
- Release Please only considers "user facing" commits for releases
- Automated commits from bots may not trigger releases by default
- Type generation updates should use `feat:` prefix to trigger releases

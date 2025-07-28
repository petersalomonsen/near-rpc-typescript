# Claude Assistant Notes

This file contains important notes and reminders for Claude when working on this project.

## Git Commits

- **ALWAYS use conventional commits** - This project uses Release Please for automated releases
- Use `fix:` for bug fixes (triggers patch release)
- Use `feat:` for new features (triggers minor release)
- Use `chore:`, `docs:`, `test:`, `refactor:`, `perf:`, `style:` for non-releasing changes
- **NEVER include "BREAKING CHANGE:" in commit messages unless there's an actual breaking change**
  - Even "BREAKING CHANGE: None" will trigger a major version bump!
  - Only use when making incompatible API changes
- See RELEASE.md for full commit message conventions

## Testing

- **Always run tests with `--run` flag** to avoid watch mode:
  - Use `pnpm test --run` instead of `pnpm test`
  - Use `vitest run` instead of `vitest`
  - Watch mode causes tests to hang waiting for file changes, leading to timeouts

## RPC Endpoints

- **Use FastNEAR endpoints for testing and examples** (near.org has rate limits):
  - Mainnet: `https://rpc.mainnet.fastnear.com`
  - Testnet: `https://rpc.testnet.fastnear.com`
  - Avoid using `rpc.mainnet.near.org` or `rpc.testnet.near.org` due to rate limiting

## Project Structure

- This is a monorepo using pnpm workspaces
- Main packages:
  - `packages/jsonrpc-types`: TypeScript types and Zod schemas
  - `packages/jsonrpc-client`: RPC client implementation
  - `tools/codegen`: Code generation from OpenAPI spec

## Code Generation

- **CRITICAL: Everything is auto-generated from OpenAPI spec - DO NOT HARDCODE!**
- **When adding new features, ALWAYS check if it should be generated in `tools/codegen/generate.ts`**
- **Never manually maintain lists of RPC methods, schemas, or mappings - generate them!**

- The `PATH_TO_METHOD_MAP` is now dynamically extracted from the OpenAPI spec
- Run `pnpm generate` to regenerate types and schemas from the latest NEAR OpenAPI spec
- The generator extracts method names from the `operationId` field in each path
- All RPC functions, types, schemas, and mappings should be auto-generated
- If something seems like it should be generated but isn't, update the generator first

## Git Workflow

- **Main branch is protected** - all changes must go through PRs, cannot push directly to main
- Create feature branches and submit PRs for any fixes or changes
- **ALWAYS run `pnpm format` before committing** - This ensures consistent code style across the project

## Release Management

- Uses Release Please to automate releases based on conventional commits
- Release Please only considers "user facing" commits for releases
- Automated commits from bots may not trigger releases by default
- Type generation updates should use `feat:` prefix to trigger releases

## RPC Version Compatibility Notes

- **Different RPC providers run different versions of NEAR node software**
- Example: `changes` method is available in 2.7.0+ (currently on testnet), while `EXPERIMENTAL_changes` works on all versions
- **Always check RPC provider versions** when using newer methods - use the `status` method
- **The OpenAPI spec reflects the latest capabilities** - production providers may run older versions
- See docs/RPC_COMPATIBILITY_NOTES.md for detailed version compatibility information

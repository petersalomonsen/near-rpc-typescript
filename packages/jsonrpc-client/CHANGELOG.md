# Changelog

## [1.0.0](https://github.com/petersalomonsen/near-rpc-typescript/compare/jsonrpc-client-v0.5.0...jsonrpc-client-v1.0.0) (2025-07-26)


### ⚠ BREAKING CHANGES

* Client now uses static functions instead of instance methods. Instead of client.block(), use block(client, params).

### Features

* make mini client the default implementation ([#32](https://github.com/petersalomonsen/near-rpc-typescript/issues/32)) ([5afbf92](https://github.com/petersalomonsen/near-rpc-typescript/commit/5afbf92249f93f52fa456882539cb7fadd8c93d2))

## [0.5.0](https://github.com/petersalomonsen/near-rpc-typescript/compare/jsonrpc-client-v0.4.0...jsonrpc-client-v0.5.0) (2025-07-25)


### Features

* add TypeScript Language Server testing for IntelliSense validation ([#30](https://github.com/petersalomonsen/near-rpc-typescript/issues/30)) ([30276d7](https://github.com/petersalomonsen/near-rpc-typescript/commit/30276d7be9028c7eb62d2dbd41e483897474f2c8))
* implement mini client with tree-shaking optimization and comprehensive examples ([#31](https://github.com/petersalomonsen/near-rpc-typescript/issues/31)) ([7d7b16d](https://github.com/petersalomonsen/near-rpc-typescript/commit/7d7b16d429b3174d5831f5d27ac3c59b56370b03))

## [0.4.0](https://github.com/petersalomonsen/near-rpc-typescript/compare/jsonrpc-client-v0.3.0...jsonrpc-client-v0.4.0) (2025-07-21)

### Features

- implement dynamic RPC client with proper TypeScript types ([#25](https://github.com/petersalomonsen/near-rpc-typescript/issues/25)) ([e0c2094](https://github.com/petersalomonsen/near-rpc-typescript/commit/e0c2094640646b2586c584a5e787322eac175d92))

## [0.3.0](https://github.com/petersalomonsen/near-rpc-typescript/compare/jsonrpc-client-v0.2.0...jsonrpc-client-v0.3.0) (2025-07-21)

### Features

- implement dynamic PATH_TO_METHOD_MAP extraction ([#17](https://github.com/petersalomonsen/near-rpc-typescript/issues/17)) ([532c1de](https://github.com/petersalomonsen/near-rpc-typescript/commit/532c1de3fa26ffcbcb1366a7927ccc926a50e780))

### Bug Fixes

- resolve flaky performance test that fails on negative validation overhead ([#19](https://github.com/petersalomonsen/near-rpc-typescript/issues/19)) ([05dbec5](https://github.com/petersalomonsen/near-rpc-typescript/commit/05dbec5880f309b455849fd4154d8c9bf41aa5f0))

## [0.2.0](https://github.com/petersalomonsen/near-rpc-typescript/compare/jsonrpc-client-v0.1.0...jsonrpc-client-v0.2.0) (2025-07-20)

### Features

- add browser support with Playwright tests and temporary [@psalomo](https://github.com/psalomo) publishing ([#14](https://github.com/petersalomonsen/near-rpc-typescript/issues/14)) ([6abd7bb](https://github.com/petersalomonsen/near-rpc-typescript/commit/6abd7bb01b75f431cb3eeaa48aced2f6e7658a34))
- add comprehensive Zod validation performance tests ([#12](https://github.com/petersalomonsen/near-rpc-typescript/issues/12)) ([a978102](https://github.com/petersalomonsen/near-rpc-typescript/commit/a978102aa2cd4fcd81b020df0d153363f04d794b))

## [0.1.0](https://github.com/petersalomonsen/near-rpc-typescript/compare/jsonrpc-client-v0.0.1...jsonrpc-client-v0.1.0) (2025-07-17)

### Features

- configure GitHub release tarball distribution for [@near-js](https://github.com/near-js) packages ([#9](https://github.com/petersalomonsen/near-rpc-typescript/issues/9)) ([36d6393](https://github.com/petersalomonsen/near-rpc-typescript/commit/36d6393c10ccf95ad85fe91ae84354f01e42df93))
- test release-please after enabling PR permissions ([ece29ad](https://github.com/petersalomonsen/near-rpc-typescript/commit/ece29addf43df8a07c13accbffc2097a8f3264cf))
- **testing:** implement comprehensive testing and coverage ([28c2479](https://github.com/petersalomonsen/near-rpc-typescript/commit/28c24799bcbd0992bae837dd82ee6cf0937083a3))

### Bug Fixes

- improve CI workflow order and add lint step to scheduled generation ([be575da](https://github.com/petersalomonsen/near-rpc-typescript/commit/be575da692510bbdd414248b54ce639a4451486d))

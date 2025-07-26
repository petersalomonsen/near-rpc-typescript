import { describe, it, expect, beforeAll } from 'vitest';
import * as ts from 'typescript';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Developer Experience Scenarios', () => {
  let languageService: ts.LanguageService;
  let host: ts.LanguageServiceHost;
  let files: Map<string, { version: string; content: string }>;

  const updateFile = (fileName: string, content: string) => {
    const file = files.get(fileName);
    files.set(fileName, {
      version: file ? String(Number(file.version) + 1) : '1',
      content,
    });
  };

  beforeAll(() => {
    const clientDistPath = path.resolve(__dirname, '../dist/index.d.ts');
    const typesDistPath = path.resolve(
      __dirname,
      '../../jsonrpc-types/dist/index.d.ts'
    );

    files = new Map();

    host = {
      getScriptFileNames: () => Array.from(files.keys()),
      getScriptVersion: fileName => {
        const file = files.get(fileName);
        return file ? file.version : '1';
      },
      getScriptSnapshot: fileName => {
        const file = files.get(fileName);
        if (file) {
          return ts.ScriptSnapshot.fromString(file.content);
        }

        if (ts.sys.fileExists(fileName)) {
          const content = ts.sys.readFile(fileName)!;
          return ts.ScriptSnapshot.fromString(content);
        }

        return undefined;
      },
      getCurrentDirectory: () => process.cwd(),
      getCompilationSettings: () => ({
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ESNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        baseUrl: path.resolve(__dirname, '../..'),
        paths: {
          '@near-js/jsonrpc-client': [
            path.relative(path.resolve(__dirname, '../..'), clientDistPath),
          ],
          '@near-js/jsonrpc-types': [
            path.relative(path.resolve(__dirname, '../..'), typesDistPath),
          ],
        },
        lib: ['es2022', 'dom'],
      }),
      getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
      fileExists: ts.sys.fileExists,
      readFile: ts.sys.readFile,
      readDirectory: ts.sys.readDirectory,
      directoryExists: ts.sys.directoryExists,
      getDirectories: ts.sys.getDirectories,
      resolveModuleNames: (moduleNames, containingFile) => {
        const resolvedModules: (ts.ResolvedModule | undefined)[] = [];

        for (const moduleName of moduleNames) {
          if (moduleName === '@near-js/jsonrpc-client') {
            resolvedModules.push({
              resolvedFileName: clientDistPath,
              isExternalLibraryImport: false,
            });
          } else if (moduleName === '@near-js/jsonrpc-types') {
            resolvedModules.push({
              resolvedFileName: typesDistPath,
              isExternalLibraryImport: false,
            });
          } else {
            const result = ts.resolveModuleName(
              moduleName,
              containingFile,
              host.getCompilationSettings(),
              host
            );
            resolvedModules.push(result.resolvedModule);
          }
        }

        return resolvedModules;
      },
    };

    languageService = ts.createLanguageService(
      host,
      ts.createDocumentRegistry()
    );
  });

  it('should show client methods and static functions are available', () => {
    const testFile = 'test-basic-completion.ts';
    const content = `
import { NearRpcClient, block, status, query } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.near.org' });
client.`;

    updateFile(testFile, content);

    const position = content.lastIndexOf('.') + 1;
    const completions = languageService.getCompletionsAtPosition(
      testFile,
      position,
      undefined
    )!;

    expect(completions).toBeDefined();

    const methodNames = completions.entries.map(entry => entry.name);

    // Should include client core methods but not RPC methods
    expect(methodNames).toContain('makeRequest');
    expect(methodNames).toContain('withConfig');
  });

  it('should provide hover information for static RPC functions', () => {
    const testFile = 'test-hover.ts';
    const content = `
import { NearRpcClient, block } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.near.org' });
block`;

    updateFile(testFile, content);

    const blockPosition = content.lastIndexOf('block') + 2; // Middle of 'block'
    const quickInfo = languageService.getQuickInfoAtPosition(
      testFile,
      blockPosition
    )!;

    expect(quickInfo).toBeDefined();
    expect(quickInfo.displayParts).toBeDefined();

    const typeInfo = quickInfo.displayParts!.map(part => part.text).join('');

    // Should show it's a method that returns a Promise
    expect(typeInfo).toContain('Promise');
    expect(typeInfo).toMatch(/block.*Promise/);
  });

  it('should show parameter information for static RPC functions', () => {
    const testFile = 'test-parameters.ts';
    const content = `
import { NearRpcClient, viewAccount } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.near.org' });
viewAccount(client, {
  accountId: "example.near",
  `;

    updateFile(testFile, content);

    // Position after the comma in the parameter object
    const position = content.lastIndexOf(',') + 1;
    const completions = languageService.getCompletionsAtPosition(
      testFile,
      position,
      undefined
    )!;

    expect(completions).toBeDefined();

    const paramNames = completions.entries.map(entry => entry.name);

    // Should show available parameters for viewAccount
    expect(paramNames).toContain('finality');
    expect(paramNames).toContain('blockId');
  });

  it('should provide error diagnostics for incorrect usage', () => {
    const testFile = 'test-diagnostics.ts';
    const content = `
import { NearRpcClient, viewAccount } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.near.org' });
// This should cause a type error - wrong parameter type
viewAccount(client, { accountId: 123 });`;

    updateFile(testFile, content);

    const diagnostics = languageService.getSemanticDiagnostics(testFile);

    // Should have at least one diagnostic for the type error
    expect(diagnostics.length).toBeGreaterThan(0);

    // Check that it's specifically about the accountId parameter
    const hasAccountIdError = diagnostics.some(d => {
      const message = ts.flattenDiagnosticMessageText(d.messageText, '\\n');
      return (
        message.includes('accountId') ||
        message.includes('string') ||
        message.includes('number')
      );
    });

    expect(hasAccountIdError).toBe(true);
  });

  it('should show completions for chained method calls', () => {
    const testFile = 'test-chaining.ts';
    const content = `
import { NearRpcClient, status } from '@near-js/jsonrpc-client';

const client = new NearRpcClient({ endpoint: 'https://rpc.testnet.near.org' });
status(client).then(result => result.`;

    updateFile(testFile, content);

    const position = content.lastIndexOf('.') + 1;
    const completions = languageService.getCompletionsAtPosition(
      testFile,
      position,
      undefined
    )!;

    expect(completions).toBeDefined();

    const propertyNames = completions.entries.map(entry => entry.name);

    // Should show properties from the status response
    expect(propertyNames.length).toBeGreaterThan(0);

    // Common properties that should be in status response
    const hasStatusProperties = propertyNames.some(name =>
      [
        'chain_id',
        'latest_protocol_version',
        'protocol_version',
        'rpc_addr',
        'sync_info',
        'validator_account_id',
        'validators',
      ].includes(name)
    );

    expect(hasStatusProperties).toBe(true);
  });
});

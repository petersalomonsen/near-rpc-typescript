import { describe, it, expect, beforeAll } from 'vitest';
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('TypeScript Examples Language Server Check', () => {
  let languageService: ts.LanguageService;
  let host: ts.LanguageServiceHost;
  let files: Map<string, { version: string; content: string }>;

  beforeAll(() => {
    files = new Map();

    // Create language service host
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
        skipLibCheck: false,
        forceConsistentCasingInFileNames: true,
        jsx: ts.JsxEmit.React,
        lib: ['es2022', 'dom'],
        resolveJsonModule: true,
        allowJs: true,
        baseUrl: path.resolve(__dirname, '../..'),
        paths: {
          '@near-js/jsonrpc-client': [
            'packages/jsonrpc-client/dist/index.d.ts',
          ],
          '@near-js/jsonrpc-client/mini': [
            'packages/jsonrpc-client/dist/mini.d.ts',
          ],
          '@near-js/jsonrpc-types': ['packages/jsonrpc-types/dist/index.d.ts'],
          '@near-js/jsonrpc-types/mini': [
            'packages/jsonrpc-types/dist/mini.d.ts',
          ],
        },
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
          // Handle our workspace packages
          if (moduleName.startsWith('@near-js/')) {
            const packagePath =
              host.getCompilationSettings().paths?.[moduleName];
            if (packagePath && packagePath[0]) {
              const resolvedPath = path.resolve(
                __dirname,
                '../..',
                packagePath[0]
              );
              if (ts.sys.fileExists(resolvedPath)) {
                resolvedModules.push({
                  resolvedFileName: resolvedPath,
                  isExternalLibraryImport: false,
                });
                continue;
              }
            }
          }

          // Standard module resolution
          const result = ts.resolveModuleName(
            moduleName,
            containingFile,
            host.getCompilationSettings(),
            host
          );
          resolvedModules.push(result.resolvedModule);
        }

        return resolvedModules;
      },
    };

    languageService = ts.createLanguageService(
      host,
      ts.createDocumentRegistry()
    );
  });

  const checkFile = (filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    files.set(filePath, { version: '1', content });

    const diagnostics = [
      ...languageService.getSyntacticDiagnostics(filePath),
      ...languageService.getSemanticDiagnostics(filePath),
    ];

    return diagnostics;
  };

  const getDiagnosticMessage = (diagnostic: ts.Diagnostic): string => {
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      '\n'
    );
    if (diagnostic.file && diagnostic.start !== undefined) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      return `${diagnostic.file.fileName}:${line + 1}:${character + 1} - ${message}`;
    }
    return message;
  };

  it('TypeScript examples should have no language server errors', async () => {
    const examplesDir = path.resolve(__dirname);
    const tsFiles = await glob('**/*.ts', {
      cwd: examplesDir,
      absolute: true,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/build/**',
        '**/coverage/**',
      ],
    });

    const errors: { file: string; errors: string[] }[] = [];

    for (const file of tsFiles) {
      const diagnostics = checkFile(file);

      if (diagnostics.length > 0) {
        errors.push({
          file: path.relative(process.cwd(), file),
          errors: diagnostics.map(getDiagnosticMessage),
        });
      }
    }

    if (errors.length > 0) {
      console.error('\nTypeScript errors found in examples:\n');
      errors.forEach(({ file, errors }) => {
        console.error(`\n${file}:`);
        errors.forEach(error => console.error(`  ${error}`));
      });
    }

    expect(errors).toHaveLength(0);
  });

  it('React examples should have no TypeScript errors', async () => {
    const reactExamplesDir = path.resolve(__dirname, '../react-mini-client');

    // Check if React example has its own tsconfig
    const tsconfigPath = path.join(reactExamplesDir, 'tsconfig.json');

    if (fs.existsSync(tsconfigPath)) {
      // Use the React project's own TypeScript configuration
      const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
      const parsedConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        reactExamplesDir
      );

      const program = ts.createProgram(
        parsedConfig.fileNames,
        parsedConfig.options
      );

      const diagnostics = ts.getPreEmitDiagnostics(program);

      const errors: string[] = [];
      diagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
          const { line, character } =
            diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
          const message = ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n'
          );
          const filePath = path.relative(
            process.cwd(),
            diagnostic.file.fileName
          );
          errors.push(`${filePath}:${line + 1}:${character + 1} - ${message}`);
        }
      });

      if (errors.length > 0) {
        console.error('\nTypeScript errors found in React examples:\n');
        errors.forEach(error => console.error(`  ${error}`));
      }

      expect(errors).toHaveLength(0);
    } else {
      // Fall back to original test if no tsconfig
      const tsxFiles = await glob('**/*.{ts,tsx}', {
        cwd: reactExamplesDir,
        absolute: true,
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          '**/*.d.ts',
          '**/build/**',
          '**/coverage/**',
        ],
      });

      const errors: { file: string; errors: string[] }[] = [];

      for (const file of tsxFiles) {
        const diagnostics = checkFile(file);

        if (diagnostics.length > 0) {
          errors.push({
            file: path.relative(process.cwd(), file),
            errors: diagnostics.map(getDiagnosticMessage),
          });
        }
      }

      if (errors.length > 0) {
        console.error('\nTypeScript errors found in React examples:\n');
        errors.forEach(({ file, errors }) => {
          console.error(`\n${file}:`);
          errors.forEach(error => console.error(`  ${error}`));
        });
      }

      expect(errors).toHaveLength(0);
    }
  });

  it('Tree-shaking examples should have no TypeScript errors', async () => {
    const treeShakingDir = path.resolve(__dirname, '../tree-shaking');
    const tsFiles = await glob('**/*.ts', {
      cwd: treeShakingDir,
      absolute: true,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/build/**',
        '**/coverage/**',
        '**/*.config.js',
        '**/*.config.ts',
        '**/*.config.min.js',
      ],
    });

    const errors: { file: string; errors: string[] }[] = [];

    for (const file of tsFiles) {
      const diagnostics = checkFile(file);

      if (diagnostics.length > 0) {
        errors.push({
          file: path.relative(process.cwd(), file),
          errors: diagnostics.map(getDiagnosticMessage),
        });
      }
    }

    if (errors.length > 0) {
      console.error('\nTypeScript errors found in tree-shaking examples:\n');
      errors.forEach(({ file, errors }) => {
        console.error(`\n${file}:`);
        errors.forEach(error => console.error(`  ${error}`));
      });
    }

    expect(errors).toHaveLength(0);
  });
});

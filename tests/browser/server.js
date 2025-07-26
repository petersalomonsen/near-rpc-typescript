import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// Bundle paths - serve directly from dist folder
const BUNDLE_PATHS = {
  'browser-standalone.js': join(
    __dirname,
    '../../packages/jsonrpc-client/dist/browser-standalone.js'
  ),
  'browser-standalone.min.js': join(
    __dirname,
    '../../packages/jsonrpc-client/dist/browser-standalone.min.js'
  ),
};

// React app paths
const REACT_APP_DIR = join(__dirname, '../../examples/react-mini-client/dist');

async function serveStaticFiles(requestPath, res) {
  // Check if this is a request for a static asset from React app
  if (requestPath.startsWith('assets/')) {
    const filePath = join(REACT_APP_DIR, requestPath);
    await serveFile(filePath, res);
    return true;
  }
  return false;
}

async function serveFile(filePath, res) {
  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = extname(filePath);
    const mimeType = mimeTypes[ext] || 'text/plain';

    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('Not Found');
  }
}

const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let url = req.url;
  if (url === '/') {
    url = '/index.html';
  }

  // Remove leading slash for path lookup
  const requestedFile = url.substring(1);

  // Route requests
  if (requestedFile === 'index.html') {
    await serveFile(join(__dirname, 'index.html'), res);
  } else if (requestedFile === 'mini.html') {
    await serveFile(join(__dirname, 'mini.html'), res);
  } else if (requestedFile === 'react' || requestedFile === 'react.html') {
    // Serve React app
    await serveFile(join(REACT_APP_DIR, 'index.html'), res);
  } else if (BUNDLE_PATHS[requestedFile]) {
    // Serve bundle files directly from dist folder
    await serveFile(BUNDLE_PATHS[requestedFile], res);
  } else if (await serveStaticFiles(requestedFile, res)) {
    // Static files were served by serveStaticFiles
    return;
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Available pages:');
  console.log('  - / (client test page)');
  console.log('  - /mini.html (alternative test page)');
  console.log('  - /react (React client example)');
  console.log('Available bundles:');
  console.log('  - /browser-standalone.js (unminified)');
  console.log('  - /browser-standalone.min.js (minified)');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { server, PORT };

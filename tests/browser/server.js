import { createServer } from 'http';
import { readFile, stat, copyFile } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

async function copyBundle() {
  try {
    const sourcePath = join(__dirname, '../../packages/jsonrpc-client/dist/browser-standalone.js');
    const destPath = join(__dirname, 'near-rpc-client.js');
    await copyFile(sourcePath, destPath);
    console.log('Bundle copied to tests/browser/near-rpc-client.js');
  } catch (error) {
    console.error('Failed to copy bundle:', error.message);
  }
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

  // Route requests
  if (url === '/index.html') {
    await serveFile(join(__dirname, 'index.html'), res);
  } else if (url === '/near-rpc-client.js') {
    await serveFile(join(__dirname, 'near-rpc-client.js'), res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Copy bundle before starting server
await copyBundle();

server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { server, PORT };
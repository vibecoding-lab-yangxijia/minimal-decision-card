// Minimal static file server for the static export (out/), SPA-friendly.
// Usage: node scripts/serve-out.js  (PORT env var optional)
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'out');
const port = Number(process.env.PORT || 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.map': 'application/json',
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end('Bad Request'); }
  if (p === '/') p = '/index.html';
  let file = path.normalize(path.join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }

  const candidates = [file];
  if (!path.extname(file)) candidates.push(file + '.html', path.join(file, 'index.html'));

  const tryNext = (i) => {
    if (i >= candidates.length) {
      fs.readFile(path.join(root, '404.html'), (e, d) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(e ? 'Not Found' : d);
      });
      return;
    }
    const c = candidates[i];
    fs.stat(c, (err, st) => {
      if (err || !st.isFile()) return tryNext(i + 1);
      fs.readFile(c, (e2, data) => {
        if (e2) return tryNext(i + 1);
        res.writeHead(200, { 'Content-Type': MIME[path.extname(c).toLowerCase()] || 'application/octet-stream' });
        res.end(data);
      });
    });
  };
  tryNext(0);
}).listen(port, '0.0.0.0', () => {
  console.log('minimal-decision-card serving http://localhost:' + port + '  (root: ' + root + ')');
});

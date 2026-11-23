import app from '../server/index.js';

export default function handler(req, res) {
  const matchedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'];
  if (matchedPath && (req.url === '/api/index.js' || req.url === '/api' || req.url === '/api/')) {
    req.url = matchedPath;
  }
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}

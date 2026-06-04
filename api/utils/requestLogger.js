const crypto = require('crypto');

function createRequestId() {
  return crypto.randomUUID();
}

function requestIdMiddleware(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const requestId =
    typeof incoming === 'string' && incoming.length > 0
      ? incoming
      : createRequestId();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();
  res.on('finish', () => {
    const entry = {
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      request_id: requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(entry));
  });

  next();
}

module.exports = { requestIdMiddleware, createRequestId };

const { PostHog } = require('posthog-node');

let _client = null;

function getPostHogClient() {
  if (_client) return _client;
  const apiKey = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST;
  if (!apiKey || !host) return null;
  _client = new PostHog(apiKey, {
    host,
    enableExceptionAutocapture: true,
  });
  process.on('SIGINT', () => _client && _client.shutdown());
  process.on('SIGTERM', () => _client && _client.shutdown());
  return _client;
}

module.exports = { getPostHogClient };

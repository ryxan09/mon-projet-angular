function normalizeSupabaseUrl(value) {
  const url = new URL(value);
  if (url.pathname.replace(/\/+$/, '') === '/rest/v1') {
    url.pathname = '/';
  }
  return url.toString().replace(/\/$/, '');
}

module.exports = { normalizeSupabaseUrl };

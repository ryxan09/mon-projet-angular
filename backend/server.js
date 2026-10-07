require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const { createApp } = require('./src/app');
const { normalizeSupabaseUrl } = require('./src/supabase-url');

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.');
}

const supabase = createClient(normalizeSupabaseUrl(SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY);
const app = createApp(supabase);
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Task API listening on http://localhost:${port}`);
});

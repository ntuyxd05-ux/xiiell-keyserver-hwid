const { sql } = require("@vercel/postgres");
async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS keys(
    key TEXT PRIMARY KEY,
    hwid TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ
  );`;
  await sql`CREATE INDEX IF NOT EXISTS idx_keys_hwid ON keys(hwid);`;
}
module.exports = { sql, ensureSchema };


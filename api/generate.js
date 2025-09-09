const { sql, ensureSchema } = require("./_db");
const { withCors, adminOK, getConfig, newKey } = require("./_utils");

module.exports = async (req, res) => {
  if (withCors(req,res)) return;
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"method_not_allowed" });
  if (!adminOK(req)) return res.status(401).json({ ok:false, error:"unauthorized" });

  await ensureSchema();
  const body = req.body || {};
  const hwid = (body.hwid || "").toString().trim();
  const note = (body.note || "").toString().trim();
  if (!hwid || hwid.length < 6) return res.status(400).json({ ok:false, error:"invalid_hwid" });

  const { KEY_LEN, EXPIRES_DAYS } = getConfig();
  const key = newKey(KEY_LEN);
  const createdAt = new Date();
  const expiresAt = EXPIRES_DAYS > 0 ? new Date(createdAt.getTime()+EXPIRES_DAYS*86400000) : null;

  await sql`INSERT INTO keys(key, hwid, note, created_at, expires_at)
            VALUES (${key}, ${hwid}, ${note || null}, ${createdAt.toISOString()}, ${expiresAt ? expiresAt.toISOString() : null});`;
  res.json({ ok:true, key, hwid, expires_at: expiresAt ? expiresAt.toISOString() : null });
};


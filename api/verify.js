
const { sql, ensureSchema } = require("./_db");
const { withCors } = require("./_utils");

module.exports = async (req, res) => {
  if (withCors(req,res)) return;
  if (req.method !== "GET") return res.status(405).json({ ok:false, error:"method_not_allowed" });

  await ensureSchema();
  const key = (req.query.key || "").toString().trim();
  const hwid = (req.query.hwid || "").toString().trim();
  if (!key || !hwid) return res.status(400).json({ ok:false, error:"missing_key_or_hwid" });

  const { rows } = await sql`SELECT key, hwid, expires_at FROM keys WHERE key = ${key} LIMIT 1;`;
  const row = rows[0];
  if (!row) return res.json({ ok:false, error:"key_not_found" });
  if (row.hwid !== hwid) return res.json({ ok:false, error:"hwid_mismatch" });
  if (row.expires_at && Date.now() > new Date(row.expires_at).getTime())
    return res.json({ ok:false, error:"expired" });

  res.json({ ok:true, key: row.key, hwid: row.hwid });
};

const { sql, ensureSchema } = require("../../_db");
const { withCors, adminOK } = require("../../_utils");

module.exports = async (req, res) => {
  if (withCors(req,res)) return;
  if (req.method !== "GET") return res.status(405).json({ ok:false, error:"method_not_allowed" });
  if (!adminOK(req)) return res.status(401).json({ ok:false, error:"unauthorized" });

  await ensureSchema();
  const hwid = (req.query.hwid || "").toString().trim();
  const { rows } = await sql`SELECT key, hwid, created_at, expires_at, note FROM keys WHERE hwid = ${hwid} ORDER BY created_at DESC;`;
  res.json({ ok:true, items: rows });
};


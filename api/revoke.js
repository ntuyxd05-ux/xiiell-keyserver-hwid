
const { sql, ensureSchema } = require("./_db");
const { withCors, adminOK } = require("./_utils");

module.exports = async (req, res) => {
  if (withCors(req,res)) return;
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"method_not_allowed" });
  if (!adminOK(req)) return res.status(401).json({ ok:false, error:"unauthorized" });

  await ensureSchema();
  const key = (req.body?.key || "").toString().trim();
  if (!key) return res.status(400).json({ ok:false, error:"missing_key" });

  const result = await sql`DELETE FROM keys WHERE key = ${key};`;
  res.json({ ok:true, deleted: result.rowCount || 0 });
};

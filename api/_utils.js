const { nanoid } = require("nanoid");
function withCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") { res.status(200).end(); return true; }
  return false;
}
function adminOK(req) {
  const hdr = req.headers.authorization || "";
  const token = hdr.split(" ")[1];
  return token && token === (process.env.ADMIN_SECRET || "changeme");
}
function getConfig() {
  return {
    KEY_LEN: parseInt(process.env.KEY_LEN || "28", 10),
    EXPIRES_DAYS: parseInt(process.env.EXPIRES_DAYS || "0", 10)
  };
}
function newKey(len){ return nanoid(len); }
module.exports = { withCors, adminOK, getConfig, newKey };


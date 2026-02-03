const { info } = require("../utils/logger"); // Adjust path to where your logger file is
module.exports = async (req, res, next) => {	
  const start = process.hrtime();
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  let location = "Unknown";
  if (ip === "::1" || ip === "127.0.0.1") {
    location = "Localhost";
  } else if (
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.")
  ) {
    location = "Private Network";
  } else {
    location = "Public Network";
  }
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
    const status = res.statusCode;
    const email = req.decoded?.email || req.body?.email || req.query?.email || "Anonymous";
    const refNumber = req.decoded?.reference_number || req.body?.reference_number || req.query?.reference_number || "Anonymous";
    const method = req.method;
    const url = req.originalUrl;
    const logMessage = `[STATUS: ${status}] USER_INFO: EMAIL:- ${email} - REF_NO:- ${refNumber} | IP: ${ip} | Location: ${location} | ${method} ${url} | ${responseTime} ms`;
    info(logMessage);
  });
  next();
};

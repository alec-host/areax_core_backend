const fs = require("fs");
const path = require("path");
const winston = require("winston");
const { PRODUCTIONLOG_DIR } = require("../constants/app_constants.js");
// Use this for production
const logBaseDir = PRODUCTIONLOG_DIR;
// Use this for local development
// const logBaseDir = path.join(__dirname, "../logs");
console.log("logBaseDir:", logBaseDir);
let currentMonth = "";
let currentDay = "";
let currentHour = "";
let fileTransport = null;
const ensureDirExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    // Check if a file is blocking the directory creation
    if (error.code === "ENOTDIR") {
      let tempPath = dirPath;
      const root = path.parse(tempPath).root;
      
      // Walk up to find the blocking file
      while (tempPath !== root) {
        if (fs.existsSync(tempPath) && !fs.statSync(tempPath).isDirectory()) {
          console.warn(`[Logger] Found file blocking directory creation at: ${tempPath}`);
          console.warn(`[Logger] Attempting to remove it...`);
          
          // This might throw EACCES if we don't have permission
          fs.unlinkSync(tempPath); 
          
          // Retry creation
          fs.mkdirSync(dirPath, { recursive: true });
          return;
        }
        tempPath = path.dirname(tempPath);
      }
    }
    // Rethrow other errors (or EACCES from unlinkSync) to be caught by updateLogPath
    throw error;
  }
};
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${
        typeof message === "object" ? JSON.stringify(message) : message
      }`;
    })
  ),
  transports: [
    new winston.transports.Console(), 
  ],
});
const updateLogPath = () => {
  const now = new Date();
  const newMonth = now.toISOString().slice(0, 7);
  const newDay = now.getDate().toString().padStart(2, "0");
  const newHour = now.getHours().toString().padStart(2, "0");
  // Check if we need to rotate logs
  if (
    newMonth !== currentMonth ||
    newDay !== currentDay ||
    newHour !== currentHour ||
    !fileTransport
  ) {
    // Update state immediately to prevent retrying endlessly within the same hour if it fails
    currentMonth = newMonth;
    currentDay = newDay;
    currentHour = newHour;
    const logDir = path.join(logBaseDir, currentMonth, currentDay);
    const logFilePath = path.join(logDir, `${currentHour}.log`);
    try {
      ensureDirExists(logDir);
      if (fileTransport) {
        logger.remove(fileTransport);
      }
      fileTransport = new winston.transports.File({
        filename: logFilePath,
        level: "info",
      });
      logger.add(fileTransport);
      
    } catch (err) {
      // CATCH BLOCK: Prevents app crash
      console.error(`\n[Logger] CRITICAL: Could not setup file logging at ${logFilePath}`);
      console.error(`[Logger] Reason: ${err.message}`);
      console.error(`[Logger] Continuing with CONSOLE LOGGING only.\n`);
      
      // Cleanup broken transport if exists
      if (fileTransport) {
         try { logger.remove(fileTransport); } catch(e) {}
         fileTransport = null;
      }
    }
  }
};
const logWrapper = (level, message) => {
  updateLogPath();
  logger.log({ level, message });
};
const info = (msg) => logWrapper("info", msg);
const error = (msg) => logWrapper("error", msg);
module.exports = {
  info,
  error,
  logger,
};

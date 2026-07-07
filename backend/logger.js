const path = require('path');
const fs = require('fs');

// Ensure log directory exists
const baseDir = process.env.USER_DATA_PATH || require('os').homedir();
const logDir = path.join(baseDir, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'combined.log');

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return `${timestamp} - brand_music_curator - ${level} - ${message}`;
};

const writeLog = (formattedMsg) => {
  try {
    fs.appendFileSync(logFile, formattedMsg + '\n', 'utf8');
  } catch (err) {
    // Fail silently to avoid breaking execution
  }
};

const logger = {
  info: (message) => {
    const formatted = formatMessage('INFO', message);
    console.info(formatted);
    writeLog(formatted);
  },
  warn: (message) => {
    const formatted = formatMessage('WARNING', message);
    console.warn(formatted);
    writeLog(formatted);
  },
  error: (message, err) => {
    const errorDetails = err ? ` | Error: ${err.message || err}` : '';
    const formatted = formatMessage('ERROR', `${message}${errorDetails}`);
    console.error(formatted);
    writeLog(formatted);
  },
  debug: (message) => {
    const formatted = formatMessage('DEBUG', message);
    console.debug(formatted);
    writeLog(formatted);
  }
};

module.exports = logger;

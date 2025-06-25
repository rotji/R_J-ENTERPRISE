// src/utils/logger.ts
import { createLogger, format, transports } from "winston";
const { combine, timestamp, colorize, printf, errors } = format;

// Custom log format
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} | ${level} | ${stack || message}`;
});

// Define logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info", // Fallback to 'info' if not set
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Log stack trace if available
    customFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), customFormat), // Pretty colored logs in terminal
    }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;

import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for console
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        consoleFormat,
      ),
    }),
    // Error file transport with daily rotation
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    // Combined file transport with daily rotation
    new winston.transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export default logger;

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'node:path';

const logsDir = path.join(process.cwd(), 'logs');

// Custom log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

// Transports
const transports: winston.transport[] = [];

// Console transport (development)
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: consoleFormat,
            level: 'debug',
        })
    );
}

// File transports (production)
if (process.env.NODE_ENV === 'production') {
    // Error logs
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '7d',
            format: logFormat,
        })
    );

    // Combined logs
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
            format: logFormat,
        })
    );
}

// Create logger instance
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports,
    exitOnError: false,
});

// Stream for Morgan (HTTP logging)
export const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};
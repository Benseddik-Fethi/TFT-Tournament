import { Request, Response, NextFunction } from 'express';
import { logger } from '@/shared/utils/logger';
import { AppError } from '@/shared/utils/errors';

export function errorMiddleware(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Default error
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors: unknown = undefined;

    // Handle AppError (custom errors)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }

    // Log error
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });

    // Send response
    res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
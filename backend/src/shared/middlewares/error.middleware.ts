import { Request, Response, NextFunction } from 'express';
import { logger } from '@/shared/utils/logger';
import { AppError } from '@/shared/utils/errors';

export function errorMiddleware(
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
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

    // Build response
    const response: Record<string, unknown> = {
        success: false,
        message,
    };

    if (errors) {
        response.errors = errors;
    }

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    // Send response
    res.status(statusCode).json(response);
}
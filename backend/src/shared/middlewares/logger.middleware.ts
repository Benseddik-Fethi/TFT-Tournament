import { Request, Response, NextFunction } from 'express';
import { logger } from '@/shared/utils/logger';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, originalUrl, ip } = req;
        const { statusCode } = res;

        const logData = {
            method,
            url: originalUrl,
            statusCode,
            duration: `${duration}ms`,
            ip,
            userAgent: req.get('user-agent'),
        };

        if (statusCode >= 500) {
            logger.error('HTTP Request', logData);
        } else if (statusCode >= 400) {
            logger.warn('HTTP Request', logData);
        } else {
            logger.info('HTTP Request', logData);
        }
    });

    next();
}
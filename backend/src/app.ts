import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from '@/shared/middlewares/error.middleware';
import { loggerMiddleware } from '@/shared/middlewares/logger.middleware';
import { rateLimitMiddleware } from '@/shared/middlewares/rate-limit.middleware';
import { logger } from '@/shared/utils/logger';

export function createApp(): Application {
    const app: Application = express();

    // ============================================
    // SECURITY MIDDLEWARE
    // ============================================
    app.use(helmet());
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
        })
    );

    // ============================================
    // PARSERS
    // ============================================
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ============================================
    // LOGGING
    // ============================================
    app.use(loggerMiddleware);

    // ============================================
    // RATE LIMITING
    // ============================================
    app.use('/api', rateLimitMiddleware);

    // ============================================
    // HEALTH CHECK
    // ============================================
    app.get('/health', (_req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        });
    });

    // ============================================
    // API ROUTES
    // ============================================
    // TODO: Add routes here
    // app.use('/api/auth', authRoutes);
    // app.use('/api/users', userRoutes);
    // app.use('/api/tournaments', tournamentRoutes);

    app.get('/api', (_req, res) => {
        res.json({
            message: 'TFT Arena API v1.0.0',
            documentation: '/api/docs',
            health: '/health',
        });
    });

    // ============================================
    // ERROR HANDLING
    // ============================================
    app.use(errorMiddleware);

    // ============================================
    // 404 HANDLER
    // ============================================
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: 'Route not found',
            path: req.originalUrl,
        });
    });

    logger.info('✅ Express app configured successfully');

    return app;
}
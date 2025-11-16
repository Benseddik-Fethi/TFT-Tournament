// IMPORTANT: Load environment variables BEFORE any imports
// This ensures OAuth strategies are registered correctly
import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { logger } from '@/shared/utils/logger';
import { prisma } from '@/shared/database/client';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// DEBUG: Log OAuth config on startup
// ============================================
logger.info('🔐 OAuth Configuration Status:');
logger.info(`  Google Client ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
logger.info(`  Google Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
logger.info(`  Discord Client ID: ${process.env.DISCORD_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
logger.info(`  Discord Client Secret: ${process.env.DISCORD_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
logger.info(`  Twitch Client ID: ${process.env.TWITCH_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
logger.info(`  Twitch Client Secret: ${process.env.TWITCH_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);

async function startServer() {
    try {
        // ============================================
        // DATABASE CONNECTION
        // ============================================
        logger.info('🔌 Connecting to database...');
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        // ============================================
        // CREATE EXPRESS APP
        // ============================================
        const app = createApp();

        // ============================================
        // START SERVER
        // ============================================
        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📝 Environment: ${NODE_ENV}`);
            logger.info(`🌐 API: http://localhost:${PORT}/api`);
            logger.info(`💚 Health: http://localhost:${PORT}/health`);
        });

        // ============================================
        // GRACEFUL SHUTDOWN
        // ============================================
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info('✅ HTTP server closed');

                // Disconnect database
                await prisma.$disconnect();
                logger.info('✅ Database disconnected');

                logger.info('👋 Graceful shutdown complete');
                process.exit(0);
            });

            // Force shutdown after 10s
            setTimeout(() => {
                logger.error('⚠️  Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // ============================================
        // UNHANDLED ERRORS
        // ============================================
        process.on('unhandledRejection', (reason: Error) => {
            logger.error('❌ Unhandled Rejection:', reason);
            throw reason;
        });

        process.on('uncaughtException', (error: Error) => {
            logger.error('❌ Uncaught Exception:', error);
            process.exit(1);
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
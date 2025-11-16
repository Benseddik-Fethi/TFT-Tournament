import { PrismaClient } from '@prisma/client';
import { logger } from '@/shared/utils/logger';

const prismaClientSingleton = () => {
    return new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? [
                    { emit: 'event', level: 'query' },
                    { emit: 'event', level: 'error' },
                    { emit: 'event', level: 'warn' },
                ]
                : ['error'],
    });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

// Log queries in development
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query' as never, (e: unknown) => {
        const event = e as { query: string; duration: number };
        logger.debug(`Query: ${event.query} - Duration: ${event.duration}ms`);
    });

    prisma.$on('error' as never, (e: unknown) => {
        const event = e as { message: string };
        logger.error(`Prisma Error: ${event.message}`);
    });

    prisma.$on('warn' as never, (e: unknown) => {
        const event = e as { message: string };
        logger.warn(`Prisma Warning: ${event.message}`);
    });
}

export default prisma;
/**
 * Type extensions for Express and Passport
 */

import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

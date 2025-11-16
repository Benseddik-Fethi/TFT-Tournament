import { z } from 'zod';

// ============================================
// USER SCHEMAS
// ============================================

export const riotIdSchema = z
    .string()
    .regex(/^[\w\s]{3,16}#[\w]{3,5}$/, 'Format Riot ID invalide (ex: PlayerName#EUW)')
    .optional();

export const updateUserSchema = z.object({
    username: z.string().min(3).max(50).optional(),
    riotId: riotIdSchema,
});

export const userFilterSchema = z.object({
    search: z.string().optional(),
    role: z.enum(['player', 'organizer', 'admin']).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});

// ============================================
// TYPES
// ============================================

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;
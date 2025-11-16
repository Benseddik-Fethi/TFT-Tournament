import { z } from 'zod';

// ============================================
// TOURNAMENT SCHEMAS
// ============================================

export const createTournamentSchema = z.object({
    name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(100),
    description: z.string().max(500).optional(),
    startDate: z.string().datetime('Date invalide'),
    checkInTime: z.string().datetime('Date invalide').optional(),
    format: z.enum(['swiss', 'league'], {
        errorMap: () => ({ message: 'Format invalide' }),
    }),
    maxPlayers: z
        .number()
        .int()
        .min(8, 'Minimum 8 joueurs')
        .max(64, 'Maximum 64 joueurs')
        .refine((val) => val % 8 === 0, {
            message: 'Le nombre de joueurs doit être un multiple de 8',
        }),
    numRounds: z.number().int().min(1).max(10),
    scoringType: z.enum(['standard', 'custom']).default('standard'),
    scoringPoints: z
        .array(z.number().int())
        .length(8, 'Vous devez spécifier exactement 8 valeurs de points')
        .optional(),
    isPublic: z.boolean().default(true),
});

export const updateTournamentSchema = createTournamentSchema.partial();

export const tournamentFilterSchema = z.object({
    status: z.enum(['draft', 'open', 'checkin', 'in_progress', 'completed', 'cancelled']).optional(),
    format: z.enum(['swiss', 'league']).optional(),
    search: z.string().optional(),
    ownerId: z.string().uuid().optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});

// ============================================
// TYPES
// ============================================

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;
export type TournamentFilter = z.infer<typeof tournamentFilterSchema>;
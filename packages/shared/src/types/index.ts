// ============================================
// COMMON TYPES
// ============================================

export type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    message?: string;
    errors?: unknown;
};

export type PaginatedResponse<T> = {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'player' | 'organizer' | 'admin';

export type User = {
    id: string;
    email: string;
    username: string;
    avatarUrl?: string;
    provider: 'google' | 'discord' | 'twitch';
    providerId: string;
    riotId?: string;
    riotPuuid?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
};

// ============================================
// TOURNAMENT TYPES
// ============================================

export type TournamentFormat = 'swiss' | 'league' | 'double_elim';

export type TournamentStatus =
    | 'draft'
    | 'open'
    | 'checkin'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

export type Tournament = {
    id: string;
    name: string;
    description?: string;
    slug: string;
    ownerId: string;
    owner?: User;
    startDate: string;
    checkInTime: string;
    endDate?: string;
    format: TournamentFormat;
    maxPlayers: number;
    lobbySize: number;
    numRounds: number;
    scoringType: 'standard' | 'custom';
    scoringPoints: number[];
    status: TournamentStatus;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    participantCount?: number;
};

// ============================================
// PARTICIPANT TYPES
// ============================================

export type ParticipantStatus = 'registered' | 'checked_in' | 'playing' | 'dropped' | 'finished';

export type TournamentParticipant = {
    id: string;
    tournamentId: string;
    userId: string;
    user?: User;
    registeredAt: string;
    checkedIn: boolean;
    checkedInAt?: string;
    status: ParticipantStatus;
    totalPoints: number;
    finalPlacement?: number;
};

// ============================================
// ROUND & LOBBY TYPES
// ============================================

export type RoundStatus = 'pending' | 'in_progress' | 'completed';

export type Round = {
    id: string;
    tournamentId: string;
    roundNumber: number;
    status: RoundStatus;
    createdAt: string;
    completedAt?: string;
    lobbies?: Lobby[];
};

export type Lobby = {
    id: string;
    roundId: string;
    lobbyLetter: string;
    players: string[]; // User IDs
    createdAt: string;
    results?: MatchResult[];
};

export type MatchResult = {
    id: string;
    lobbyId: string;
    userId: string;
    user?: User;
    placement: number;
    points: number;
    createdAt: string;
};

// ============================================
// LEADERBOARD TYPES
// ============================================

export type Standing = {
    rank: number;
    userId: string;
    user: User;
    totalPoints: number;
    placements: number[];
    bestPlacement: number;
    secondBestPlacement: number;
    delta?: number; // Position change since last round
};
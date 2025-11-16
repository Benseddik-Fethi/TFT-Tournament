# CLAUDE.md - AI Assistant Guide for TFT Arena

> **Last Updated:** 2025-11-16
> **Project Status:** Early MVP Development Phase
> **Codebase Size:** ~800 lines of TypeScript (infrastructure setup complete, feature modules pending)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Technology Stack](#technology-stack)
4. [Development Workflows](#development-workflows)
5. [Architecture Patterns](#architecture-patterns)
6. [Database Schema](#database-schema)
7. [Key Conventions](#key-conventions)
8. [Testing Strategy](#testing-strategy)
9. [Common Tasks](#common-tasks)
10. [Important Considerations](#important-considerations)
11. [Quick Reference](#quick-reference)

---

## Project Overview

### What is TFT Arena?

**TFT Arena** is a specialized web platform for organizing and managing **Teamfight Tactics (TFT) tournaments**. It aims to replace manual Excel-based tournament management with an automated, user-friendly solution.

### Core Problem Being Solved

- Tournament organizers currently spend 50-70% of their time on administrative tasks
- Excel spreadsheets are error-prone for scoring and tie-breaks
- No specialized tools exist for TFT's unique tournament formats (Swiss system with 8-player lobbies)
- Players lack centralized profiles and tournament history

### Key Features (MVP Scope)

- **OAuth Authentication** (Google, Discord, Twitch)
- **Tournament Management** (Swiss and League formats)
- **Lobby Generation** (automatic pairing via Swiss algorithm)
- **Score Tracking** (manual input with automatic calculations)
- **Check-in System** (player registration and attendance)
- **Email Notifications** (via Resend API)

### Project Goals

- Create tournament in < 5 minutes (vs 30 min with Excel)
- Achieve 80%+ tournament completion rate
- Support 500+ players within 3 months of launch
- Free, open-source, and community-driven

---

## Codebase Structure

### Monorepo Layout

```
TFT-Tournament/
├── backend/                    # Node.js/Express API server
│   ├── src/
│   │   ├── app.ts             # Express app configuration
│   │   ├── server.ts          # Server entry point & graceful shutdown
│   │   └── shared/            # Shared backend utilities
│   │       ├── database/
│   │       │   ├── client.ts          # Prisma singleton client
│   │       │   └── prisma/
│   │       │       └── schema.prisma  # Database models (6 tables)
│   │       ├── middlewares/
│   │       │   ├── error.middleware.ts      # Custom error handling
│   │       │   ├── logger.middleware.ts     # HTTP request logging
│   │       │   └── rate-limit.middleware.ts # Rate limiting
│   │       └── utils/
│   │           ├── errors.ts   # Custom error classes (8 types)
│   │           └── logger.ts   # Winston logger configuration
│   ├── package.json
│   ├── tsconfig.json           # TS config with path aliases
│   └── README.md
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── main.tsx           # Entry point with React Query setup
│   │   ├── App.tsx            # Main component with routing
│   │   ├── styles/
│   │   │   └── globals.css    # TailwindCSS + custom styles
│   │   └── utils/
│   │       └── cn.ts          # className utility
│   ├── index.html
│   ├── vite.config.ts         # Vite config with API proxy
│   ├── tailwind.config.js     # Extensive brand customization
│   ├── package.json
│   └── README.md
│
├── packages/                   # Shared monorepo packages
│   └── shared/
│       ├── src/
│       │   ├── index.ts       # Main export
│       │   ├── types/
│       │   │   └── index.ts   # TypeScript type definitions (146 lines)
│       │   └── schemas/
│       │       ├── index.ts
│       │       ├── user.schema.ts       # Zod schemas for users
│       │       └── tournament.schema.ts # Zod schemas for tournaments
│       └── package.json
│
├── doc/
│   └── CAHIER_DES_CHARGES_TFT_ARENA.md  # Full requirements (945 lines)
│
├── docker-compose.yml         # PostgreSQL 15 + Redis (commented)
├── package.json               # Root workspace configuration
├── pnpm-workspace.yaml        # pnpm workspace definition
└── README.md                  # Project overview
```

### Directory Organization Philosophy

- **Monorepo with pnpm workspaces** for code sharing
- **Feature-based modules** (planned: auth, users, tournaments, rounds)
- **Shared package** for types and validation schemas used by both frontend and backend
- **Clear separation** between business logic (modules), infrastructure (shared), and configuration

---

## Technology Stack

### Backend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 20 LTS | JavaScript runtime |
| **Framework** | Express | 4.21.1 | Web server framework |
| **Language** | TypeScript | 5.7.2 | Type safety |
| **Database** | PostgreSQL | 15 | Relational database |
| **ORM** | Prisma | 6.2.0 | Database toolkit |
| **Auth** | Passport.js | 0.7.0 | OAuth2 strategies |
| **Tokens** | jsonwebtoken | 9.0.2 | JWT generation/verification |
| **Validation** | Zod | 3.23.8 | Schema validation |
| **Logging** | Winston | 3.17.0 | Structured logging |
| **Security** | Helmet.js | 8.0.0 | HTTP security headers |
| **Rate Limit** | express-rate-limit | 7.4.1 | API rate limiting |
| **Email** | Resend | 4.0.1 | Transactional emails |
| **Jobs** | BullMQ | 5.28.2 | Background jobs (V2) |
| **Cache** | ioredis | 5.4.1 | Redis client (V2) |
| **Testing** | Jest | 29.7.0 | Unit/integration tests |

### Frontend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.3.1 | UI library |
| **Language** | TypeScript | 5.7.2 | Type safety |
| **Build Tool** | Vite | 6.0.1 | Fast build tool |
| **Styling** | TailwindCSS | 3.4.15 | Utility-first CSS |
| **Routing** | React Router | 7.0.2 | Client-side routing |
| **Server State** | TanStack Query | 5.62.7 | Data fetching & caching |
| **Client State** | Zustand | 5.0.2 | Lightweight state mgmt |
| **Forms** | React Hook Form | 7.54.0 | Form handling |
| **Validation** | Zod | 3.23.8 | Schema validation |
| **HTTP** | Axios | 1.7.9 | HTTP client |
| **UI Components** | Radix UI | Various | Headless components |
| **Animations** | Framer Motion | 11.12.0 | Animations |
| **Icons** | Lucide React | 0.468.0 | Icon library |
| **Testing** | Vitest | 2.1.5 | Fast unit testing |

### Development Tools

- **Package Manager:** pnpm 8.12.0
- **Linting:** ESLint 9.15.0
- **Formatting:** Prettier 3.4.1
- **Containerization:** Docker & Docker Compose

---

## Development Workflows

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd TFT-Tournament

# Install dependencies
pnpm install

# Start PostgreSQL
docker-compose up -d

# Setup database
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate       # Run migrations
pnpm db:seed          # (Optional) Seed data

# Start development servers
pnpm dev              # Runs both frontend & backend concurrently
```

### Common Commands

#### Root Level (affects all packages)

```bash
pnpm install                 # Install all dependencies
pnpm build                   # Build all packages (shared → backend → frontend)
pnpm dev                     # Start all dev servers
pnpm test                    # Run all tests
pnpm lint                    # Lint all packages
```

#### Backend Only

```bash
cd backend
pnpm dev                     # Start dev server (port 3000)
pnpm build                   # TypeScript compilation + tsc-alias
pnpm start                   # Start production server
pnpm test                    # Run Jest tests with coverage
pnpm lint                    # ESLint check
```

#### Frontend Only

```bash
cd frontend
pnpm dev                     # Start Vite dev server (port 5173)
pnpm build                   # TypeScript + Vite production build
pnpm preview                 # Preview production build
pnpm test                    # Run Vitest tests
pnpm test:ui                 # Run Vitest with UI
pnpm lint                    # ESLint check
```

#### Database Management

```bash
pnpm db:generate             # Generate Prisma Client (run after schema changes)
pnpm db:migrate              # Create and run migrations
pnpm db:seed                 # Seed database with test data
pnpm db:studio               # Open Prisma Studio (visual DB editor)
```

#### Docker Operations

```bash
pnpm docker:up               # Start PostgreSQL container
pnpm docker:down             # Stop containers
pnpm docker:logs             # View container logs
```

### Development Workflow

1. **Start Services:**
   ```bash
   pnpm docker:up        # Start PostgreSQL
   pnpm dev              # Start dev servers
   ```

2. **Make Changes:**
   - Edit files in `backend/src/`, `frontend/src/`, or `packages/shared/src/`
   - Hot reload is enabled for all packages

3. **Database Changes:**
   ```bash
   # Edit backend/src/shared/database/prisma/schema.prisma
   pnpm db:generate      # Generate new client
   pnpm db:migrate       # Create migration
   ```

4. **Testing:**
   ```bash
   pnpm test             # Run all tests
   pnpm test:backend     # Backend only
   pnpm test:frontend    # Frontend only
   ```

5. **Before Committing:**
   ```bash
   pnpm lint             # Check linting
   pnpm build            # Verify build works
   pnpm test             # Run tests
   ```

---

## Architecture Patterns

### Backend Patterns

#### 1. Repository Pattern (Planned)

**Purpose:** Abstract database operations from business logic

```typescript
// Example structure (to be implemented)
interface ITournamentRepository {
  findById(id: string): Promise<Tournament | null>;
  create(data: CreateTournamentDto): Promise<Tournament>;
  update(id: string, data: UpdateTournamentDto): Promise<Tournament>;
  delete(id: string): Promise<void>;
}

class TournamentRepository implements ITournamentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.tournament.findUnique({ where: { id } });
  }
  // ... other methods
}
```

#### 2. Service Layer Pattern (Planned)

**Purpose:** Contain business logic separate from HTTP handlers

```typescript
// Example structure (to be implemented)
class TournamentService {
  constructor(
    private repository: ITournamentRepository,
    private emailService: IEmailService
  ) {}

  async createTournament(ownerId: string, data: CreateTournamentDto) {
    // Business logic here
    const tournament = await this.repository.create({ ...data, ownerId });
    await this.emailService.sendTournamentCreatedEmail(tournament);
    return tournament;
  }
}
```

#### 3. Strategy Pattern (Planned)

**Purpose:** Different algorithms for tournament formats (Swiss, League, Double Elimination)

```typescript
// Example structure (to be implemented)
interface ITournamentFormat {
  generateLobbies(participants: Participant[], round: number): Lobby[];
  calculateStandings(results: MatchResult[]): Standing[];
}

class SwissFormat implements ITournamentFormat {
  generateLobbies(participants: Participant[], round: number) {
    if (round === 1) return this.randomLobbies(participants);
    return this.swissPairing(participants);
  }
}

class LeagueFormat implements ITournamentFormat {
  generateLobbies(participants: Participant[], round: number) {
    return this.roundRobinLobbies(participants, round);
  }
}
```

#### 4. Adapter Pattern (Planned)

**Purpose:** Abstract external services (Email, Cache, Riot API)

```typescript
// Example structure (to be implemented)
interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

class ResendAdapter implements IEmailService {
  async send(to: string, subject: string, body: string) {
    // Resend-specific implementation
  }
}

// Can swap to SendGrid, Mailgun, etc. without changing business logic
```

#### 5. Current Middleware Pipeline

**Implemented in `app.ts`:**

```typescript
app.use(helmet());                    // Security headers
app.use(cors());                      // CORS configuration
app.use(express.json());              // JSON body parser
app.use(loggerMiddleware);            // HTTP request logging
app.use('/api', rateLimitMiddleware); // Rate limiting
// Routes (to be added)
app.use(errorMiddleware);             // Error handling
```

### Frontend Patterns

#### 1. Atomic Design (Planned)

**Component hierarchy:**

- **Atoms:** `Button`, `Input`, `Badge`, `Avatar`
- **Molecules:** `FormField`, `SearchBar`, `UserCard`
- **Organisms:** `TournamentCard`, `Leaderboard`, `LobbyDisplay`
- **Templates:** `DashboardLayout`, `AuthLayout`
- **Pages:** `HomePage`, `TournamentPage`, `ProfilePage`

#### 2. Feature-Based Modules (Planned)

```
features/
├── auth/
│   ├── components/      # LoginForm, AuthProvider
│   ├── hooks/           # useAuth, useLogin
│   ├── services/        # authService.ts
│   └── stores/          # authStore.ts
├── tournaments/
│   ├── components/      # TournamentCard, CreateTournamentForm
│   ├── hooks/           # useTournaments, useCreateTournament
│   └── services/        # tournamentService.ts
```

#### 3. Custom Hooks Pattern (Planned)

```typescript
// Example: useTournament hook
function useTournament(id: string) {
  return useQuery({
    queryKey: ['tournament', id],
    queryFn: () => api.get(`/tournaments/${id}`),
  });
}

// Example: useCreateTournament mutation
function useCreateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentDto) => api.post('/tournaments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}
```

### Current Implementation Status

**What's Implemented:**

- ✅ Express app factory with middleware pipeline
- ✅ Prisma client singleton pattern
- ✅ Custom error classes hierarchy
- ✅ Winston structured logging
- ✅ Rate limiting middleware
- ✅ React Query setup with custom defaults
- ✅ TailwindCSS design system

**What's Pending (TODO markers in code):**

- ❌ Route handlers (auth, users, tournaments, rounds)
- ❌ Repository layer
- ❌ Service layer
- ❌ Tournament format algorithms
- ❌ Email service adapter
- ❌ Frontend components beyond basic layout
- ❌ All tests

---

## Database Schema

### Prisma Models

#### User Model

```prisma
model User {
  id           String    @id @default(uuid()) @db.Uuid
  email        String    @unique @db.VarChar(255)
  username     String    @db.VarChar(50)
  avatarUrl    String?   @map("avatar_url")
  provider     String    @db.VarChar(20)  // 'google' | 'discord' | 'twitch'
  providerId   String    @map("provider_id") @db.VarChar(255)
  riotId       String?   @map("riot_id") @db.VarChar(50)
  riotPuuid    String?   @map("riot_puuid") @db.VarChar(100)
  role         String    @default("player") @db.VarChar(20)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  lastLoginAt  DateTime? @map("last_login_at")

  // Relations
  tournaments        Tournament[]
  participations     TournamentParticipant[]
  matchResults       MatchResult[]

  @@unique([provider, providerId])
  @@index([email])
  @@index([riotId])
  @@map("users")
}
```

**Key Points:**

- **OAuth-based:** No passwords, uses provider (Google/Discord/Twitch)
- **Riot ID:** Optional manual linking (format: `PlayerName#TAG`)
- **Role:** `player` | `organizer` | `admin`

#### Tournament Model

```prisma
model Tournament {
  id           String   @id @default(uuid()) @db.Uuid
  name         String   @db.VarChar(100)
  description  String?  @db.Text
  slug         String   @unique @db.VarChar(120)
  ownerId      String   @map("owner_id") @db.Uuid
  startDate    DateTime @map("start_date")
  checkInTime  DateTime @map("check_in_time")
  format       String   @db.VarChar(20)  // 'swiss' | 'league' | 'double_elim'
  maxPlayers   Int      @map("max_players")
  lobbySize    Int      @default(8) @map("lobby_size")
  numRounds    Int      @map("num_rounds")
  scoring      Int[]    // Array of 8 integers: [8,7,6,5,4,3,2,1] by default
  status       String   @default("draft") @db.VarChar(20)
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  owner         User                    @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  participants  TournamentParticipant[]
  rounds        Round[]

  @@index([ownerId])
  @@index([status])
  @@index([startDate(sort: Desc)])
  @@map("tournaments")
}
```

**Key Points:**

- **Status flow:** `draft` → `open` → `checkin` → `in_progress` → `completed`/`cancelled`
- **Scoring:** Customizable array (default: `[8,7,6,5,4,3,2,1]`)
- **Slug:** Auto-generated URL-friendly identifier
- **Formats:** Swiss (MVP), League (MVP), Double Elimination (V2)

#### TournamentParticipant Model (Join Table)

```prisma
model TournamentParticipant {
  id             String   @id @default(uuid()) @db.Uuid
  tournamentId   String   @map("tournament_id") @db.Uuid
  userId         String   @map("user_id") @db.Uuid
  checkedIn      Boolean  @default(false) @map("checked_in")
  status         String   @default("registered") @db.VarChar(20)
  totalPoints    Int      @default(0) @map("total_points")
  finalPlacement Int?     @map("final_placement")
  registeredAt   DateTime @default(now()) @map("registered_at")

  // Relations
  tournament Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([tournamentId, userId])
  @@index([tournamentId])
  @@index([userId])
  @@map("tournament_participants")
}
```

**Key Points:**

- **Status:** `registered` → `checked_in` → `playing` → `dropped`/`finished`
- **Check-in:** Boolean flag for attendance confirmation
- **Points tracking:** Aggregated from match results

#### Round Model

```prisma
model Round {
  id           String   @id @default(uuid()) @db.Uuid
  tournamentId String   @map("tournament_id") @db.Uuid
  roundNumber  Int      @map("round_number")
  status       String   @default("pending") @db.VarChar(20)
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  tournament Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  lobbies    Lobby[]

  @@unique([tournamentId, roundNumber])
  @@index([tournamentId])
  @@map("rounds")
}
```

#### Lobby Model

```prisma
model Lobby {
  id          String   @id @default(uuid()) @db.Uuid
  roundId     String   @map("round_id") @db.Uuid
  lobbyLetter String   @map("lobby_letter") @db.VarChar(1)  // 'A', 'B', 'C', etc.
  players     String[] // Array of user IDs
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  round   Round         @relation(fields: [roundId], references: [id], onDelete: Cascade)
  results MatchResult[]

  @@unique([roundId, lobbyLetter])
  @@index([roundId])
  @@map("lobbies")
}
```

**Key Points:**

- **Lobby letters:** A, B, C, D, etc. for identification
- **Players:** Array of user UUIDs (fixed at 8 for TFT)

#### MatchResult Model

```prisma
model MatchResult {
  id        String   @id @default(uuid()) @db.Uuid
  lobbyId   String   @map("lobby_id") @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  placement Int      // 1-8
  points    Int      // Based on tournament scoring
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  lobby Lobby @relation(fields: [lobbyId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([lobbyId, userId])
  @@unique([lobbyId, placement])
  @@index([lobbyId])
  @@index([userId])
  @@map("match_results")
}
```

### Entity Relationships

```
User (1) ──────── (*) Tournament [owner]
User (1) ──────── (*) TournamentParticipant
User (1) ──────── (*) MatchResult

Tournament (1) ── (*) TournamentParticipant
Tournament (1) ── (*) Round

Round (1) ─────── (*) Lobby

Lobby (1) ─────── (*) MatchResult
```

### Key Database Operations (To Implement)

1. **User Registration:** Create User from OAuth data
2. **Tournament Creation:** Create Tournament + default rounds
3. **Player Registration:** Create TournamentParticipant entry
4. **Lobby Generation:** Create Round + Lobbies with player assignments
5. **Result Entry:** Create MatchResult entries, update participant points
6. **Leaderboard:** Aggregate query on MatchResults with tie-break logic

---

## Key Conventions

### Code Style

#### TypeScript

- **Strict mode enabled** in all `tsconfig.json` files
- **No `any` types** (warn in ESLint, should be avoided)
- **Interface naming:** No `I` prefix (use `Tournament`, not `ITournament`)
- **Type exports:** Export types from index files

#### Naming Conventions

```typescript
// Files: kebab-case
user.service.ts
tournament-participant.repository.ts

// Classes: PascalCase
class TournamentService {}
class UserRepository {}

// Functions/variables: camelCase
function createTournament() {}
const userId = '123';

// Constants: UPPER_SNAKE_CASE
const MAX_PLAYERS = 64;
const DEFAULT_SCORING = [8, 7, 6, 5, 4, 3, 2, 1];

// Types/Interfaces: PascalCase
type UserRole = 'player' | 'organizer' | 'admin';
interface Tournament {}

// Enums: PascalCase (members: PascalCase)
enum TournamentStatus {
  Draft = 'draft',
  Open = 'open',
  InProgress = 'in_progress'
}
```

#### Import Organization

```typescript
// 1. External dependencies
import express from 'express';
import { PrismaClient } from '@prisma/client';

// 2. Internal modules (absolute paths with aliases)
import { prisma } from '@/shared/database/client';
import { AppError } from '@/shared/utils/errors';

// 3. Relative imports
import { createTournamentSchema } from './tournament.schema';
```

### Path Aliases

**Backend (`tsconfig.json`):**

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/modules/*": ["./src/modules/*"],
    "@/shared/*": ["./src/shared/*"],
    "@/config/*": ["./src/config/*"]
  }
}
```

**Frontend (`tsconfig.json`):**

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/features/*": ["./src/features/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/services/*": ["./src/services/*"],
    "@/stores/*": ["./src/stores/*"],
    "@/utils/*": ["./src/utils/*"],
    "@/types/*": ["./src/types/*"]
  }
}
```

### Error Handling

**Backend:**

```typescript
// Use custom error classes from @/shared/utils/errors
import { NotFoundError, BadRequestError, UnauthorizedError } from '@/shared/utils/errors';

// In route handlers
if (!tournament) {
  throw new NotFoundError('Tournament not found');
}

if (tournament.ownerId !== userId) {
  throw new ForbiddenError('You are not the owner of this tournament');
}

// Error middleware will catch and format these automatically
```

**Available Error Classes:**

- `AppError` - Base class (use for custom errors)
- `BadRequestError` - 400
- `UnauthorizedError` - 401
- `ForbiddenError` - 403
- `NotFoundError` - 404
- `ConflictError` - 409
- `ValidationError` - 422
- `InternalServerError` - 500

### Validation

**Always validate with Zod schemas:**

```typescript
// In shared package
import { createTournamentSchema } from '@tft-tournament/shared';

// In route handler
app.post('/tournaments', async (req, res) => {
  const validated = createTournamentSchema.parse(req.body); // Throws ValidationError if invalid
  // ... proceed with validated data
});
```

### Logging

**Use Winston logger from `@/shared/utils/logger`:**

```typescript
import { logger } from '@/shared/utils/logger';

logger.info('Tournament created', { tournamentId, ownerId });
logger.error('Database error', { error: error.message, stack: error.stack });
logger.warn('Deprecated endpoint called', { endpoint: '/old-api' });
```

**Log levels:**

- `error` - Errors that need attention
- `warn` - Warning conditions
- `info` - Informational messages (default level in production)
- `debug` - Debug-level messages (development only)

### Environment Variables

**Backend `.env` structure (example):**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tftarena"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
DISCORD_CLIENT_ID="..."
DISCORD_CLIENT_SECRET="..."
TWITCH_CLIENT_ID="..."
TWITCH_CLIENT_SECRET="..."

# Email
RESEND_API_KEY="..."

# Redis (V2)
REDIS_URL="redis://localhost:6379"

# Environment
NODE_ENV="development" # or "production"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

---

## Testing Strategy

### Backend Testing (Jest)

**Test file structure:**

```
backend/src/modules/
├── auth/
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── auth.test.ts         # Tests for auth module
```

**Example test:**

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma } from '@/shared/database/client';
import { TournamentService } from './tournament.service';

describe('TournamentService', () => {
  beforeEach(async () => {
    // Setup test data
  });

  afterEach(async () => {
    // Cleanup
    await prisma.tournament.deleteMany();
  });

  it('should create a tournament', async () => {
    const service = new TournamentService();
    const tournament = await service.create({
      name: 'Test Tournament',
      format: 'swiss',
      maxPlayers: 32
    });

    expect(tournament.id).toBeDefined();
    expect(tournament.name).toBe('Test Tournament');
  });
});
```

**Run tests:**

```bash
pnpm test                    # All tests with coverage
pnpm test:watch              # Watch mode
pnpm test auth.test.ts       # Specific file
```

### Frontend Testing (Vitest + Testing Library)

**Test file structure:**

```
frontend/src/components/atoms/
├── Button.tsx
└── Button.test.tsx
```

**Example test:**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

**Run tests:**

```bash
pnpm test                    # All tests
pnpm test:ui                 # Interactive UI
pnpm test:coverage           # With coverage report
```

### Testing Best Practices

1. **Unit tests:** Test individual functions/classes in isolation
2. **Integration tests:** Test API endpoints with real database (use test DB)
3. **E2E tests (V2):** Playwright for critical user flows
4. **Coverage target:** Aim for 80%+ on business logic
5. **Mock external services:** Email, Riot API, etc.

---

## Common Tasks

### Task 1: Adding a New API Endpoint

**Example: Creating a "Get Tournament by ID" endpoint**

1. **Define types in shared package:**

```typescript
// packages/shared/src/types/index.ts
export interface Tournament {
  id: string;
  name: string;
  // ... other fields
}
```

2. **Create repository (if needed):**

```typescript
// backend/src/modules/tournaments/tournament.repository.ts
export class TournamentRepository {
  async findById(id: string) {
    return prisma.tournament.findUnique({ where: { id } });
  }
}
```

3. **Create service:**

```typescript
// backend/src/modules/tournaments/tournament.service.ts
export class TournamentService {
  constructor(private repository: TournamentRepository) {}

  async getTournamentById(id: string) {
    const tournament = await this.repository.findById(id);
    if (!tournament) {
      throw new NotFoundError('Tournament not found');
    }
    return tournament;
  }
}
```

4. **Create controller:**

```typescript
// backend/src/modules/tournaments/tournament.controller.ts
export class TournamentController {
  constructor(private service: TournamentService) {}

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const tournament = await this.service.getTournamentById(id);
    res.json({ data: tournament });
  }
}
```

5. **Create route:**

```typescript
// backend/src/modules/tournaments/tournament.routes.ts
import { Router } from 'express';
import { TournamentController } from './tournament.controller';

const router = Router();
const controller = new TournamentController(/* inject dependencies */);

router.get('/:id', async (req, res, next) => {
  try {
    await controller.getById(req, res);
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

export default router;
```

6. **Register in app.ts:**

```typescript
// backend/src/app.ts
import tournamentRoutes from '@/modules/tournaments/tournament.routes';

app.use('/api/tournaments', tournamentRoutes);
```

### Task 2: Adding Database Model

**Example: Adding a "Comment" model**

1. **Edit Prisma schema:**

```prisma
// backend/src/shared/database/prisma/schema.prisma
model Comment {
  id           String   @id @default(uuid()) @db.Uuid
  content      String   @db.Text
  tournamentId String   @map("tournament_id") @db.Uuid
  userId       String   @map("user_id") @db.Uuid
  createdAt    DateTime @default(now()) @map("created_at")

  tournament Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tournamentId])
  @@map("comments")
}

// Don't forget to add relation to Tournament model
model Tournament {
  // ... existing fields
  comments Comment[]
}
```

2. **Generate Prisma Client:**

```bash
pnpm db:generate
```

3. **Create migration:**

```bash
pnpm db:migrate
# Enter migration name: "add_comments_table"
```

4. **Add TypeScript types:**

```typescript
// packages/shared/src/types/index.ts
export interface Comment {
  id: string;
  content: string;
  tournamentId: string;
  userId: string;
  createdAt: Date;
}
```

### Task 3: Adding a React Component

**Example: TournamentCard component**

1. **Create component file:**

```tsx
// frontend/src/components/organisms/TournamentCard.tsx
import { FC } from 'react';
import { Tournament } from '@tft-tournament/shared';

interface TournamentCardProps {
  tournament: Tournament;
  onClick?: () => void;
}

export const TournamentCard: FC<TournamentCardProps> = ({ tournament, onClick }) => {
  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-brand-gold-500 transition"
      onClick={onClick}
    >
      <h3 className="text-xl font-display text-slate-50">{tournament.name}</h3>
      <p className="text-slate-400 mt-2">{tournament.description}</p>
      <div className="mt-4 flex gap-4 text-sm">
        <span className="text-brand-hextech-500">{tournament.format}</span>
        <span className="text-slate-500">{tournament.maxPlayers} players</span>
      </div>
    </div>
  );
};
```

2. **Create test:**

```tsx
// frontend/src/components/organisms/TournamentCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TournamentCard } from './TournamentCard';

describe('TournamentCard', () => {
  const mockTournament = {
    id: '1',
    name: 'Test Tournament',
    description: 'A test tournament',
    format: 'swiss',
    maxPlayers: 32
  };

  it('renders tournament name', () => {
    render(<TournamentCard tournament={mockTournament} />);
    expect(screen.getByText('Test Tournament')).toBeInTheDocument();
  });
});
```

3. **Export from index:**

```typescript
// frontend/src/components/organisms/index.ts
export { TournamentCard } from './TournamentCard';
```

### Task 4: Implementing Swiss Pairing Algorithm

**Example: Core algorithm for lobby generation**

1. **Create algorithm service:**

```typescript
// backend/src/modules/rounds/algorithms/swiss.algorithm.ts
import { Participant, Lobby } from '@tft-tournament/shared';

export class SwissAlgorithm {
  /**
   * Generate lobbies for a Swiss round
   * Round 1: Random pairing
   * Round 2+: Pair players with similar scores
   */
  generateLobbies(participants: Participant[], roundNumber: number): Lobby[] {
    if (roundNumber === 1) {
      return this.randomLobbies(participants);
    }
    return this.swissPairing(participants);
  }

  private randomLobbies(participants: Participant[]): Lobby[] {
    const shuffled = this.shuffle([...participants]);
    return this.createLobbiesFromList(shuffled);
  }

  private swissPairing(participants: Participant[]): Lobby[] {
    // Sort by total points (descending)
    const sorted = [...participants].sort((a, b) => b.totalPoints - a.totalPoints);
    return this.createLobbiesFromList(sorted);
  }

  private createLobbiesFromList(participants: Participant[]): Lobby[] {
    const lobbies: Lobby[] = [];
    const LOBBY_SIZE = 8;

    for (let i = 0; i < participants.length; i += LOBBY_SIZE) {
      const players = participants.slice(i, i + LOBBY_SIZE);
      lobbies.push({
        lobbyLetter: String.fromCharCode(65 + lobbies.length), // A, B, C, ...
        players: players.map(p => p.userId)
      });
    }

    return lobbies;
  }

  private shuffle<T>(array: T[]): T[] {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
```

2. **Use in service:**

```typescript
// backend/src/modules/rounds/round.service.ts
export class RoundService {
  async generateRound(tournamentId: string, roundNumber: number) {
    const participants = await this.getCheckedInParticipants(tournamentId);

    const algorithm = new SwissAlgorithm();
    const lobbies = algorithm.generateLobbies(participants, roundNumber);

    // Save to database
    const round = await prisma.round.create({
      data: {
        tournamentId,
        roundNumber,
        lobbies: {
          create: lobbies
        }
      }
    });

    return round;
  }
}
```

---

## Important Considerations

### Security

1. **Never commit sensitive data:**
   - ✅ Use `.env` files (gitignored)
   - ❌ Never hardcode API keys, secrets, or passwords

2. **Validate all inputs:**
   - ✅ Use Zod schemas on both frontend and backend
   - ❌ Never trust client-side validation alone

3. **Authentication:**
   - ✅ Use JWT tokens with expiration
   - ✅ Implement refresh token mechanism
   - ❌ Don't store sensitive data in JWT payload

4. **Authorization:**
   - ✅ Check user permissions before operations (e.g., only owner can edit tournament)
   - ✅ Use middleware for route protection

5. **SQL Injection:**
   - ✅ Prisma handles parameterization automatically
   - ❌ Avoid raw SQL queries unless necessary

6. **Rate Limiting:**
   - ✅ Already implemented (100 req/15min general, 5 req/15min auth)
   - Adjust as needed in `rate-limit.middleware.ts`

### Performance

1. **Database queries:**
   - Use `select` to fetch only needed fields
   - Use `include` carefully (can cause N+1 problems)
   - Add indexes for frequently queried fields (already done in schema)

2. **React Query caching:**
   - Default: 5min stale time, 10min cache time
   - Invalidate queries after mutations

3. **Frontend bundle size:**
   - Vite automatically code-splits vendors
   - Use lazy loading for routes (V2)

### Common Pitfalls

1. **Prisma Client generation:**
   - ⚠️ Always run `pnpm db:generate` after schema changes
   - ⚠️ Run in both root and backend directories if issues occur

2. **TypeScript path aliases:**
   - ⚠️ Use `tsc-alias` in build step (already configured)
   - ⚠️ Check `tsconfig.json` if imports break

3. **CORS issues:**
   - ⚠️ Update `FRONTEND_URL` in backend `.env` if frontend port changes
   - ⚠️ Check CORS configuration in `app.ts`

4. **Database migrations:**
   - ⚠️ Never edit migration files manually
   - ⚠️ Use `pnpm db:migrate` to create new migrations

5. **Shared package changes:**
   - ⚠️ Run `pnpm build:shared` before building backend/frontend
   - ⚠️ Root `pnpm build` handles this automatically

### Development Best Practices

1. **Before starting work:**
   - Pull latest from main branch
   - Run `pnpm install` to sync dependencies
   - Start Docker containers (`pnpm docker:up`)

2. **During development:**
   - Keep dev servers running (`pnpm dev`)
   - Check terminal for errors/warnings
   - Use Prisma Studio for database inspection (`pnpm db:studio`)

3. **Before committing:**
   - Run linter (`pnpm lint`)
   - Run tests (`pnpm test`)
   - Ensure build works (`pnpm build`)

4. **Commit messages:**
   - Use conventional commits format
   - Examples: `feat: add tournament creation`, `fix: resolve CORS issue`, `docs: update CLAUDE.md`

### When to Ask for Clarification

Ask the developer for clarification when:

1. **Business logic is ambiguous:**
   - "Should tournaments allow duplicate participants?"
   - "What happens if a player doesn't check in?"

2. **Design decisions needed:**
   - "Should we use optimistic updates for this mutation?"
   - "Which OAuth provider should be the default?"

3. **External service integration:**
   - "Do we need Riot API integration now or V2?"
   - "Which email template library should we use?"

4. **Performance trade-offs:**
   - "Should we cache this query?"
   - "Is pagination needed for this list?"

---

## Quick Reference

### File Locations Cheat Sheet

| What | Where |
|------|-------|
| **Prisma schema** | `backend/src/shared/database/prisma/schema.prisma` |
| **Shared types** | `packages/shared/src/types/index.ts` |
| **Zod schemas** | `packages/shared/src/schemas/*.schema.ts` |
| **Error classes** | `backend/src/shared/utils/errors.ts` |
| **Logger config** | `backend/src/shared/utils/logger.ts` |
| **Express app** | `backend/src/app.ts` |
| **Server entry** | `backend/src/server.ts` |
| **React entry** | `frontend/src/main.tsx` |
| **TailwindCSS config** | `frontend/tailwind.config.js` |
| **Vite config** | `frontend/vite.config.ts` |
| **Requirements doc** | `doc/CAHIER_DES_CHARGES_TFT_ARENA.md` |

### Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend dev | 5173 | http://localhost:5173 |
| Backend API | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | postgresql://localhost:5432/tftarena |
| Prisma Studio | 5555 | http://localhost:5555 |
| Redis (V2) | 6379 | redis://localhost:6379 |

### API Endpoints (Planned)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **Health** | | |
| GET | `/health` | Health check |
| GET | `/api` | API info |
| **Auth** | | |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/discord` | Discord OAuth login |
| POST | `/api/auth/twitch` | Twitch OAuth login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |
| **Users** | | |
| GET | `/api/users/:id` | Get user profile |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| **Tournaments** | | |
| GET | `/api/tournaments` | List tournaments (with filters) |
| POST | `/api/tournaments` | Create tournament |
| GET | `/api/tournaments/:id` | Get tournament details |
| PATCH | `/api/tournaments/:id` | Update tournament |
| DELETE | `/api/tournaments/:id` | Delete tournament |
| POST | `/api/tournaments/:id/register` | Register for tournament |
| POST | `/api/tournaments/:id/check-in` | Check in |
| **Rounds** | | |
| POST | `/api/tournaments/:id/rounds` | Generate next round |
| GET | `/api/tournaments/:id/rounds/:num` | Get round details |
| POST | `/api/rounds/:id/results` | Submit match results |
| **Leaderboard** | | |
| GET | `/api/tournaments/:id/standings` | Get current standings |

### Useful Prisma Commands

```bash
# Generate client after schema changes
pnpm db:generate

# Create a new migration
pnpm db:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI)
pnpm db:studio

# Format Prisma schema
npx prisma format
```

### Design System Quick Reference

#### Colors

```tsx
// Brand colors
<div className="text-brand-gold-500">Gold text</div>
<div className="bg-brand-hextech-500">Hextech background</div>

// Dark theme
<div className="bg-slate-950">Background</div>
<div className="bg-slate-900">Card</div>
<div className="border-slate-800">Border</div>

// Text
<div className="text-slate-50">Primary text</div>
<div className="text-slate-400">Secondary text</div>
```

#### Typography

```tsx
<h1 className="font-display">Header (Sora)</h1>
<p className="font-sans">Body text (Inter)</p>
<code className="font-mono">Code (JetBrains Mono)</code>
```

#### Animations

```tsx
// Custom animations from tailwind.config.js
<div className="animate-fade-in">Fade in</div>
<div className="animate-slide-up">Slide up</div>
<div className="animate-shimmer">Shimmer effect</div>
<div className="animate-float">Floating effect</div>
```

---

## Additional Resources

### Documentation

- **Full Requirements:** `doc/CAHIER_DES_CHARGES_TFT_ARENA.md`
- **Backend README:** `backend/README.md`
- **Frontend README:** `frontend/README.md`
- **Shared Package:** `packages/shared/README.md`

### External Documentation

- **Prisma:** https://www.prisma.io/docs
- **React Query:** https://tanstack.com/query/latest
- **TailwindCSS:** https://tailwindcss.com/docs
- **Zod:** https://zod.dev
- **Express:** https://expressjs.com
- **Passport.js:** https://www.passportjs.org

### Git Workflow

**Branch naming:**

```
feature/tournament-creation
fix/cors-issue
refactor/service-layer
docs/update-readme
```

**Commit messages (Conventional Commits):**

```
feat: add tournament creation endpoint
fix: resolve database connection timeout
refactor: extract tournament service layer
docs: update API documentation
test: add tournament service tests
chore: update dependencies
```

---

## Project Status Summary

### What's Complete ✅

- Monorepo structure with pnpm workspaces
- TypeScript configuration with path aliases
- PostgreSQL database schema (6 models)
- Prisma ORM setup
- Express server with middleware pipeline
- Security middleware (Helmet, CORS, rate limiting)
- Error handling architecture
- Winston logging system
- Shared types and Zod schemas
- React app with React Query setup
- TailwindCSS design system with brand customization
- Docker setup for PostgreSQL

### What's Pending ❌

- **All route handlers** (auth, users, tournaments, rounds)
- **Repository layer** implementation
- **Service layer** implementation
- **Tournament format algorithms** (Swiss, League)
- **Email service adapter**
- **JWT authentication flow**
- **OAuth strategies** (Google, Discord, Twitch)
- **Frontend components** (beyond basic layout)
- **Frontend pages** (tournaments, profile, etc.)
- **All tests** (0% coverage currently)
- **Database migrations** (schema exists, no migrations run yet)
- **Deployment configuration**

### Current Phase

**Phase:** Infrastructure Setup → MVP Core Development

**Next Steps:**

1. Implement authentication module (OAuth + JWT)
2. Create user management endpoints
3. Build tournament CRUD operations
4. Implement Swiss algorithm for lobby generation
5. Create frontend authentication flow
6. Build tournament creation form

---

## Final Notes for AI Assistants

### Working with This Codebase

1. **Start with requirements:** Always reference `doc/CAHIER_DES_CHARGES_TFT_ARENA.md` for business context

2. **Follow patterns:** This codebase is designed with clear architectural patterns (Repository, Service, Strategy). Follow these patterns when adding new features.

3. **Type safety first:** Use TypeScript strictly. Define types in `packages/shared/src/types/` for cross-package usage.

4. **Validate everything:** Use Zod schemas from `packages/shared/src/schemas/` for all user inputs.

5. **Test as you go:** Write tests alongside feature development (currently 0% coverage - this needs to improve).

6. **Log meaningfully:** Use the Winston logger with contextual information, not console.log.

7. **Think in features:** Organize code by feature modules (auth, tournaments, rounds), not by technical layers.

8. **Database-first:** When adding features, start with Prisma schema, then types, then implementation.

9. **Mobile-first UI:** Frontend should be responsive from the start (TailwindCSS makes this easy).

10. **Performance matters:** TFT tournaments need real-time feel. Keep queries fast, use React Query caching wisely.

### Understanding TFT Tournament Mechanics

If you're not familiar with TFT (Teamfight Tactics):

- **Lobbies:** 8 players compete in each game
- **Placements:** Each player finishes 1st-8th in their lobby
- **Points:** Based on placement (default: 1st=8pts, 2nd=7pts, ..., 8th=1pt)
- **Swiss format:** Players are paired against others with similar scores in later rounds
- **Rounds:** A tournament has multiple rounds (typically 4-6 for Swiss)
- **Tie-breaks:** When players have equal points, use: best placement → 2nd best → head-to-head

### Questions to Ask Yourself Before Coding

1. **Does this match the requirements?** Check the cahier des charges.
2. **Is this MVP or V2?** Focus on MVP scope first.
3. **What errors can occur?** Handle them gracefully with custom error classes.
4. **Does this need validation?** If user input, yes - use Zod.
5. **Should this be cached?** Consider React Query for frontend, Redis for backend (V2).
6. **Is this testable?** Write code that's easy to test (dependency injection, pure functions).
7. **Does this affect the database?** Update Prisma schema and create migration.
8. **Is this secure?** Check for SQL injection, XSS, unauthorized access.

---

**End of CLAUDE.md**

This document should be updated as the project evolves. When significant architectural decisions are made or new patterns are introduced, update this file to keep it current.

For questions or clarifications, refer to the project owner or check the detailed requirements in `doc/CAHIER_DES_CHARGES_TFT_ARENA.md`.

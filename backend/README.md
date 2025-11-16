# 🔧 TFT Arena - Backend

API REST pour la plateforme TFT Arena, construite avec Node.js, Express et TypeScript.

## 📋 Technologies

- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL 15
- **Auth:** Passport.js (OAuth2) + JWT
- **Validation:** Zod
- **Logging:** Winston
- **Testing:** Jest

## 🏗️ Architecture

```
backend/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User management
│   │   ├── tournaments/     # Tournament logic
│   │   ├── participants/    # Registration
│   │   └── rounds/          # Rounds & Lobbies
│   ├── shared/              # Shared utilities
│   │   ├── adapters/        # External services
│   │   ├── database/        # Prisma client
│   │   ├── middlewares/     # Express middlewares
│   │   └── utils/           # Helpers
│   ├── config/              # Configuration
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
└── tests/                   # Test files
```

### Design Patterns

- **Repository Pattern:** Database abstraction
- **Service Layer:** Business logic separation
- **Strategy Pattern:** Tournament formats
- **Adapter Pattern:** External services (Email, Cache, Riot API)
- **Observer Pattern:** Event system

## 🚀 Quick Start

### Installation

```bash
cd backend
pnpm install
```

### Environment Variables

```bash
cp ../.env.example ../.env
# Edit .env with your values
```

### Database Setup

```bash
# Start PostgreSQL via Docker
cd ..
docker-compose up -d postgres

# Run migrations
pnpm db:migrate

# (Optional) Seed database
pnpm db:seed
```

### Development

```bash
# Start dev server with hot reload
pnpm dev

# Server will be available at http://localhost:3000
```

## 📝 Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm lint             # Lint code
pnpm lint:fix         # Lint and fix
pnpm format           # Format with Prettier
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm db:generate      # Generate Prisma Client
```

## 🔌 API Endpoints

### Health Check

```
GET /health
```

### Authentication

```
POST   /api/auth/google        # Google OAuth
POST   /api/auth/discord       # Discord OAuth
POST   /api/auth/twitch        # Twitch OAuth
GET    /api/auth/me            # Get current user
POST   /api/auth/logout        # Logout
```

### Users

```
GET    /api/users/:id          # Get user by ID
PATCH  /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

### Tournaments

```
GET    /api/tournaments         # List tournaments
POST   /api/tournaments         # Create tournament
GET    /api/tournaments/:id     # Get tournament
PATCH  /api/tournaments/:id     # Update tournament
DELETE /api/tournaments/:id     # Delete tournament
```

_Plus d'endpoints à venir..._

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test src/modules/auth/auth.test.ts
```

## 📦 Dependencies

### Production

- `express` - Web framework
- `@prisma/client` - Database ORM
- `jsonwebtoken` - JWT tokens
- `passport` - Authentication
- `zod` - Schema validation
- `winston` - Logging
- `resend` - Email service
- `ioredis` - Redis client (V2)

### Development

- `typescript` - Type safety
- `tsx` - TypeScript execution
- `jest` - Testing framework
- `prisma` - Database toolkit
- `eslint` - Code linting
- `prettier` - Code formatting

## 🔐 Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT authentication
- Input validation with Zod
- SQL injection protection (Prisma)
- XSS protection

## 📊 Logging

Logs are stored in `logs/` directory:

- `error-YYYY-MM-DD.log` - Error logs
- `combined-YYYY-MM-DD.log` - All logs

Retention: 7 days

## 🐳 Docker

Le backend peut être dockerisé (à implémenter en V2):

```bash
docker build -t tft-arena-backend .
docker run -p 3000:3000 tft-arena-backend
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run `pnpm lint` and `pnpm test`
5. Create a Pull Request

## 📄 License

MIT

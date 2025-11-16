# 🎨 TFT Arena - Frontend

Interface utilisateur moderne pour TFT Arena, construite avec React, TypeScript et TailwindCSS.

## 📋 Technologies

- **Framework:** React 18.2
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand + React Query
- **Forms:** React Hook Form + Zod
- **Routing:** React Router
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **UI Components:** Radix UI

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/          # UI Components (Atomic Design)
│   │   ├── atoms/          # Basic building blocks
│   │   ├── molecules/      # Simple combinations
│   │   ├── organisms/      # Complex components
│   │   └── templates/      # Page layouts
│   ├── pages/              # Route pages
│   ├── features/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── tournaments/   # Tournament features
│   │   └── participants/  # Registration features
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── stores/             # Zustand stores
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript types
└── public/                 # Static assets
```

### Design Patterns

- **Atomic Design:** Component organization
- **Compound Components:** Complex UI patterns
- **Custom Hooks:** Logic reusability
- **Feature-based:** Module organization

## 🚀 Quick Start

### Installation

```bash
cd frontend
pnpm install
```

### Development

```bash
# Start dev server
pnpm dev

# Frontend will be available at http://localhost:5173
```

## 📝 Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
pnpm lint             # Lint code
pnpm lint:fix         # Lint and fix
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript type checking
pnpm storybook        # Start Storybook (V2)
```

## 🎨 Design System

### Colors

**Brand Colors:**
- Gold: `brand-gold-500` (#C89B3C) - Primary gold
- Hextech: `brand-hextech-500` (#0AC8B9) - Primary cyan

**Dark Theme:**
- Background: `slate-950` (#010A13)
- Card: `slate-900`
- Border: `slate-800`
- Text: `slate-50`, `slate-400`

### Typography

- **Sans:** Inter (body text)
- **Display:** Sora (headers)
- **Mono:** JetBrains Mono (code/scores)

### Components

Components follow Atomic Design principles:

- **Atoms:** Button, Input, Badge, Avatar
- **Molecules:** FormField, SearchBar, UserCard
- **Organisms:** TournamentCard, Leaderboard, LobbyDisplay
- **Templates:** DashboardLayout, AuthLayout

Example Button usage:

```tsx
import { Button } from '@/components/atoms/Button';

<Button variant="primary" size="md">
  Click me
</Button>
```

## 🔌 API Integration

API calls use Axios + React Query:

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api/client';

function useTournaments() {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: () => api.get('/tournaments'),
  });
}
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Run with coverage
pnpm test:coverage
```

## 📦 Dependencies

### Production

- `react` - UI library
- `react-router-dom` - Routing
- `@tanstack/react-query` - Server state
- `zustand` - Client state
- `react-hook-form` - Form handling
- `zod` - Validation
- `axios` - HTTP client
- `tailwindcss` - Styling
- `framer-motion` - Animations
- `lucide-react` - Icons

### Development

- `vite` - Build tool
- `typescript` - Type safety
- `vitest` - Testing framework
- `eslint` - Code linting
- `prettier` - Code formatting

## 🎯 Code Style

- Use TypeScript strict mode
- Follow Airbnb style guide
- Use functional components
- Prefer composition over inheritance
- Use custom hooks for logic reuse

## 🚀 Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

Build output will be in `dist/` directory.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run `pnpm lint` and `pnpm type-check`
5. Create a Pull Request

## 📄 License

MIT

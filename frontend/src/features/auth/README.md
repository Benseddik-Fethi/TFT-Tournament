# Frontend Authentication Module

This module handles user authentication on the frontend with OAuth 2.0 and JWT tokens.

## Features

- **OAuth Login** with Google, Discord, and Twitch
- **JWT Token Management** (automatic refresh)
- **Protected Routes** with role-based access
- **Persistent Authentication** (localStorage)
- **Zustand State Management**
- **React Query** for server state

## Architecture

```
features/auth/
├── AuthProvider.tsx          # Auth context wrapper
└── README.md                 # This file

stores/
└── authStore.ts              # Zustand auth store

services/api/
├── client.ts                 # Axios instance with interceptors
└── auth.service.ts           # Auth API calls

hooks/
└── useAuth.ts                # Auth hooks (useAuth, useLogout, etc.)

pages/
├── LoginPage.tsx             # OAuth login page
└── AuthCallbackPage.tsx      # OAuth callback handler

components/
└── ProtectedRoute.tsx        # Route protection wrapper
```

## Quick Start

### 1. Wrap your app with AuthProvider

Already done in `App.tsx`:

```tsx
import { AuthProvider } from '@/features/auth/AuthProvider';

<AuthProvider>
  <App />
</AuthProvider>
```

### 2. Use authentication in components

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <div>Welcome {user?.username}!</div>;
  }

  return <div>Please login</div>;
}
```

### 3. Protect routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  }
/>

// With role check
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

## Authentication Flow

### Login Flow

```
1. User clicks "Login with Google/Discord/Twitch"
   ↓
2. Redirect to backend OAuth endpoint
   ↓
3. OAuth provider authentication
   ↓
4. Backend callback receives auth code
   ↓
5. Backend creates/updates user, generates JWT
   ↓
6. Redirect to /auth/callback?accessToken=...&refreshToken=...
   ↓
7. AuthCallbackPage extracts tokens
   ↓
8. Fetch user data from /api/auth/me
   ↓
9. Store in Zustand + localStorage
   ↓
10. Redirect to home
```

### Token Refresh Flow

```
1. API request with expired token
   ↓
2. Axios interceptor catches 401
   ↓
3. Call /api/auth/refresh with refreshToken
   ↓
4. Get new tokens
   ↓
5. Update Zustand store
   ↓
6. Retry original request
```

## Available Hooks

### useAuth()

Get current authentication state:

```tsx
const { isAuthenticated, user, isLoading } = useAuth();
```

### useCurrentUser()

Fetch current user from API (React Query):

```tsx
const { data: user, isLoading, error } = useCurrentUser();
```

### useLogout()

Logout mutation:

```tsx
const { mutate: logout, isPending } = useLogout();

<button onClick={() => logout()}>
  {isPending ? 'Logging out...' : 'Logout'}
</button>
```

### useDeleteAccount()

Delete account mutation:

```tsx
const { mutate: deleteAccount } = useDeleteAccount();

<button onClick={() => deleteAccount()}>
  Delete My Account
</button>
```

### useOAuthLogin()

Redirect to OAuth provider:

```tsx
const { login } = useOAuthLogin();

<button onClick={() => login('google')}>
  Login with Google
</button>
```

## Zustand Store

The auth store manages global authentication state:

```tsx
interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}
```

**Persistence:** State is saved to localStorage with key `auth-storage`

## API Client

Axios instance with automatic token injection:

```tsx
import apiClient from '@/services/api/client';

// Token automatically added to Authorization header
const response = await apiClient.get('/tournaments');
```

**Interceptors:**
- **Request:** Add JWT token to headers
- **Response:** Handle 401 errors and refresh token

## Pages

### LoginPage

OAuth login buttons for Google, Discord, and Twitch.

**Route:** `/login`

**Features:**
- Beautiful branded UI
- OAuth provider buttons
- Auto-redirect if already authenticated

### AuthCallbackPage

Handles OAuth redirect from backend.

**Route:** `/auth/callback`

**Parameters:**
- `?accessToken=...` - JWT access token
- `?refreshToken=...` - JWT refresh token

**Flow:**
1. Extract tokens from URL
2. Fetch user data
3. Store in state
4. Redirect to home or previous page

## Components

### ProtectedRoute

Wrapper for protected routes:

```tsx
<ProtectedRoute requiredRole="organizer">
  <CreateTournamentPage />
</ProtectedRoute>
```

**Features:**
- Redirects to `/login` if not authenticated
- Shows loading spinner while checking auth
- Role-based access control
- Access denied page for insufficient permissions

## Environment Variables

Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:3000/api
```

**Production:**
```bash
VITE_API_URL=https://api.tftarena.gg/api
```

## Testing

### Manual Testing

1. Start backend: `pnpm dev` (in backend directory)
2. Configure OAuth apps (Google, Discord, Twitch)
3. Start frontend: `pnpm dev` (in frontend directory)
4. Visit http://localhost:5173/login
5. Click OAuth provider button
6. Complete OAuth flow
7. Check if user is logged in

### Check Authentication State

Open React Query DevTools to see cached queries.

Open browser DevTools > Application > Local Storage:
- Key: `auth-storage`
- Value: JSON with user and tokens

## Troubleshooting

### "Network Error" on login

- Check backend is running on port 3000
- Check CORS configuration in backend
- Verify `VITE_API_URL` in frontend `.env`

### Tokens not persisting

- Check localStorage in browser DevTools
- Clear localStorage and try again
- Check Zustand persist configuration

### "Unauthorized" after refresh

- Tokens may be expired
- Clear localStorage
- Login again

### OAuth redirect not working

- Check OAuth app redirect URLs match backend config
- Backend callback URL: `http://localhost:3000/api/auth/{provider}/callback`
- Frontend callback URL: `http://localhost:5173/auth/callback`

## Security Considerations

### Token Storage

- Tokens stored in localStorage (acceptable for MVP)
- Consider httpOnly cookies for production (requires backend changes)

### XSS Protection

- React escapes user input by default
- Never use `dangerouslySetInnerHTML` with user content

### Token Expiration

- Access tokens: 7 days
- Refresh tokens: 30 days
- Automatic refresh on 401 errors

## Related Files

- **Backend Auth:** `/backend/src/modules/auth/`
- **Backend README:** `/backend/src/modules/auth/README.md`
- **Shared Types:** `/packages/shared/src/types/index.ts`

## Next Steps

- [ ] Add email/password authentication (optional)
- [ ] Add "Remember me" functionality
- [ ] Add user profile editing
- [ ] Add Riot ID linking form
- [ ] Add 2FA (V2)

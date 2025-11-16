# Authentication Module

This module handles user authentication using OAuth 2.0 (Google, Discord, Twitch) and JWT tokens.

## Features

- **OAuth 2.0 Authentication** with multiple providers:
  - Google
  - Discord
  - Twitch
- **JWT Token Management** (Access + Refresh tokens)
- **Protected Routes** with authentication middleware
- **Role-based Authorization** (player, organizer, admin)
- **Automatic User Creation** on first OAuth login

## Architecture

```
auth/
├── auth.service.ts       # Business logic
├── auth.controller.ts    # HTTP handlers
├── auth.routes.ts        # Route definitions
└── README.md            # This file
```

## Authentication Flow

### 1. OAuth Login Flow

```
1. Frontend → GET /api/auth/google
2. Redirect to Google OAuth
3. User authorizes
4. Google → Callback /api/auth/google/callback
5. Create/Update user in database
6. Generate JWT tokens
7. Redirect to frontend with tokens
```

### 2. Token Usage

```typescript
// Include token in Authorization header
headers: {
  'Authorization': 'Bearer <access_token>'
}
```

### 3. Token Refresh

```typescript
POST /api/auth/refresh
Body: { refreshToken: "..." }
Response: { accessToken: "...", refreshToken: "..." }
```

## API Endpoints

### OAuth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/discord` | Initiate Discord OAuth |
| GET | `/api/auth/discord/callback` | Discord OAuth callback |
| GET | `/api/auth/twitch` | Initiate Twitch OAuth |
| GET | `/api/auth/twitch/callback` | Twitch OAuth callback |

### JWT Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/auth/me` | ✅ Yes | Get current user |
| POST | `/api/auth/refresh` | ❌ No | Refresh access token |
| POST | `/api/auth/logout` | ✅ Yes | Logout user |
| DELETE | `/api/auth/account` | ✅ Yes | Delete account |

## Middleware Usage

### Protect a Route

```typescript
import { authRequired } from '@/shared/middlewares/auth.middleware';

router.get('/protected', authRequired, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### Optional Authentication

```typescript
import { authOptional } from '@/shared/middlewares/auth.middleware';

router.get('/public', authOptional, (req, res) => {
  // req.user may or may not be defined
  if (req.user) {
    res.json({ message: `Hello ${req.user.username}` });
  } else {
    res.json({ message: 'Hello guest' });
  }
});
```

### Role-Based Authorization

```typescript
import { requireRole, requireOrganizer, requireAdmin } from '@/shared/middlewares/auth.middleware';

// Only organizers and admins
router.post('/tournaments', authRequired, requireOrganizer, createTournament);

// Only admins
router.delete('/users/:id', authRequired, requireAdmin, deleteUser);

// Custom roles
router.get('/special', authRequired, requireRole('special', 'admin'), handler);
```

### Ownership Verification

```typescript
import { requireOwnership } from '@/shared/middlewares/auth.middleware';

// Check if user owns the tournament (ownerId field)
router.patch(
  '/tournaments/:id',
  authRequired,
  requireOwnership('ownerId'),
  updateTournament
);
```

## Environment Variables

```bash
# JWT Configuration
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="30d"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Discord OAuth
DISCORD_CLIENT_ID="..."
DISCORD_CLIENT_SECRET="..."
DISCORD_CALLBACK_URL="http://localhost:3000/api/auth/discord/callback"

# Twitch OAuth
TWITCH_CLIENT_ID="..."
TWITCH_CLIENT_SECRET="..."
TWITCH_CALLBACK_URL="http://localhost:3000/api/auth/twitch/callback"

# Frontend URL for redirects
FRONTEND_URL="http://localhost:5173"
```

## Setup OAuth Providers

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 section
4. Add redirect URI: `http://localhost:3000/api/auth/discord/callback`
5. Copy Client ID and Client Secret to `.env`

### Twitch OAuth

1. Go to [Twitch Dev Console](https://dev.twitch.tv/console)
2. Register a new application
3. Add OAuth Redirect URL: `http://localhost:3000/api/auth/twitch/callback`
4. Copy Client ID and Client Secret to `.env`

## Frontend Integration

### OAuth Login Button

```typescript
// Redirect to OAuth provider
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:3000/api/auth/google';
};
```

### Handle OAuth Callback

```typescript
// In /auth/callback route
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('accessToken');
  const refreshToken = params.get('refreshToken');

  if (accessToken && refreshToken) {
    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Redirect to home
    navigate('/');
  }
}, []);
```

### API Requests with Token

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Retry original request
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(error.config);
      } catch {
        // Refresh failed, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## Security Considerations

### Token Storage

- **DO NOT** store tokens in cookies without `httpOnly` flag
- **Recommended:** Use `localStorage` for web apps
- **More Secure:** Use `httpOnly` cookies (requires CORS setup)

### Token Expiration

- Access tokens expire after 7 days (configurable)
- Refresh tokens expire after 30 days (configurable)
- Always implement token refresh logic in frontend

### Rate Limiting

- Auth endpoints have stricter rate limits (5 req/15min)
- General API: 100 req/15min

### CORS

- Configure allowed origins in production
- Enable credentials: `credentials: true`

## Testing

### Manual Testing with cURL

```bash
# 1. Get access token (use OAuth flow in browser)

# 2. Get current user
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/auth/me

# 3. Refresh token
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}' \
  http://localhost:3000/api/auth/refresh

# 4. Logout
curl -X POST \
  -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/auth/logout
```

### Testing with Postman

1. **OAuth Login:**
   - Open `http://localhost:3000/api/auth/google` in browser
   - Complete OAuth flow
   - Copy tokens from redirect URL

2. **Protected Requests:**
   - Add header: `Authorization: Bearer <token>`
   - Send request to protected endpoints

## Troubleshooting

### "No authentication token provided"

- Check Authorization header format: `Bearer <token>`
- Verify token is not expired
- Check CORS configuration

### "OAuth authentication failed"

- Verify OAuth credentials in `.env`
- Check redirect URLs match OAuth app settings
- Ensure frontend URL is correct

### "User not found"

- Token may be for deleted user
- Clear tokens and login again

## Related Files

- **Config:** `/backend/src/config/auth.config.ts`
- **Passport:** `/backend/src/shared/auth/passport.config.ts`
- **JWT Utils:** `/backend/src/shared/utils/jwt.util.ts`
- **Middleware:** `/backend/src/shared/middlewares/auth.middleware.ts`

## Future Enhancements (V2)

- [ ] Email/password authentication
- [ ] Two-factor authentication (2FA)
- [ ] Token blacklist with Redis
- [ ] Rate limiting per user
- [ ] OAuth token storage for API calls
- [ ] Social account linking (multiple providers per user)

# Testing Authentication - Quick Guide

## ✅ Pre-Test Checklist

### 1. Verify Environment Variables

Check `/backend/.env` contains:

```bash
# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Discord OAuth (OPTIONAL for now)
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_CALLBACK_URL=http://localhost:3000/api/auth/discord/callback

# Twitch OAuth (OPTIONAL for now)
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
TWITCH_CALLBACK_URL=http://localhost:3000/api/auth/twitch/callback

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tftarena
```

### 2. Google OAuth Setup

Verify in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

**Authorized redirect URIs:**
- ✅ `http://localhost:3000/api/auth/google/callback`

**Remove these (not needed):**
- ❌ `http://localhost:3000`
- ❌ `http://localhost:5173/auth/callback`
- ❌ Any other URLs

**Why?** Only the backend callback URL is needed. Frontend redirect happens server-side.

### 3. Start Services

```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd backend
pnpm dev

# Terminal 3: Frontend
cd frontend
pnpm dev
```

## 🧪 Test 1: Backend OAuth Configuration

### Expected Logs

When backend starts, you should see:

```
🔐 OAuth Configuration Status:
  Google Client ID: ✅ Set
  Google Client Secret: ✅ Set
  Discord Client ID: ❌ Missing
  Discord Client Secret: ❌ Missing
  Twitch Client ID: ❌ Missing
  Twitch Client Secret: ❌ Missing

🔐 Initializing Passport strategies...
  ✅ Google strategy registered
  ⚠️  Discord OAuth not configured (skipped)
  ⚠️  Twitch OAuth not configured (skipped)
✅ Passport strategies initialized

✅ Express app configured successfully
🚀 Server running on http://localhost:3000
```

### ✅ Success Criteria

- [ ] Google Client ID and Secret show ✅ Set
- [ ] "Google strategy registered" appears
- [ ] Server starts without errors
- [ ] NO "Unknown authentication strategy" error

### ❌ If You See Errors

**Error:** `Google Client ID: ❌ Missing`
- **Fix:** Check `.env` file is in `/backend/` directory
- **Fix:** Restart backend server after editing `.env`

**Error:** `Unknown authentication strategy "google"`
- **Fix:** This should NOT happen with lazy loading
- **Debug:** Check `app.ts` calls `initializePassportStrategies()` before routes

## 🧪 Test 2: Frontend Access

### Steps

1. Open http://localhost:5173
2. Should see TFT Arena homepage
3. Header should show "Connexion" button

### ✅ Success Criteria

- [ ] Page loads without errors
- [ ] No console errors in browser DevTools
- [ ] "Connexion" button visible in header

## 🧪 Test 3: Login Page

### Steps

1. Click "Connexion" or go to http://localhost:5173/login
2. Should see three OAuth buttons

### ✅ Success Criteria

- [ ] Page shows "TFT Arena" title
- [ ] Three buttons visible:
  - Google (white background, Google logo)
  - Discord (blue #5865F2 background)
  - Twitch (purple #9146FF background)
- [ ] No console errors

## 🧪 Test 4: Google OAuth Flow

### Steps

1. Click "Connexion avec Google"
2. Browser redirects to `http://localhost:3000/api/auth/google`
3. Backend redirects to Google consent screen
4. Select Google account and authorize
5. Google redirects back to backend
6. Backend redirects to frontend with tokens

### Expected URL Changes

```
1. http://localhost:5173/login
   ↓ (click button)
2. http://localhost:3000/api/auth/google
   ↓ (redirect)
3. https://accounts.google.com/o/oauth2/v2/auth?...
   ↓ (authorize)
4. http://localhost:3000/api/auth/google/callback?code=...
   ↓ (backend processes)
5. http://localhost:5173/auth/callback?accessToken=...&refreshToken=...
   ↓ (frontend processes)
6. http://localhost:5173/
```

### ✅ Success Criteria

- [ ] No "Unknown authentication strategy" error
- [ ] Google consent screen appears
- [ ] After authorization, redirects to frontend
- [ ] URL contains `accessToken` and `refreshToken` parameters
- [ ] Automatically redirects to homepage
- [ ] Header shows username and avatar
- [ ] "Connexion" button replaced with user menu

### ❌ Common Errors

**Error:** "redirect_uri_mismatch"
- **Cause:** Callback URL mismatch
- **Fix:** Google Console must have exactly: `http://localhost:3000/api/auth/google/callback`
- **Check:** `.env` has same URL: `GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback`

**Error:** Page shows "Internal Server Error"
- **Check:** Backend logs for error details
- **Common:** Database connection issue or Prisma error
- **Fix:** Ensure PostgreSQL is running (`docker ps`)

**Error:** Stuck at `/auth/callback` with tokens in URL
- **Check:** Browser console for errors
- **Common:** API client can't reach `/api/auth/me` endpoint
- **Fix:** Check CORS configuration, verify backend is running

## 🧪 Test 5: Authenticated State

### Steps

After successful login:

1. Check header shows your username
2. Check avatar appears (from Google profile)
3. Click on username to go to profile page
4. Should show user details

### ✅ Success Criteria

- [ ] Header displays username and avatar
- [ ] Profile page accessible at `/profile`
- [ ] Profile shows:
  - Avatar
  - Username
  - Email
  - Provider (Google)
  - Role (player)
  - Riot ID (Non configuré)

### Check localStorage

Open DevTools > Application > Local Storage > http://localhost:5173

Should see key: `auth-storage`

Value should be JSON:
```json
{
  "state": {
    "user": {
      "id": "uuid",
      "email": "your@email.com",
      "username": "Your Name",
      "avatarUrl": "https://...",
      "provider": "google",
      "role": "player"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "isAuthenticated": true,
    "isLoading": false
  },
  "version": 0
}
```

## 🧪 Test 6: Protected Routes

### Steps

1. While logged in, visit http://localhost:5173/profile ✅ Should work
2. Click "Déconnexion" button
3. Try to visit http://localhost:5173/profile ❌ Should redirect to login

### ✅ Success Criteria

- [ ] Logged in: Can access `/profile`
- [ ] Logged out: Redirected to `/login`
- [ ] After logout, header shows "Connexion" button again

## 🧪 Test 7: Logout

### Steps

1. Click "Déconnexion" in header
2. Should redirect to homepage
3. Header should show "Connexion" button

### ✅ Success Criteria

- [ ] User logged out successfully
- [ ] Redirected to `/`
- [ ] localStorage `auth-storage` cleared or updated
- [ ] Header shows "Connexion" button

### Check Network Tab

Should see API call:
```
POST http://localhost:3000/api/auth/logout
Status: 200 OK
Response: { "success": true, "message": "Logged out successfully" }
```

## 🧪 Test 8: Token Refresh (Advanced)

This happens automatically when access token expires.

### Manual Test

1. Login successfully
2. Open DevTools > Application > Local Storage
3. Find `auth-storage` key
4. Modify `state.tokens.accessToken` to invalid value (e.g., `"invalid"`)
5. Make an API call (e.g., reload profile page)
6. Should auto-refresh token and retry request

### ✅ Success Criteria

- [ ] Invalid token triggers refresh
- [ ] New tokens fetched from `/api/auth/refresh`
- [ ] Original request retries with new token
- [ ] Page loads successfully

### Check Network Tab

Should see:
```
1. GET /api/auth/me (401 Unauthorized)
2. POST /api/auth/refresh (200 OK)
3. GET /api/auth/me (200 OK) ← Retry
```

## 🧪 Test 9: Database Verification

### Check User Created

```bash
cd backend
pnpm db:studio
```

Open http://localhost:5555

Navigate to `User` table, should see your account:

- ✅ Email from Google
- ✅ Username from Google
- ✅ Avatar URL
- ✅ Provider: `google`
- ✅ Role: `player`
- ✅ `lastLoginAt` updated to recent time

## 🎉 Full Test Completion Checklist

### Backend

- [ ] Backend starts without errors
- [ ] OAuth config logs show ✅ for Google
- [ ] "Google strategy registered" appears
- [ ] No "Unknown authentication strategy" error

### Frontend

- [ ] Homepage loads correctly
- [ ] Login page shows OAuth buttons
- [ ] No console errors

### OAuth Flow

- [ ] Google OAuth redirects work
- [ ] Tokens received in callback URL
- [ ] User data fetched successfully
- [ ] Redirected to homepage after login

### Authentication State

- [ ] Header shows username and avatar when logged in
- [ ] Profile page accessible and displays user data
- [ ] localStorage contains auth data
- [ ] Protected routes work (redirect when logged out)

### Logout

- [ ] Logout button works
- [ ] User data cleared
- [ ] Redirected to homepage

### Database

- [ ] User created in PostgreSQL
- [ ] User data correct (email, username, avatar, provider)

## 🐛 Debugging Tips

### Backend Not Starting

```bash
# Check PostgreSQL is running
docker ps

# Check DATABASE_URL is correct
cat backend/.env | grep DATABASE_URL

# Check migrations are applied
cd backend
pnpm db:migrate
```

### Frontend Build Errors

```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules
cd frontend
pnpm install
```

### CORS Errors

Check `backend/src/app.ts`:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
```

Backend `.env`:
```bash
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### OAuth Callback Not Working

1. **Check redirect URI in Google Console** matches exactly:
   ```
   http://localhost:3000/api/auth/google/callback
   ```

2. **Check backend .env:**
   ```bash
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```

3. **Check backend logs** for detailed error messages

### Token Issues

```bash
# Verify JWT secret is set and at least 32 characters
cat backend/.env | grep JWT_SECRET
```

Clear browser localStorage and login again:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

## 📊 Expected Success Rate

After fixing the lazy loading issue:

- ✅ **Backend startup:** Should work 100%
- ✅ **Google OAuth registration:** Should work 100%
- ✅ **Frontend loading:** Should work 100%
- ⚠️ **OAuth flow:** Depends on correct Google Cloud setup
- ✅ **Token management:** Should work 100%
- ✅ **Protected routes:** Should work 100%

## 🎯 Next Steps After Testing

If all tests pass:

1. ✅ Authentication system is fully functional
2. Configure Discord OAuth (optional)
3. Configure Twitch OAuth (optional)
4. Start implementing tournament features
5. Add unit tests for auth module

If tests fail:

1. Check this troubleshooting guide
2. Review backend logs for errors
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Ensure lazy loading fix is applied (check `app.ts`)

---

**Good luck! 🚀**

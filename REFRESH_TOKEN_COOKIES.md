# Refresh Token with Secure HttpOnly Cookies

## Overview
This implementation stores refresh tokens in secure HttpOnly cookies instead of localStorage for enhanced security.

## Security Features
- **HttpOnly**: Prevents JavaScript access to refresh tokens (XSS protection)
- **Secure**: Only sent over HTTPS connections
- **SameSite=strict**: Prevents CSRF attacks
- **30-day expiration**: Reasonable token lifetime
- **Automatic rotation**: New refresh token issued on each refresh

## Implementation Details

### Client Side (`packages/api/src/client.ts`)
- Access tokens remain in localStorage for API calls
- Refresh tokens stored in secure cookies (client-side fallback for non-HTTPS)
- Automatic token refresh on 401 responses
- `withCredentials: true` for cookie inclusion

### Server Side (`apps/server/src/controllers/authController.ts`)
- Refresh tokens set in HttpOnly cookies during login
- `/auth/refresh` endpoint validates cookie and issues new tokens
- Cookie cleared on logout/global logout
- Token version checking for logout invalidation

## API Endpoints

### POST `/auth/login`
- Returns: `{ accessToken }`
- Sets: `tags_refresh_token` cookie (HttpOnly, Secure, SameSite=strict)

### POST `/auth/refresh`
- Reads: `tags_refresh_token` cookie
- Returns: `{ accessToken }`
- Updates: `tags_refresh_token` cookie with new token

### POST `/auth/logout`
- Clears: `tags_refresh_token` cookie

### POST `/auth/logout/global`
- Increments user's `tokenVersion` (invalidates all tokens)
- Clears: `tags_refresh_token` cookie

## Configuration

### Environment Variables
```bash
# Required for HTTPS
SSL_ENABLED=true
NODE_ENV=production

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Cookie Settings
- **Name**: `tags_refresh_token`
- **HttpOnly**: `true` (server-side only)
- **Secure**: `true` (HTTPS only)
- **SameSite**: `strict`
- **MaxAge**: `30 days`
- **Path**: `/`

## Testing

### Manual Tests
1. **Login**: Verify cookie is set with correct flags
2. **API Calls**: Ensure automatic token refresh works
3. **Logout**: Verify cookie is cleared
4. **Global Logout**: Verify all sessions invalidated

### Browser DevTools
- Check Application > Cookies for `tags_refresh_token`
- Verify cookie flags: HttpOnly, Secure, SameSite
- Test token refresh in Network tab

## Security Benefits
1. **XSS Protection**: JavaScript cannot access refresh tokens
2. **CSRF Protection**: SameSite=strict prevents cross-site requests
3. **Secure Transport**: Secure flag ensures HTTPS-only transmission
4. **Token Rotation**: New refresh token on each use limits exposure
5. **Logout Invalidation**: Token version prevents reuse after logout

## Migration Notes
- Existing localStorage refresh tokens will be ignored
- New login required to get cookie-based refresh tokens
- Client-side cookie fallback for development (non-HTTPS)

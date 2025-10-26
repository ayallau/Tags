# סיכום תצורת הפרויקט - Configuration Summary

תאריך עדכון: 2024

---

## 1. איחוד מדיניות קונפיגורציה + config.ts

### Server Configuration (`apps/server/src/config.ts`)

הקונפיגורציה של השרת נבנית מתוך משתני סביבה ונשענת על:
- **Single Source of Truth**: רק `SSL_ENABLED` קובע את הפרוטוקול
- **Backwards Compatibility**: תומך ב-`SERVER_PROTOCOL` המזוהה כמיושן
- **Port Management**: פורטים קבועים בקוד:
  - `PORT_HTTP`: 3001 (constant)
  - `PORT_HTTPS`: 3443 (constant)
  - `PORT`: מחושב לפי פרוטוקול
- **Client URLs**: מתאימים אוטומטית לפרוטוקול
  - HTTP: `http://localhost:5173`
  - HTTPS: `https://localhost:5174`
- **Non-Secret Config**: `BCRYPT_ROUNDS` עם ברירת מחדל + אפשרות override

**מבנה הערכים העיקריים:**
```typescript
interface AppConfig {
  // Secrets (from .env only)
  MONGO_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  PASSWORD_PEPPER: string;
  COOKIE_KEY: string;
  
  // Configuration (constants or computed)
  PORT_HTTP: 3001; // Constant
  PORT_HTTPS: 3443; // Constant
  PORT: number; // Computed based on protocol
  BCRYPT_ROUNDS: 12; // Default, can override via env
  CLIENT_ORIGIN: string; // Computed based on protocol
  CLIENT_URL: string; // Computed based on protocol
  
  // SSL
  SSL_ENABLED: boolean; // From env (single source of truth)
  PROTOCOL: 'http' | 'https'; // Computed
}
```

### Web Configuration (`apps/web/src/config.ts`)

הקונפיגורציה של האפליקציה מספקת:
- **Environment Detection**: משתמש ב-`import.meta.env` של Vite
- **Typed Interface**: WebConfig עם ערכי ברירת מחדל
- **Helper Functions**: 
  - `getApiUrl()` - בונה URL מלא לפי פרוטוקול
  - `getApiEndpoint(path)` - בונה endpoint ספציפי
  - `isDevelopment()`, `isProduction()`, `getEnvironment()`
  - `validateConfig()` - אימות ערכים קריטיים

**מבנה הערכים העיקריים:**
```typescript
interface WebConfig {
  https: boolean;
  apiBaseUrl: string;
  apiTimeout: number;
  appName: string;
  appVersion: string;
  enableSocialLogin: boolean;
  googleClientId: string;
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
```

### Best Practices
1. Single Source of Truth - `SSL_ENABLED` בלבד קובע פרוטוקול
2. כל הערכים נגועים מבחינה בטיחותית
3. ערכי ברירת מחדל בטוחים (BCRYPT_ROUNDS=12)
4. אימות אוטומטי בטעינת הקונפיגורציה
5. סינרוניזציה בין Server ל-Web על פרוטוקול ו-port
6. פורטים קבועים בקוד (3001/3443) - לא בסודות

---

## 2. env.example (Server + Web) והטמעת מדיניות סודות

### Server .env.example (`apps/server/env.example`)

**מבנה משתני הסביבה:**
```env
# SSL Configuration
# Set to 'true' for HTTPS mode, 'false' or omit for HTTP mode
SSL_ENABLED=false

# Database
MONGO_URI='your-mongo-uri'

# OAuth
GOOGLE_CLIENT_ID='your-google-client-id'
GOOGLE_CLIENT_SECRET='your-google-client-secret'

# JWT Secrets
JWT_ACCESS_SECRET='your-jwt-access-secret'
JWT_REFRESH_SECRET='your-jwt-refresh-secret'

# Password Security
PASSWORD_PEPPER='your-password-pepper'

# Cookie Security
COOKIE_KEY='your-cookie-key'

# Optional: Override BCRYPT_ROUNDS (default: 12)
# BCRYPT_ROUNDS=12
```

**מדיניות סודות:**
- **רק SSL_ENABLED**: Single Source of Truth לפרוטוקול
- **תמיכה ב-SERVER_PROTOCOL**: מיושן, אך נתמך לcompatibility
- **BCRYPT_ROUNDS**: עם ברירת מחדל בקוד (12), אפשר override
- סודות בלבד ב-env - ערכי קונפיג בconfig.ts
- אימות איטיאלי שכל הסודות הוגדרו

### Web .env.example (`apps/web/env.example`)

**מבנה משתני הסביבה:**
```env
# Protocol
VITE_HTTPS=false

# API
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# Application
VITE_APP_NAME=Tags
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=A modern tagging system

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_SOCIAL_LOGIN=true
VITE_ENABLE_FILE_UPLOAD=true

# OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

**מדיניות סודות:**
- רק משתנים עם prefix `VITE_` נחשפים לclient
- סודות שרת (JWT, OAuth secrets) לא מוגדרים בclient
- תמיכה ב-feature flags להרחבת פיצ'רים
- ערכי ברירת מחדל לאבטחה בסיסית

### הוראות הטמעה

**להכנת סביבת פיתוח:**
1. העתק `env.example` ל-`.env` בשני האפליקציות
2. מלא את כל הסודות הנדרשים
3. וודא שהפרוטוקול מסונכרן (HTTP/HTTPS)
4. עבור HTTPS, צור certificates (ראה HTTPS_SETUP.md)

**Best Practices:**
- לעולם אל תכניס סודות לקוד או ל-Git
- השתמש בsecrets management לפרודקשן
- בדוק שכל הסודות חזקים וייחודיים
- סנכרן בין server ו-web על סטטוס פרוטוקול

---

## 3. תמיכת HTTPS

### הגדרות SSL

**Server Side (`apps/server/src/app.ts`):**
```typescript
if (config.SSL_ENABLED) {
  const options = {
    key: fs.readFileSync(config.SSL_KEY_PATH),
    cert: fs.readFileSync(config.SSL_CERT_PATH),
  };
  
  server = https.createServer(options, app).listen(config.PORT, () => {
    logger.info(`🚀 Server is running on HTTPS: https://localhost:${config.PORT}`);
  });
}
```

**Certificate Paths (`apps/server/src/config.ts`):**
```typescript
SSL_CERT_PATH: path.resolve("certs/server.crt")
SSL_KEY_PATH: path.resolve("certs/server.key")
```

### יצירת Certificates לפיתוח

```bash
# יצירת תיקייה
mkdir apps/server/certs

# יצירת מפתח פרטי
openssl genrsa -out apps/server/certs/server.key 2048

# יצירת certificate
openssl req -new -x509 -key apps/server/certs/server.key \
  -out apps/server/certs/server.crt -days 365 \
  -subj "/C=IL/ST=Israel/L=Tel Aviv/O=Tags/OU=Development/CN=localhost"
```

### הגדרות סביבה

**HTTP Mode:**
```env
# Server
SSL_ENABLED=false

# Web
VITE_HTTPS=false
```

**HTTPS Mode:**
```env
# Server
SSL_ENABLED=true

# Web  
VITE_HTTPS=true
```

### פורטים

- **HTTP**: Server על 3001, Web על 5173
- **HTTPS**: Server על 3443, Web על 5174

### יישומי פיתוח

```bash
# HTTP
pnpm dev:http

# HTTPS
pnpm dev:https
```

### מגבלות אבטחה למפתח

**HTTP Mode:**
- Cookies ללא `Secure` flag
- CORS ללא הגבלות קשיחות
- לא מתאים לפרודקשן

**HTTPS Mode:**
- Cookies עם `Secure` flag
- CORS מוגבל לorigin ספציפי
- מתאים לפרודקשן

### Production Notes

ב-production:
1. השתמש ב-certificate מ-CA מוסמך (Let's Encrypt)
2. הגדר HSTS headers
3. בדוק שהכל transmission נעשה על HTTPS
4. וודא שהפורטים פתוחים והדפלוי תקין

---

## 4. CORS, Cookies & Origins (קונפיגורציה בטוחה)

### CORS Configuration (`apps/server/src/app.ts`)

```typescript
const corsOptions: CorsOptions = {
  origin: config.CLIENT_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
```

**הגדרות קריטיות:**
- **origin**: רק origin מורשה (מתוך config)
- **credentials**: מאפשר שליחת cookies
- **optionsSuccessStatus**: 200 עבור preflight
- **methods**: רק methods מפורשים מורשים
- **allowedHeaders**: רק Content-Type ו-Authorization מורשים
- **exposedHeaders**: headers שהקליינט יכול לגשת אליהם

### Security Headers - Helmet (`apps/server/src/app.ts`)

```typescript
// Security headers - Helmet (must be first)
if (config.SSL_ENABLED) {
  // HTTPS mode - enable strict security
  app.use(
    helmet({
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
    })
  );
} else {
  // HTTP mode - basic security
  app.use(
    helmet({
      hsts: false, // Disable HSTS on HTTP
    })
  );
}
```

**Security Headers (כל הפרוטוקולים):**
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: no-referrer
- Content-Security-Policy: default-src 'self'

**HTTPS Only:**
- Strict-Transport-Security (HSTS):
  - maxAge: 1 year
  - includeSubDomains: true
  - preload: true

### Client Origin Configuration

**HTTP Mode:**
```typescript
CLIENT_ORIGIN: "http://localhost:5173"
CLIENT_URL: "http://localhost:5173"
```

**HTTPS Mode:**
```typescript
CLIENT_ORIGIN: "https://localhost:5174"
CLIENT_URL: "https://localhost:5174"
```

### Cookie Configuration (`apps/server/src/lib/cookies.ts`)

```typescript
export function getAuthCookieOptions(isSecure: boolean): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecure,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
}
```

**אבטחה:**
- **httpOnly: true** - חסימת גישה מ-JavaScript (XSS)
- **sameSite: "strict"** - מניעת CSRF
- **secure: isSecure** - HTTPS בלבד כשרצוי
- **maxAge: 30 days** - תאריך תפוגה

### Auth Cookie Auto-Detection

```typescript
export function shouldUseSecureCookies(): boolean {
  return process.env.NODE_ENV === "production" || config.SSL_ENABLED;
}

export function getAuthCookieOptionsAuto(): CookieOptions {
  return getAuthCookieOptions(shouldUseSecureCookies());
}
```

**לוגיקה:**
- HTTPS אוטומטית ב-production
- HTTPS ב-pilot כשמופעל SSL
- HTTP ב-development בלבד

### Cookie Name

```typescript
res.cookie("tags_refresh_token", refreshToken, getAuthCookieOptionsAuto());
```

**פעולות עיקרית:**
- Cookie: `tags_refresh_token`
- תכולה: refresh token לצורך אימות
- מטרה: עבור `/auth/refresh`

### Security Benefits

1. **XSS Protection**: JavaScript לא ניגש ל-cookies (httpOnly)
2. **CSRF Protection**: SameSite=strict
3. **Secure Transport**: Secure flag ב-HTTPS
4. **Token Rotation**: הוצאת refresh token חדש
5. **Logout Invalidation**: tokenVersion

---

## 5. לוגים ומדיניות שגיאות (baseline)

### Logger Implementation (`apps/server/src/lib/logger.ts`)

**Interface:**
```typescript
export interface Logger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext, err?: Error): void;
  debug(message: string, context?: LogContext): void;
  request(req: Request, res: Response, durationMs: number): void;
}
```

**Log Levels:**
- **info**: מידע כללי
- **warn**: אזהרות
- **error**: שגיאות
- **debug**: בפיתוח בלבד

### Log Format

```typescript
[timestamp] [LEVEL] message | {context} | Error: error_message
```

**דוגמה:**
```
[2024-01-15T10:30:45.123Z] [INFO] MongoDB connected
[2024-01-15T10:30:46.456Z] [ERROR] MongoDB connection error | Error: Connection failed
```

### Request ID Middleware (`apps/server/src/app.ts`)

```typescript
app.use((req: Request & { requestId?: string; startTime?: number }, _res, next) => {
  req.requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  req.startTime = Date.now();
  next();
});
```

**שימוש:**
- כל request מקבל מזהה
- מעקב לפי request בlogs
- מדידת משך זמן

### Request Logging (Dev Only)

```typescript
if (process.env.NODE_ENV === "development") {
  app.use((req: Request & { requestId?: string }, _res, next) => {
    logger.debug(`→ ${req.method} ${req.originalUrl}`, {
      requestId: req.requestId,
    });
    next();
  });
}
```

### Response Time Logging

```typescript
app.use((req, res, next) => {
  const startTime = req.startTime || Date.now();
  // ... measure duration ...
  logger.request(req, res, duration);
});
```

**Output (Dev):**
```
GET /api/users 200 45.23ms
POST /auth/login 400 12.56ms
```

### Error Handler (`apps/server/src/middlewares/errorHandler.ts`)

**Error Types:**
1. **ValidationError**: 400
2. **JsonWebTokenError**: 401
3. **UnauthorizedError**: 403
4. **NotFoundError**: 404
5. **Default**: 500

**Error Response:**
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}
```

**Logging:**
```typescript
logger.error(`Error on ${req.method} ${req.originalUrl}`, {
  requestId,
  error: errorMessage,
}, err);
```

### Error Handling Middleware

```typescript
app.use(notFoundHandler);  // 404 handler (must be before errorHandler)
app.use(errorHandler);     // General error handler (must be last)
```

### Best Practices

1. כל שגיאה כוללת requestId
2. Logging עם context
3. Validation ברור
4. Dev/Production behavioral differences
5. Stack traces ב-development בלבד

---

## 6. סקריפטים ו-Turborepo Pipelines

### Turbo.json Configuration

```json
{
  "pipeline": {
    "dev": { "cache": false, "persistent": true },
    "dev:http": { "cache": false, "persistent": true },
    "dev:https": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "lint": { "dependsOn": ["^lint"] },
    "typecheck": { "dependsOn": ["^typecheck"] }
  },
  "globalDependencies": ["**/.env.*local", "**/.env.example"]
}
```

**Features:**
- **Cache Management**: dev scripts לא cached
- **Persistent Tasks**: dev scripts רצים ברקע
- **Dependency Graph**: build/lint/typecheck עם dependencies
- **Environment Awareness**: משתני סביבה חלק מהעלות

### Root Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:http": "turbo run dev:http",
    "dev:https": "turbo run dev:https",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  }
}
```

### Server Scripts (`apps/server/package.json`)

```json
{
  "scripts": {
    "dev": "SERVER_PROTOCOL=http tsx --watch src/app.ts",
    "dev:http": "SERVER_PROTOCOL=http tsx --watch src/app.ts",
    "dev:https": "SERVER_PROTOCOL=https tsx --watch src/app.ts",
    "build": "tsc --project tsconfig.build.json",
    "start": "NODE_ENV=production node dist/app.js"
  }
}
```

### Web Scripts (`apps/web/package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "dev:http": "VITE_HTTPS=false vite",
    "dev:https": "VITE_HTTPS=true vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### Development Workflow

**HTTP Mode:**
```bash
pnpm dev:http
```

**HTTPS Mode:**
```bash
pnpm dev:https
```

**Build:**
```bash
pnpm build
```

### Turborepo Benefits

1. **Caching**: build results cached, הורדת זמן פיתוח
2. **Parallel Execution**: tasks מופעלים במקביל
3. **Dependency Management**: dependencies בפורמט גרפי
4. **Incremental Builds**: build רק מה שהשתנה
5. **Workspace Optimization**: תלות בין packages

### Best Practices

1. **Consistent Scripts**: dev:http, dev:https, build בין אפליקציות
2. **Environment Variables**: cross-env לשימוש cross-platform
3. **Development vs Production**: NODE_ENV במידע ככל הנדרש
4. **Type Safety**: typecheck לפני build
5. **Linting**: lint לפני commit

---

## 7. אבטחת Cookies ו-Session Flags (יישור מול HTTPS)

### Cookie Security Implementation

**Cookie Set (`apps/server/src/controllers/authController.ts`):**
```typescript
res.cookie("tags_refresh_token", refreshToken, getAuthCookieOptionsAuto());
```

**Cookie Clear:**
```typescript
res.clearCookie("tags_refresh_token", getAuthClearCookieOptionsAuto());
```

### Cookie Options Auto-Detection

```typescript
export function shouldUseSecureCookies(): boolean {
  return process.env.NODE_ENV === "production" || config.SSL_ENABLED;
}

export function getAuthCookieOptionsAuto(): CookieOptions {
  return getAuthCookieOptions(shouldUseSecureCookies());
}
```

**לוגיקה:**
1. Production: תמיד secure
2. SSL enabled: תמיד secure
3. Development HTTP: לא secure

### Session Flags Alignment

**Flags:**
| Flag | Value | Purpose |
|------|-------|---------|
| httpOnly | true | XSS protection |
| sameSite | strict | CSRF protection |
| secure | auto-detect | HTTPS only when needed |
| maxAge | 30 days | Expiration |
| path | / | Scope |

### Security Matrix

| Environment | SSL Enabled | Cookie Secure | HTTPS Required |
|-------------|-------------|---------------|----------------|
| Development | false | false | No |
| Development | true | true | Yes |
| Production | true | true | Yes |

### Refresh Token Flow

**1. Login:**
```typescript
const refreshToken = createRefreshToken(user);
res.cookie("tags_refresh_token", refreshToken, getAuthCookieOptionsAuto());
res.json({ accessToken });
```

**2. Refresh:**
```typescript
const refreshToken = req.cookies.tags_refresh_token;
const decoded = verifyRefreshToken(refreshToken);
const accessToken = createAccessToken(decoded.user);
const newRefreshToken = createRefreshToken(decoded.user);

res.cookie("tags_refresh_token", newRefreshToken, getAuthCookieOptionsAuto());
res.json({ accessToken });
```

**3. Logout:**
```typescript
res.clearCookie("tags_refresh_token", getAuthClearCookieOptionsAuto());
```

### Token Rotation

**Implementation:**
- כל refresh מוציא refresh token חדש
- token ישן אינו תקף אחרי refresh
- מגביל פרק הזמן שבו token יכול להיות משוחזר

### Logout Invalidation

**Global Logout:**
```typescript
// Increment tokenVersion to invalidate all tokens
user.tokenVersion += 1;
await user.save();

// Clear cookie
res.clearCookie("tags_refresh_token", getAuthClearCookieOptionsAuto());
```

**Security:**
- כל הsessions מבוטלות
- tokens קיימים פגי תוקף
- הוספת רמה נוספת של אבטחה

### Best Practices

1. **HttpOnly**: תמיד true לrefresh tokens
2. **SameSite: strict**: CSRF protection
3. **Secure**: אוטומטי לפי סביבה
4. **Token Rotation**: חובה על כל refresh
5. **Version Checking**: tokenVersion לכל logout
6. **HTTPS Alignment**: cookies עם SSL flags

---

## סיכום מלא

### Configuration Policy

1. **Single Source of Truth**: `SSL_ENABLED` בלבד קובע פרוטוקול
2. **Backwards Compatible**: תמיכה ב-`SERVER_PROTOCOL` כמיושן
3. **Unified**: server ו-web מסתנכרנים על פרוטוקול
4. **Typed**: interfaces ברורות עם validation
5. **Secure**: ברירת מחדל מעוררת מודעות
6. **Flexible**: HTTP לdev, HTTPS לprod
7. **Port Constants**: 3001/3443 קבועים בקוד, לא בסודות
8. **Config Separation**: סודות ב-.env, ערכי קונפיג בconfig.ts

### Environment Variables

1. **Server**: .env ב-root apps/server
2. **Web**: .env ב-root apps/web  
3. **Secrets Only**: רק סודות ב-.env
4. **Config Defaults**: ערכי קונפיג בconfig.ts עם ברירות מחדל
5. **Examples**: .env.example לכל אפליקציה
6. **Non-Secret Override**: אפשר override של ערכים לא-סודיים (e.g., BCRYPT_ROUNDS)

### HTTPS Support

1. **Development**: self-signed certificates
2. **Production**: CA certificates מוסמכים
3. **Auto-detection**: SSL flags אוטומטיים
4. **Fallback**: HTTP אם SSL נכשל
5. **Port Sync**: Web syncs עם server port (5173/5174)

### CORS & Security

1. **Explicit Methods**: רק methods מפורשים מורשים
2. **Explicit Headers**: רק allowedHeaders מפורשים
3. **Origin**: רק origin מורשה
4. **Credentials**: cookies מורשים
5. **Cookies**: Secure + HttpOnly + SameSite
6. **HTTPS alignment**: flags מותאמים לפרוטוקול
7. **Security Headers**: Helmet עם HSTS ב-HTTPS

### Logging & Errors

1. **Structured**: format ברור
2. **Request ID**: מעקב עקבי
3. **Context**: פרטי סביבה
4. **Development**: logs מוגדלים ב-dev
5. **Response Time**: מדידת ביצועים

### Scripts & Build

1. **Turborepo**: caching וביצוע מקבילי
2. **Protocol**: dev:http / dev:https
3. **Dependencies**: גרף תלויות
4. **Optimization**: builds אינקרמנטליים
5. **Cross-platform**: cross-env לכל הסקריפטים

### Cookie Security

1. **HttpOnly**: XSS protection
2. **SameSite**: CSRF protection
3. **Secure**: HTTPS alignment
4. **Rotation**: token חדש במידת הצורך
5. **Invalidation**: token version checking
6. **Clear Options**: path זהה ל-set ו-clear

---

*Document Version: 1.0*
*Last Updated: 2024*


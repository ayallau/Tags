# עדכוני קונפיגורציה - Configuration Updates

תאריך: 2024

## סיכום השינויים

### 1. Single Source of Truth - SSL_ENABLED

**בעיה:** היה שימוש בשני מקורות: `SERVER_PROTOCOL` ו-`SSL_ENABLED`

**פתרון:**
- `SSL_ENABLED` הוא Single Source of Truth
- `SERVER_PROTOCOL` נתמך לbackwards compatibility
- העדפת boolean על string

**קובץ:** `apps/server/src/config.ts`
```typescript
// Single source of truth for SSL - only SSL_ENABLED determines protocol
const isHttps = process.env.SSL_ENABLED === "true";
// Support deprecated SERVER_PROTOCOL for backwards compatibility
const isHttpsLegacy = process.env.SERVER_PROTOCOL === "https";
```

---

### 2. יציבות פורטים - Port Constants

**בעיה:** פורטים היו חצי דינמיים

**פתרון:**
- `PORT_HTTP: 3001` - constant
- `PORT_HTTPS: 3443` - constant
- `PORT` - computed based on protocol

**קובץ:** `apps/server/src/config.ts`
```typescript
// Config - ports are constants
PORT_HTTP: 3001,
PORT_HTTPS: 3443,
get PORT() {
  return isHttps || isHttpsLegacy ? this.PORT_HTTPS : this.PORT_HTTP;
},
```

---

### 3. BCRYPT_ROUNDS - Config Default

**בעיה:** `BCRYPT_ROUNDS` ב-env.example למרות שהוא לא סוד

**פתרון:**
- ברירת מחדל בקוד: `12`
- אפשר override: `BCRYPT_ROUNDS=12` (optional)
- הסרה מ-env.example

**קובץ:** `apps/server/src/config.ts`
```typescript
// Non-secret config - can be overridden via env if needed
BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) || 12,
```

**קובץ:** `apps/server/env.example`
```env
# Optional: Override BCRYPT_ROUNDS (default: 12)
# BCRYPT_ROUNDS=12
```

---

### 4. CORS - Explicit Headers

**בעיה:** CORS לא מוגדר במפורש

**פתרון:**
- הוספת `methods` מפורש
- הוספת `allowedHeaders` מפורש
- הוספת `exposedHeaders` מפורש

**קובץ:** `apps/server/src/app.ts`
```typescript
const corsOptions: CorsOptions = {
  origin: config.CLIENT_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
};
```

---

### 5. Helmet + HSTS

**בעיה:** לא היה security headers

**פתרון:**
- הוספת `helmet` middleware
- HSTS רק ב-HTTPS
- Security headers בכל הפרוטוקולים

**קובץ:** `apps/server/src/app.ts`
```typescript
import helmet from "helmet";

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

**קובץ:** `apps/server/package.json`
```json
"dependencies": {
  "helmet": "^8.0.0",
},
"devDependencies": {
  "@types/helmet": "^4.0.0",
}
```

---

### 6. Vite HTTPS - Port Dynamic

**בעיה:** Port לא היה דינמי ב-HTTPS

**פתרון:**
- Port דינמי לפי `VITE_HTTPS`
- HTTP: 5173
- HTTPS: 5174

**קובץ:** `apps/web/vite.config.ts`
```typescript
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  server: {
    port: process.env['VITE_HTTPS'] === 'true' ? 5174 : 5173,
    host: 'localhost',
    // Support for HTTPS development
    ...(process.env['VITE_HTTPS'] === 'true' && {
      https: {
        key: fs.readFileSync(path.resolve('../server/certs/server.key')),
        cert: fs.readFileSync(path.resolve('../server/certs/server.crt')),
      },
    }),
  },
});
```

---

## קבצים שעודכנו

1. `apps/server/src/config.ts`
   - Single Source of Truth: SSL_ENABLED
   - Port constants
   - BCRYPT_ROUNDS override

2. `apps/server/src/app.ts`
   - CORS explicit headers
   - Helmet + HSTS
   - Security headers

3. `apps/server/env.example`
   - הסרת BCRYPT_ROUNDS (לא סוד)
   - SSL_ENABLED בלבד
   - הערות אופציונליות

4. `apps/server/package.json`
   - הוספת helmet
   - הוספת @types/helmet

5. `apps/web/vite.config.ts`
   - Port דינמי
   - HTTPS config משופר

6. `devdocs/configuration_summary.md`
   - עדכון מלא של התיעוד
   - כל השינויים מוסברים

---

## הוראות התקנה

להתקנת התלויות החדשות (helmet):
```bash
cd apps/server
pnpm install
```

---

## בדיקות נדרשות

- [ ] בדיקת HTTP mode עם `pnpm dev:http`
- [ ] בדיקת HTTPS mode עם `pnpm dev:https`
- [ ] בדיקת health endpoint: `/health`
- [ ] בדיקת version endpoint: `/version`
- [ ] בדיקת CORS עם headers
- [ ] בדיקת HSTS ב-HTTPS
- [ ] בדיקת cookies ב-HTTP/HTTPS
- [ ] בדיקת פורטים: 3001/3443 (server), 5173/5174 (web)

---

*Document Version: 1.0*
*Created: 2024*


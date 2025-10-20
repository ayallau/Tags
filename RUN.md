# 🚀 הוראות הרצה - Tags Monorepo

## 📋 התקנה ראשונית

### דרישות מערכת

- Node.js 18+
- pnpm 8+

### התקנת תלויות

```bash
# התקנת כל התלויות
pnpm install
```

## 🏃‍♂️ הרצת פיתוח

### הרצה מלאה (מומלץ)

```bash
# הרצת כל האפליקציות במקביל (HTTP)
pnpm dev
```

**זה יריץ:**

- 🌐 **Web App**: `http://localhost:5173`
- 🔧 **Server API**: `http://localhost:3001`

### הרצה עם HTTPS

```bash
# הרצת כל האפליקציות עם HTTPS
pnpm dev:https
```

**זה יריץ:**

- 🌐 **Web App**: `https://localhost:5174`
- 🔧 **Server API**: `https://localhost:3443`

### הרצה נפרדת

#### רק השרת

```bash
# HTTP
pnpm dev:http --filter=@tags/server
# או ישירות
cd apps/server && pnpm dev:http

# HTTPS
pnpm dev:https --filter=@tags/server
# או ישירות
cd apps/server && pnpm dev:https
```

#### רק ה-Web

```bash
# HTTP
pnpm dev:http --filter=@tags/web
# או ישירות
cd apps/web && pnpm dev:http

# HTTPS
pnpm dev:https --filter=@tags/web
# או ישירות
cd apps/web && pnpm dev:https
```

## 🌐 גישה לאפליקציות

### Web Application

#### HTTP Mode

- **URL**: `http://localhost:5173`
- **תיאור**: React + Vite frontend
- **תכונות**: דף הבית של המונוריפו

#### HTTPS Mode

- **URL**: `https://localhost:5174`
- **תיאור**: React + Vite frontend עם SSL
- **תכונות**: דף הבית של המונוריפו

### Server API

#### HTTP Mode

- **URL**: `http://localhost:3001`
- **תיאור**: Express.js backend
- **API Endpoints**:
  - `/api/me` - מידע משתמש נוכחי
  - `/auth/*` - נתיבי אימות (login, register, logout)
- **Swagger UI**: `http://localhost:3001/docs` (בפיתוח בלבד)

#### HTTPS Mode

- **URL**: `https://localhost:3443`
- **תיאור**: Express.js backend עם SSL
- **API Endpoints**:
  - `/api/me` - מידע משתמש נוכחי
  - `/auth/*` - נתיבי אימות (login, register, logout)
- **Swagger UI**: `https://localhost:3443/docs` (בפיתוח בלבד)

## 🔐 הגדרת SSL לפיתוח

### יצירת תעודות SSL

```bash
# יצירת תיקיית תעודות
mkdir -p apps/server/certs

# יצירת תעודת SSL עצמית
openssl req -x509 -newkey rsa:4096 -keyout apps/server/certs/server.key -out apps/server/certs/server.crt -days 365 -nodes -subj "/C=IL/ST=Israel/L=Tel Aviv/O=Tags/OU=Development/CN=localhost"
```

### הגדרת קבצי סביבה

```bash
# העתק קבצי סביבה
cp apps/server/env.example apps/server/.env
cp apps/web/env.example apps/web/.env

# ערוך את הערכים לפי הצורך
```

### הרצה עם HTTPS

```bash
# הרצת השרת עם HTTPS
cd apps/server
pnpm dev:https

# הרצת ה-Web עם HTTPS
cd apps/web
pnpm dev:https
```

## 🔧 פקודות פיתוח

### בדיקות איכות

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# תיקון אוטומטי של linting
pnpm lint:fix
```

### Build

```bash
# Build כל האפליקציות
pnpm build

# Build רק packages
pnpm build --filter='@tags/*'

# Build רק אפליקציות
pnpm build --filter='!@tags/*'

# Build רק server
pnpm build --filter=@tags/server

# Build רק web
pnpm build --filter=@tags/web


```

### Formatting

```bash
# Format כל הקבצים
pnpm format

# בדיקת formatting
pnpm format:check
```

### ניקוי

```bash
# ניקוי build artifacts
pnpm clean

# ניקוי מלא (כולל node_modules)
pnpm clean && rm -rf node_modules
```

## ⚡ התחלה מהירה

### HTTP Mode

```bash
# 1. התקן תלויות
pnpm install

# 2. הרץ הכל עם HTTP
pnpm dev

# 3. פתח בדפדפן
# 🌐 Web: http://localhost:5173
# 🔧 API: http://localhost:3001
```

### HTTPS Mode

```bash
# 1. התקן תלויות
pnpm install

# 2. צור תעודות SSL
mkdir -p apps/server/certs
openssl req -x509 -newkey rsa:4096 -keyout apps/server/certs/server.key -out apps/server/certs/server.crt -days 365 -nodes -subj "/C=IL/ST=Israel/L=Tel Aviv/O=Tags/OU=Development/CN=localhost"

# 3. הרץ הכל עם HTTPS
pnpm dev:https

# 4. פתח בדפדפן
# 🌐 Web: https://localhost:5174
# 🔧 API: https://localhost:3443
```

## 🛠️ פיתוח מתקדם

### עבודה עם packages נפרדים

```bash
# Build package ספציפי
pnpm build --filter=@tags/models

# Type check package ספציפי
pnpm typecheck --filter=@tags/api

# Lint package ספציפי
pnpm lint --filter=@tags/config
```

### Debugging

```bash
# Server עם debug
cd apps/server
pnpm dev:debug

# או דרך Turborepo
pnpm dev:debug --filter=@tags/server
```

### Environment Variables

```bash
# העתק קבצי סביבה
cp apps/server/env.example apps/server/.env
cp apps/web/env.example apps/web/.env

# ערוך את הערכים לפי הצורך
```

## 🐛 פתרון בעיות נפוצות

### שגיאות TypeScript

```bash
# בדוק type checking
pnpm typecheck

# אם יש שגיאות, בנה packages קודם
pnpm build --filter='@tags/*'
```

### שגיאות Build

```bash
# נקה cache
pnpm clean

# התקן מחדש
pnpm install

# בנה מחדש
pnpm build
```

### בעיות Port

```bash
# אם Port 3001 תפוס (HTTP)
# שנה ב-apps/server/.env:
SERVER_PROTOCOL=http
# או שנה את PORT_HTTP ב-config.ts

# אם Port 3443 תפוס (HTTPS)
# שנה ב-apps/server/.env:
SERVER_PROTOCOL=https
# או שנה את PORT_HTTPS ב-config.ts

# אם Port 5173 תפוס (Web HTTP)
# שנה ב-apps/web/vite.config.ts

# אם Port 5174 תפוס (Web HTTPS)
# שנה ב-apps/web/vite.config.ts
```

### בעיות SSL

```bash
# אם תעודות SSL חסרות
mkdir -p apps/server/certs
openssl req -x509 -newkey rsa:4096 -keyout apps/server/certs/server.key -out apps/server/certs/server.crt -days 365 -nodes -subj "/C=IL/ST=Israel/L=Tel Aviv/O=Tags/OU=Development/CN=localhost"

# אם יש שגיאות SSL בדפדפן
# לחץ על "Advanced" ו-"Proceed to localhost"
```

## 📚 משאבים נוספים

- **README**: `README.md` - תיעוד מלא
- **API Docs**:
  - HTTP: `http://localhost:3001/docs` (בפיתוח)
  - HTTPS: `https://localhost:3443/docs` (בפיתוח)
- **Turborepo**: `turbo.json` - הגדרות build
- **Workspaces**: `pnpm-workspace.yaml` - הגדרות packages
- **Project Rules**: `.cursor/rules/project-rules.mdc` - מדיניות פורטים וקונפיגורציה

## 🆘 תמיכה

אם נתקלת בבעיות:

1. בדוק שה-Node.js ו-pnpm מותקנים
2. הרץ `pnpm clean && pnpm install`
3. בדוק שה-ports לא תפוסים
4. עיין ב-logs של הטרמינל
5. בדוק שקבצי `.env` קיימים ומוגדרים נכון
6. עבור HTTPS: בדוק שתעודות SSL קיימות ב-`apps/server/certs/`

---

**המונוריפו מוכן לשימוש! 🎉**

**הגדרות פורטים:**

- **HTTP**: Server 3001, Web 5173
- **HTTPS**: Server 3443, Web 5174

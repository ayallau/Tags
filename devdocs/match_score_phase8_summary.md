# Match Score Implementation - Phase 8

## 📋 סקירה כללית

מימוש מערכת Match Score עם חישוב מראש (offline) של ציוני התאמה בין זוגות משתמשים לפי מספר התגיות המשותפות.

---

## 🏗️ מה נוצר

### 1. מודל MatchScore (`apps/server/src/models/MatchScore.ts`)
- **שדות:**
  - `userId` - מזהה המשתמש
  - `targetUserId` - מזהה המשתמש המיועד
  - `score` - ציון התאמה (0-100)
  - `sharedTagsCount` - מספר התגיות המשותפות
  - `computedAt` - תאריך חישוב

- **אינדקסים:**
  - `(userId, targetUserId)` - ייחודי
  - `(userId, score -1)` - למיון מהיר
  - `userId`, `score`, `computedAt` - אינדקסים פשוטים

### 2. שירות userMatchService (`apps/server/src/services/userMatchService.ts`)
- `calculateMatchScore()` - חישוב ציון התאמה
- `upsertMatchScore()` - שמירה/עדכון ציון (idempotent)
- `computeMatchesForUser()` - חישוב לכל המשתמשים עבור משתמש מסוים
- `incrementalUpdateForUser()` - עדכון אינקרמנטלי
- `rebuildAllMatches()` - חישוב מלא (batch job)

### 3. Controller (`apps/server/src/controllers/matchController.ts`)
- `getMatches()` - שליפת התאמות עם pagination

### 4. DTOs (`apps/server/src/dtos/match.dto.ts`)
- `GetMatchesQuery` - פרמטרי שאילתה
- `MatchDto` - DTO לתגובה
- `GetMatchesResponse` - תגובת API

### 5. Route (`apps/server/src/routes/user.routes.ts`)
- `GET /users/matches` - שליפת התאמות

### 6. Trigger אינקרמנטלי (`apps/server/src/controllers/userController.ts`)
- `updateCurrentUser()` - מעדכן אוטומטית ציונים כש-tags משתנים

### 7. Script Rebuild (`apps/server/src/scripts/rebuildMatches.ts`)
- הרצת batch job מלא לחישוב כל הציונים

---

## 🔧 אלגוריתם חישוב

```typescript
sharedTagsCount = intersection(user.tags, target.tags)
score = min(100, sharedTagsCount * 10)
```

**דוגמאות:**
- 0 תגיות משותפות = 0
- 1 תגית משותפת = 10
- 5 תגיות משותפות = 50
- 10+ תגיות משותפות = 100 (מקסימום)

---

## 🧪 בדיקות ידניות

### תרחיש 1: Rebuild מלא
```bash
cd apps/server
pnpm tsx src/scripts/rebuildMatches.ts
```

**תוצאה צפויה:**
- חישוב ציונים לכל המשתמשים
- לוג התקדמות
- סטטיסטיקות: כמה נוצרו, כמה עודכנו

---

### תרחיש 2: עדכון אינקרמנטלי

**צעדים:**
1. יש לך משתמש עם תגיות: `["tag1", "tag2", "tag3"]`
2. יש משתמש אחר עם תגיות: `["tag1", "tag4"]` → ציון: 10
3. עדכן את התגיות של המשתמש השני: `["tag1", "tag4", "tag2"]`
4. שלוף שוב את הציונים

**תוצאה צפויה:**
- ציון המעודכן: 20 (2 תגיות משותפות)
- רק הזוגות הרלוונטיים מתעדכנים

---

### תרחיש 3: API - שליפת התאמות

```bash
# Login and get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get matches
curl -X GET "http://localhost:3001/api/users/matches?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**תוצאה צפויה:**
```json
{
  "matches": [
    {
      "targetUser": {
        "_id": "...",
        "username": "john",
        "avatarUrl": "...",
        "isOnline": true,
        "tags": [...]
      },
      "score": 50,
      "sharedTagsCount": 5,
      "computedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "nextCursor": "50_userId_targetUserId",
  "hasMore": true
}
```

---

### תרחיש 4: מחיקת תגיות

**צעדים:**
1. משתמש עם תגיות רבות → יש לו הרבה matches
2. מחק את כל התגיות שלו
3. עדכן פרופיל

**תוצאה צפויה:**
- כל ה-`matches` של המשתמש הזה נמחקים
- משתמשים אחרים עדיין רואים את המשתמש הזה אם הוא מופיע בהתאמות שלהם

---

### תרחיש 5: Pagination

```bash
# Request 1
curl -X GET "http://localhost:3001/api/users/matches?limit=5"

# Request 2 (with cursor)
curl -X GET "http://localhost:3001/api/users/matches?limit=5&cursor=50_userId_targetUserId"
```

**תוצאה צפויה:**
- Request 1: 5 התאמות הראשונות
- Request 2: 5 התאמות הבאות (לא כפילויות)

---

## 📊 Acceptance Criteria - סיכום

✅ **טבלה match_scores עם אינדקסים:**
- ✓ `(userId, targetUserId)` ייחודי
- ✓ `(userId, score desc)`

✅ **Batch Job:**
- ✓ Rebuild מלא
- ✓ עידכון אינקרמנטלי (trigger)
- ✓ אין חישוב עצמי
- ✓ אין כפילויות

✅ **Algorithm:**
- ✓ `score = min(100, sharedTagsCount * 10)`

✅ **API:**
- ✓ GET `/users/matches` עם pagination
- ✓ Sort לפי `score` (default)
- ✓ Projection דל

✅ **Idempotent:**
- ✓ הרצה חוזרת לא יוצרת כפילויות
- ✓ Upsert logic

✅ **Logs & Metrics:**
- ✓ כמות זוגות שנבחנו
- ✓ כמות נוצרו/עודכנו/נמחקו

✅ **כיבוד כללי הפרויקט:**
- ✓ ללא שינוי למדיניות .env
- ✓ ESM + TS
- ✓ Checkpoint לפני שינוי רחב

---

## 🚀 הרצה ראשונית

לאחר הוספת המודל החדש, יש לעדכן את ה-DB:

```bash
# Restart server to register new model
cd apps/server
pnpm build
pnpm start

# Run rebuild
pnpm tsx src/scripts/rebuildMatches.ts
```

---

## 📝 הערות טכניות

1. **ביצועים:** Rebuild processing in batches (50 users at a time)
2. **Memory:** לא שומר את כל התגיות בזיכרון
3. **Incremental:** רק משתמשים עם תגיות משותפות מתעדכנים
4. **Cleanup:** מסיר התאמות שלא רלוונטיות יותר

---

## 🔍 Debugging

**ב-MongoDB Compass:**
- Collection: `matchscores`
- Check indexes: `.getIndexes()`
- Check documents: `find({ userId: ObjectId("...") }).sort({ score: -1 })`

**ב-Logs:**
```
[MatchScore] Starting rebuild for X users...
[MatchScore] Progress: 50/100 (50.0%)
[MatchScore] Incremental update triggered for user ...
[MatchScore] Rebuild complete: 100 users, 250 created, 150 updated
```

---

**סיום שלב 8 - Match Score! 🎉**


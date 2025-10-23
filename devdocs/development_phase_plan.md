# **Development Phase Plan**

## **Summary**

### **1. UI & App Foundation**
- **AppLayout** (Header / Navbar / Content / Footer), navigation system, templates for **DataState / InfiniteScroller / Skeletons**.  
- Full **RTL** support + **Theme Manager** with **Dark Mode**, including colors, modals, menus, and toasts.  
- Integration of **Zustand (UI state)** + **React Query (data)**.  
- Based on the component list and RTL/Dark Mode/Skeletons recommendations.

---

### **2. Configuration & DevOps for Smooth Development**
- Unified config policy:  
  - Secrets only in `.env`.  
  - All non-sensitive settings in `config.ts`.  
  - Support for local HTTPS.  
  - **Never auto-generate `.env` files.**
- Provide `env.example` and implement **Single Source of Truth**.  
*(Helps prevent environment conflicts during future feature development.)*

---

### **3. Base Models & Schemas (DB First Pass)**
- Create core collections and schemas: **users**, **tags** + required indexes.  
- Define TypeScript types for consistency.  
*(Additional models will be added later as relevant features are implemented.)*

---

### **4. Authentication & Identity**
- **Google OAuth + JWT + Refresh Tokens** on the server, client login state management, and **Welcome/Auth** screens.  
- Maintain security and authorization best practices.

---

### **5. Tags — CRUD + Autocomplete**
- Use normalized **slug**, text index on `label`, and optional **Atlas Search (n-gram)**.  
- Implement `/tags/search` endpoint, `TagPill`, and `TagPicker` components.

---

### **6. Onboarding Wizard**
- Guided flow for selecting tags and entering basic user details, saved under `users.tags`.  
- Automatic redirect to **Home/Discover** after completion.

---

### **7. Discover (Tags & Users) + Pagination**
- **Discover Page:** `AddTagBar`, `TagsGrid`, and `UsersList` with sorting and search.  
- **Cursor-based pagination** + limited field projection for efficient queries.

---

### **8. Match Score (Batch Computation)**
- Create `match_scores` collection and background job for **pre-computing scores** (not at runtime).  
- Update scores whenever user tags change.  
- Add indexes on `userId` and `score` for efficient lookups.

---

### **9. Matches Page**
- Display matches ordered by **score / online / last visit**, integrated with `match_scores`.

---

### **10. Profile + Photo Gallery**
- User profile page (basic edit + tags).  
- Photo uploads via **S3 / Cloudinary** — database stores **URLs only**.

---

### **11. Bookmarks**
- Allow users to **save favorite users** and add **personal notes (bookmarks)**.  
- Add suitable indexes and UI components.

---

### **12. Friends (Friendship)**
- Implement **friend requests / accept / block** logic with `Friends` page.  
- Enforce a unique composite index on `userA + userB`.

---

### **13. Settings: Blocked & Hidden**
- **Settings Page** + API-level filtering (blocked/hidden users are excluded from results).  

---

### **14. Chat MVP (Conversations / Messages)**
- **Conversation list**, **message threads**, and **new message composer**.  
- Real-time updates optional for later; **polling / invalidation** is sufficient for MVP.

---

### **15. Admin Panel (MVP)**
- Simple management table with pagination, basic indexes, and common admin actions.

---

### **16. Performance, Accessibility & Testing**
- **Unit / Integration / E2E** test coverage for core user flows.  
- Logging of key events:  
  - Tag add/remove  
  - Save/bookmark actions  
  - Sending chat messages  
- UX enhancements: consistent **skeletons**, prevent **layout shifts**, comply with **WCAG 2.1**.

---

## **Details**

### **Feature 1: Foundation (App Shell + Theme/Dark + RTL + State Wiring)**

1. **Theme System + Dark Mode + Design Tokens**  
2. **AppLayout (Header / Navbar / Content / Footer)** + full RTL  
3. **Routing + Lazy Loading + Skeleton Frames**  
4. **Zustand (UI State)** + **React Query (Data)**  
5. **DataState Template (Idle / Loading / Empty / Error)** + `EmptyState` UI  
6. **Quick QA (A11y / Performance)** + sanity checks  

---

### **Feature 2:** *(To be defined in later phases)*


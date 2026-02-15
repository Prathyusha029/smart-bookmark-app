# Smart Bookmark App
A secure fullstack bookmark management application built using Next.js, Supabase, and Google OAuth.
## 🚀 Live Demo
https://smart-bookmark-app-iota-ten.vercel.app
## 🛠 Tech Stack
- Next.js (App Router)
- Supabase (PostgreSQL + Auth + Realtime)
- Google OAuth 2.0
- Tailwind CSS
- Vercel (Deployment)
## ✨ Features
- Google OAuth Authentication
- Secure Row Level Security (RLS)
- User-specific private bookmarks
- Add & Delete bookmarks
- Duplicate URL prevention (unique constraint per user)
- Realtime updates across tabs
- Fully deployed on Vercel
## 🔐 Security
- Row Level Security enforced on database
- Unique constraint on (user_id, url)
- No secret keys exposed to frontend
- Protected routes for authenticated users only
## 🧠 Database Design
Table: bookmarks
- id (UUID)
- user_id (FK → auth.users.id)
- title (TEXT)
- url (TEXT)
- created_at (TIMESTAMPTZ)
Unique Constraint:
(user_id, url)
## ⚙️ Setup Locally
1. Clone repo
2. Install dependencies
   npm install
3. Add environment variables:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Run:
   npm run dev
## 🧩 Challenges Faced & Solutions

### 1. Supabase RLS Configuration
Ensuring users could only access their own bookmarks required proper Row Level Security policies. I configured SELECT, INSERT, and DELETE policies using `auth.uid()`.

### 2. Duplicate Prevention
Initially, duplicate bookmarks were being inserted. I resolved this by adding a database-level unique constraint on `(user_id, url)` and handling error code `23505` in the frontend.

### 3. Production Deployment Issues
During deployment, the build failed due to missing environment variables. I resolved this by configuring `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel and updating Supabase redirect URLs.

## 🌍 Deployment
Deployed using Vercel with environment variables configured in dashboard.
Built by Prathyusha Y

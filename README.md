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

## 🌍 Deployment
Deployed using Vercel with environment variables configured in dashboard.

---

Built by Prathyusha Y

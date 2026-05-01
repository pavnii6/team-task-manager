# Team Task Manager

A full-featured team task management web app built with **React (Vite)** + **Tailwind CSS** + **Supabase**.

---

## Features

- **Auth** — Email/password signup & login via Supabase Auth
- **Roles** — Admin (first user / configured email) can create projects & tasks; members can update task status
- **Projects** — Create and browse projects
- **Tasks** — Create tasks with title, description, status, due date, and assignee
- **Dashboard** — Stats: total tasks, by status, overdue count with visual progress bars
- **Overdue detection** — Tasks past their due date are highlighted in red

---

## Quick Start

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** and run the contents of `supabase-setup.sql`.
3. Copy your **Project URL** and **anon public key** from **Settings → API**.

### 2. Configure environment variables

Edit `.env` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: set a specific admin email
# If omitted, the first user who signs up and sets role=admin in metadata is admin
VITE_ADMIN_EMAIL=admin@yourcompany.com
```

### 3. Install dependencies & run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Admin Setup

The app determines admin status in two ways:

**Option A (recommended):** Set `VITE_ADMIN_EMAIL` in `.env` to the email address that should be admin.

**Option B:** After signing up, go to **Supabase Dashboard → Authentication → Users**, click your user, and add this to **Raw User Meta Data**:
```json
{ "role": "admin" }
```

---

## Folder Structure

```
src/
├── pages/
│   ├── AuthPage.jsx        # Login / Signup
│   ├── DashboardPage.jsx   # Stats + project list
│   └── ProjectPage.jsx     # Tasks inside a project
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   └── TaskCard.jsx        # Individual task card with status controls
├── supabaseClient.js       # Supabase client initialization
├── App.jsx                 # Router + auth session management
├── main.jsx                # React entry point
└── index.css               # Tailwind CSS import
```

---

## Build for Production

```bash
npm run build
npm run preview
```

The `dist/` folder is ready to deploy to **Vercel**, **Netlify**, or any static host.

### Deploy to Vercel

```bash
npx vercel --prod
```

Set the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_EMAIL`) in the Vercel project settings.

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 19 + Vite 8       |
| Styling   | Tailwind CSS v4         |
| Backend   | Supabase (Auth + DB)    |
| Routing   | React Router v7         |

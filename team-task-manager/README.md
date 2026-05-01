# 🚀 Team Task Manager

A full-stack **Team Task Management Web Application** that allows users to create projects, assign tasks, and track progress with **role-based access control**.

Built using **React (Vite)**, **Tailwind CSS**, and **Supabase**.

---

## 🌐 Live Demo

* 🔗 Vercel: https://team-task-manager-n84s.vercel.app
* 🔗 Railway: http://team-task-manager-production-2b91.up.railway.app

---

## ✨ Features

* 🔐 Authentication (Signup/Login using Supabase)
* 👤 Role-based access (Admin & Member)
* 📁 Project creation and management
* ✅ Task creation and assignment
* 🔄 Task status tracking (To Do, In Progress, Done)
* 📊 Dashboard with task statistics
* ⏰ Overdue task highlighting
* 🎯 Clean and responsive UI

---

## 🛠 Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Backend:** Supabase (Authentication + Database)
* **Routing:** React Router
* **Deployment:** Vercel & Railway

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/pavnii6/team-task-manager.git
cd team-task-manager
```

---

### 2️⃣ Create `.env` file

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_EMAIL=your-email@gmail.com
```

---

### 3️⃣ Install dependencies & run

```bash
npm install
npm run dev
```

👉 Open: http://localhost:5173

---

## 👑 Admin Configuration

### Option A (Recommended)

Set admin email in `.env`:

```env
VITE_ADMIN_EMAIL=your-email@gmail.com
```

---

### Option B (Supabase Metadata)

Go to **Supabase → Authentication → Users**
Add:

```json
{ "role": "admin" }
```

---

## 📂 Project Structure

```
src/
├── pages/
│   ├── AuthPage.jsx
│   ├── DashboardPage.jsx
│   └── ProjectPage.jsx
├── components/
│   ├── Navbar.jsx
│   └── TaskCard.jsx
├── supabaseClient.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Deployment

### Vercel

* Import GitHub repo
* Add environment variables
* Deploy

### Railway

* Set root directory
* Add environment variables
* Configure build & start commands

---

## 🎥 Demo Video

👉 https://your-demo-video-link

---

## 💡 Key Highlights

* Role-based access control (Admin & Member)
* Row-Level Security (RLS) implemented in Supabase
* Secure authentication system
* Fully responsive UI
* Deployed on multiple platforms

---

## 🔮 Future Improvements

* Task priority (Low / Medium / High)
* Team collaboration (multi-user projects)
* Notifications & reminders
* Real-time updates

---

## 👩‍💻 Author

**Pavni Srivastava**

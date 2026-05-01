# 🚀 Team Task Manager

A full-stack **Team Task Management Web Application** that enables users to create projects, assign tasks, and track progress with **role-based access control (Admin & Member)**.

Built using **React (Vite)**, **Tailwind CSS**, and **Supabase**.

---

## 🌐 Live Application

🔗 Vercel: https://team-task-manager-n84s-jylxj2y5y-pavnicr7-gmailcoms-projects.vercel.app
🔗 Railway: http://team-task-manager-production-2b91.up.railway.app

---

## 🎥 Demo Video

👉 https://your-demo-video-link

---

## ✨ Key Features

* 🔐 Authentication (Signup/Login using Supabase)
* 👤 Role-based access control (Admin & Member)
* 📁 Project creation and management
* ✅ Task creation and assignment
* 🔄 Task status tracking (To Do, In Progress, Done)
* 📊 Dashboard with real-time task statistics
* ⏰ Overdue task detection
* 🎯 Responsive and clean UI

---

## 🛠 Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Backend:** Supabase (Auth + Database)
* **Routing:** React Router
* **Deployment:** Vercel & Railway

---

## ⚙️ How It Works

* Users sign up/login via Supabase Authentication
* Admin users can create projects and tasks
* Members can update task status
* Tasks are stored and managed using Supabase database
* Dashboard dynamically shows task insights

---

## 🔐 Role-Based Access

* **Admin**

  * Create projects
  * Create and assign tasks

* **Member**

  * View projects
  * Update task status

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/pavnii6/team-task-manager.git
cd team-task-manager
```

---

### 2. Create `.env` file

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_EMAIL=your-email@gmail.com
```

---

### 3. Install & Run

```bash
npm install
npm run dev
```

👉 Open: http://localhost:5173

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

* Deployed on **Vercel** (frontend hosting)
* Deployed on **Railway** (optional deployment setup)

---

## 💡 Highlights

* Role-based access control implemented
* Row-Level Security (RLS) in Supabase
* Secure authentication system
* Real-time database operations
* Clean UI/UX design

---

## 🔮 Future Improvements

* Task priority levels
* Notifications & reminders
* Real-time collaboration
* File attachments in tasks

---

## 👩‍💻 Author

**Pavni Srivastava**

---

## ⭐ Acknowledgment

This project was built as part of a full-stack development assignment to demonstrate practical implementation of authentication, database management, and deployment.

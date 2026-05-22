# Team Task Manager

A full-stack web application for managing team projects and tasks with secure authentication, role-based access, and a modern dashboard UI.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## Project Description

**Team Task Manager** helps teams organize work in one place. Users can sign up, log in, create projects, assign tasks, and track progress from a responsive dashboard. The app uses JWT-based authentication and separates **Admin** and **Member** roles so project owners can control who sees and edits what.

Built as a **MERN-style** stack (MongoDB, Express, React, Node.js) with REST APIs and a React single-page application styled with Tailwind CSS.

---

## Features

| Feature | Description |
|--------|-------------|
| **User authentication** | Sign up, log in, and secure sessions with JWT |
| **Role-based access** | `admin` and `member` roles with protected routes |
| **Project management** | Create, view, update, and delete projects |
| **Task management** | Create tasks, set status, assign users, filter by project |
| **Dashboard** | Overview of tasks, statuses, and overdue items |
| **REST API** | Documented backend endpoints for auth, users, projects, and tasks |
| **Production-ready deploy** | Single deploy URL (API + React build) via Railway |

---

## Technologies Used

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Lucide React (icons)
- Fetch API (HTTP client)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- bcryptjs (password hashing)
- express-validator
- CORS

### DevOps & Tools
- Git & GitHub
- Railway (deployment)
- MongoDB Atlas (cloud database)
- npm

---

## Folder Structure

```text
team-task-manager/
├── backend/                 # Express API server
│   ├── middleware/          # JWT auth middleware
│   ├── models/              # Mongoose schemas (User, Project, Task)
│   ├── routes/              # API route handlers
│   ├── .env.example         # Backend environment template
│   ├── package.json
│   ├── seedData.js          # Optional sample data script
│   └── server.js            # App entry point
├── frontend/                # React client
│   ├── public/              # Static assets (index.html)
│   ├── src/
│   │   ├── components/      # Navbar, Toast, etc.
│   │   ├── context/         # AuthContext (global auth state)
│   │   ├── pages/           # Login, Signup, Dashboard, Projects, Tasks
│   │   └── utils/           # API helper (api.js)
│   ├── .env.example
│   └── package.json
├── package.json             # Root scripts (install, build, start)
├── railway.json             # Railway deployment config
├── Procfile                 # Process file for PaaS hosts
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (local install **or** free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- [Git](https://git-scm.com/)
- A [GitHub](https://github.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/team-task-manager.git
cd team-task-manager
```

### 2. Install dependencies

From the project root:

```bash
npm run install:all
```

Or install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure environment variables

**Backend** — copy the example file and edit values:

```bash
cd backend
copy .env.example .env    # Windows
# cp .env.example .env  # macOS / Linux
```

`backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_strong_secret_key_here
NODE_ENV=development
```

**Frontend** (optional for local dev — defaults to `http://localhost:5000/api`):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. (Optional) Seed sample data

With MongoDB running locally:

```bash
cd backend
node seedData.js
```

Sample accounts after seeding:

| Role   | Email            | Password   |
|--------|------------------|------------|
| Admin  | admin@test.com   | admin123   |
| Member | member@test.com  | member123  |

---

## Usage

### Run in development (two terminals)

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

API runs at `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

**Terminal 2 — Frontend:**

```bash
cd frontend
npm start
```

App opens at `http://localhost:3000`

### Build for production

```bash
npm run install:all
npm run build
npm start
```

The backend serves the React build and API on one port when `NODE_ENV=production`.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Log in and receive JWT |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/tasks` | List tasks (optional filters) |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id/assign` | Assign a task to a user |

All protected routes require header: `Authorization: Bearer <token>`

---

## Screenshots

Add screenshots to a `docs/screenshots/` folder in the repo, then update the paths below.

| Screen | Preview |
|--------|---------|
| Login | `![Login](docs/screenshots/login.png)` |
| Dashboard | `![Dashboard](docs/screenshots/dashboard.png)` |
| Projects | `![Projects](docs/screenshots/projects.png)` |
| Tasks | `![Tasks](docs/screenshots/tasks.png)` |

**How to add screenshots:**

1. Run the app locally.
2. Capture PNG images of each page.
3. Save them under `docs/screenshots/`.
4. Commit and push — GitHub will display them in this README.

---

## Deployment (Live URL)

1. Push this project to GitHub.
2. Create a MongoDB Atlas cluster and copy the connection string.
3. Deploy on [Railway](https://railway.app): **New Project** → **Deploy from GitHub repo**.
4. Set variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.
5. Use the Railway URL (e.g. `https://your-app.up.railway.app`) as your live link.

---

## Author

**Simran Jaiswal**

- Email: [jaiswalsimran08926@gmail.com](mailto:jaiswalsimran08926@gmail.com)
- GitHub: [@YOUR_GITHUB_USERNAME](https://github.com/YOUR_GITHUB_USERNAME)

---

## License

This project is licensed under the **ISC License**.

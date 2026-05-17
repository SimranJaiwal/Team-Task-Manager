# Team Task Manager

A full-stack web application for team project and task management with role-based access control.

## Features

- **Authentication**: User signup and login with JWT
- **Project Management**: Create and manage projects
- **Task Management**: Create, assign, and track tasks
- **Role-Based Access**: Admin and Member roles
- **Dashboard**: View tasks, status, and overdue items
- **Real-time Updates**: Track progress across teams

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- REST APIs

### Frontend
- React 18
- React Router
- TailwindCSS
- Lucide Icons

## Deployment (Live Link)

Deploy on [Railway](https://railway.app) for a single live URL (frontend + API):

1. Push this repo to GitHub (see below).
2. Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and copy the connection string.
3. On Railway: **New Project** → **Deploy from GitHub repo** → select this repository.
4. Add environment variables in Railway:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — a long random secret string
   - `NODE_ENV` — `production`
5. Railway will assign a public URL like `https://your-app.up.railway.app` — that is your live link.

## GitHub

```bash
git init
git add .
git commit -m "Initial commit: Team Task Manager"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and create an empty repo named `team-task-manager` on GitHub first.

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user

### Projects
- GET /api/projects - Get all projects
- POST /api/projects - Create new project
- GET /api/projects/:id - Get project by ID
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

### Tasks
- GET /api/tasks - Get all tasks
- POST /api/tasks - Create new task
- GET /api/tasks/:id - Get task by ID
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task
- PUT /api/tasks/:id/assign - Assign task to user
- PUT /api/tasks/:id/status - Update task status

## License

ISC

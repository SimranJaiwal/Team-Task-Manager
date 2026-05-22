================================================================================
                         TEAM TASK MANAGER
                    Professional Project Documentation
================================================================================

PROJECT NAME
------------
Team Task Manager


PROJECT DESCRIPTION
-------------------
Team Task Manager is a full-stack web application for team project and task
management. It allows users to register, log in securely, create projects,
assign tasks, and track work from a modern dashboard.

The application uses JWT authentication and role-based access control (Admin
and Member roles). It is built with the MERN stack: MongoDB, Express.js,
React, and Node.js.


FEATURES
--------
  * User Authentication     - Sign up, login, JWT-based sessions
  * Role-Based Access       - Admin and Member roles
  * Project Management      - Create, view, update, delete projects
  * Task Management         - Create, assign, update status, filter tasks
  * Dashboard               - Task overview, status tracking, overdue items
  * REST API                - Full backend API for auth, users, projects, tasks
  * Responsive UI           - React + Tailwind CSS interface
  * Production Deployment   - Single URL for frontend and API


TECHNOLOGIES USED
-----------------
Frontend:
  - React 18
  - React Router v6
  - Tailwind CSS
  - Lucide React (icons)
  - Fetch API

Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JSON Web Tokens (JWT)
  - bcryptjs
  - express-validator
  - CORS

Tools & Deployment:
  - Git and GitHub
  - Vercel / Railway / Netlify (hosting)
  - MongoDB Atlas (cloud database)
  - npm


INSTALLATION STEPS
------------------
Prerequisites:
  - Node.js v18 or newer
  - MongoDB (local or MongoDB Atlas)
  - Git

Step 1: Clone the repository
  git clone https://github.com/SimranJaiwal/Team-Task-Manager.git
  cd Team-Task-Manager

Step 2: Install dependencies
  npm run install:all

Step 3: Configure environment (backend/.env)
  PORT=5000
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_strong_secret_key
  NODE_ENV=development

Step 4: (Optional) Seed sample data
  cd backend
  node seedData.js

Sample accounts after seeding:
  Admin  - admin@test.com  / admin123
  Member - member@test.com / member123


USAGE INSTRUCTIONS
------------------
Development (two terminals):

  Terminal 1 - Backend:
    cd backend
    npm run dev
    API: http://localhost:5000
    Health: http://localhost:5000/api/health

  Terminal 2 - Frontend:
    cd frontend
    npm start
    App: http://localhost:3000

Production build (local):
  npm run install:all
  npm run build
  npm start

Main application pages:
  - Login and Signup
  - Dashboard (after login)
  - Projects management
  - Tasks management


DEPLOYMENT DETAILS
------------------
Live Application URL (verified):
  https://team-task-manager-orpin-alpha.vercel.app

  API Health Check:
  https://team-task-manager-orpin-alpha.vercel.app/api/health

  Note: Add MONGODB_URI and JWT_SECRET in Vercel Project Settings
  for login, signup, and database features to work fully.

GitHub Repository:
  https://github.com/SimranJaiwal/Team-Task-Manager

Deployment options:

  1. Vercel (recommended for GitHub integration)
     - Import repo from GitHub at https://vercel.com
     - Framework: Other
     - Build: npm run install:all && npm run build
     - Environment variables: MONGODB_URI, JWT_SECRET, NODE_ENV=production

  2. Railway
     - Connect GitHub repo at https://railway.app
     - Uses railway.json in the project root
     - Add MONGODB_URI, JWT_SECRET, NODE_ENV=production

  3. Netlify
     - Deploy frontend build; connect API to a hosted backend URL

  4. GitHub Pages
     - Static frontend only; requires separate API hosting

API health check endpoint:
  GET /api/health


AUTHOR INFORMATION
------------------
Name:   Simran Jaiswal
Email:  jaiswalsimran08926@gmail.com
GitHub: https://github.com/SimranJaiwal


LICENSE
-------
ISC License

================================================================================
Last updated: May 2026
================================================================================

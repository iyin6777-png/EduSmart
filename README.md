# EduSmart

EduSmart is a modern educational platform for secondary school and university students. It includes a polished landing page, secure student authentication, and a functional student dashboard built with React and an Express backend backed by SQLite.

## Features
- Royal blue, white, and purple design
- Responsive landing page and dashboard
- Student signup and login with secure password hashing
- Persistent SQLite database
- Dashboard with course overview, assignments, and academic performance
- Navigation to Home, My Courses, AI Tutor, CBT Practice, Past Questions, Assignments, Performance, and Profile

## Tech stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- Auth: bcrypt + JWT

## Quick start

1. Install dependencies:
   npm install

2. Start the app in development mode:
   npm run dev

3. Open the frontend in your browser:
   http://localhost:5173

The backend API runs on:
http://localhost:5000

## Production build

npm run build
npm run start

## Notes
- The app uses a persistent SQLite database stored in `backend/data/edusmart.db`.
- Default environment configuration is included in `backend/.env.example` and `frontend/.env.example`.

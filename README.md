# EduSmart

EduSmart is an educational platform for secondary school and university students. It includes a responsive landing page, student authentication, dashboard, and learning tools.

## Features
- Royal blue, white, and purple responsive interface
- Student signup and login with password hashing and JWT authentication
- SQLite persistence
- Dashboard, course library, AI Tutor study-support interface, CBT practice, past questions, assignments, performance, and profile sections

## Tech stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- Authentication: bcrypt + JWT

## Run locally
Requires Node.js 20 or later.

```sh
npm install
cp backend/.env.example backend/.env
```

Set a unique `JWT_SECRET` in `backend/.env`, then run:

```sh
npm run dev
```

Open http://localhost:5173. The backend health endpoint is http://localhost:5000/api/health.

Build the frontend with `npm run build`; run the production server with `npm start`.

## Deploy on Render
The repository includes `render.yaml` for a single Render web service. In Render, choose **New → Blueprint**, connect `iyin6777-png/EduSmart`, and apply the blueprint. Render installs the npm dependencies, builds the frontend, starts the Express service, and provisions a persistent disk for SQLite. The blueprint generates a JWT secret; do not commit real secrets to the repository.

After deployment, Render displays the public service URL. The same service hosts both the frontend and `/api` endpoints. Check `<your-service-url>/api/health` to verify the API is healthy.

A Render account and confirmation of the service creation are required to provision the public URL; this repository setup does not itself publish a live deployment.

## AI Tutor and learning content
The AI Tutor currently presents guided sample study material; it is not connected to an external AI provider. Course and activity content is sample content. Do not treat the sample course, exam, activity, assignment, or performance data as real student records.

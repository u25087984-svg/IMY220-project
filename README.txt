Momentum - Photo Sharing Website
IMY 220 - Deliverable 1

GitHub repo: https://github.com/u25087984-svg/IMY220-project

--------------------------------------------------
Project structure
--------------------------------------------------
frontend/   Vite + React app
  src/components   reusable components
  src/pages        page-level components
  src/assets       static assets
  public/images    served images (post images, profile pics)
backend/    Express server (server.js)

--------------------------------------------------
Running locally (without Docker)
--------------------------------------------------
Frontend:
  cd frontend
  npm install
  npm run dev

Backend:
  cd backend
  npm install
  npm start

--------------------------------------------------
Running with Docker
--------------------------------------------------
Build and run the frontend container:
  cd frontend
  docker build -t momentum-frontend .
  docker run -p 5173:5173 momentum-frontend

Build and run the backend container:
  cd backend
  docker build -t momentum-backend .
  docker run -p 3001:3001 momentum-backend

Then open http://localhost:5173 in a browser. Both containers must be
running at the same time for sign-in/sign-up to work.
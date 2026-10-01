Momentum - Photo Sharing Website
IMY 220 - Deliverable 2 (submission D3)

GitHub repo: https://github.com/u25087984-svg/IMY220-project

--------------------------------------------------
Project structure
--------------------------------------------------
frontend/   Vite + React + TailwindCSS app
backend/    Express + Mongoose API (MongoDB Atlas)
docker-compose.yml   runs both containers together

--------------------------------------------------
Database
--------------------------------------------------
MongoDB Atlas. The connection string is in backend/.env (MONGO_URI)
and in MONGO_CONNECTION.txt.
To reset/seed the database with sample data (2+ users, posts, album, friends):
  docker compose exec backend npm run seed

Demo logins (from the seed):
  @sarah  / Password123
  @john   / KrampusBiggest345
  @leanne / ILoveBananas24

--------------------------------------------------
Running with Docker (use these commands)
--------------------------------------------------
From the project root (the folder containing docker-compose.yml):

  docker compose up --build

Then open http://localhost:5173 in a browser.
The API runs on http://localhost:3001 (the frontend proxies /api to it).

Stop everything:
  docker compose down

--------------------------------------------------
Equivalent plain docker commands (without compose)
--------------------------------------------------
  docker network create momentum-net
  docker build -t momentum-backend ./backend
  docker build -t momentum-frontend ./frontend
  docker run -d --name backend --network momentum-net --env-file ./backend/.env -p 3001:3001 momentum-backend
  docker run -d --name frontend --network momentum-net -e VITE_API_TARGET=http://backend:3001 -p 5173:5173 momentum-frontend
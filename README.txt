MOMENTUM - IMY 220 PROJECT

TEST ACCOUNTS
- Standard User: test@test.com / test1234
- Admin User: admin@test.com / admin1234

HOW TO RUN
1. Ensure Docker Desktop is running.
2. Open a terminal in the root directory of this project.
3. Run: docker compose up --build
4. Open http://localhost:5173 in your browser.

DATABASE CONNECTION STRING
mongodb+srv://simonvogel365_db_user:n1ZudXLc1BHw9J91@cluster0.wgacw4d.mongodb.net/?appName=Cluster0

DIRECTORY STRUCTURE
/backend       -> Node.js/Express API, Mongoose models, routes, and database connection.
/frontend      -> React/Vite frontend, Tailwind CSS styling, and UI components.
docker-compose.yml -> Orchestrates the frontend and backend containers.
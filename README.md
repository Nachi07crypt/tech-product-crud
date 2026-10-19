# Tech Product Showcase - Single-Table CRUD (Node.js + Express + SQLite)

Resource: `products` | Table: `products`

## Run locally
    cd backend
    npm install
    npm start
Open http://localhost:3000 (the frontend is served by Express).

## Endpoints
| Method | URL | Purpose |
|---|---|---|
| GET | /api/products | List all |
| GET | /api/products/:id | Get one |
| POST | /api/products | Create |
| PUT | /api/products/:id | Update |
| DELETE | /api/products/:id | Delete |

Sample body (POST/PUT):
    {"product_name":"Surface Pro 9","brand":"Microsoft","category":"Tablet","price":999,"stock":10,"description":"13-inch 2-in-1"}

## Deploy (Render.com)
1. Push the project to GitHub.
2. New > Web Service > connect repo. Root Directory: `backend`. Build: `npm install`. Start: `npm start`.
3. Add env vars: `PORT=3000`, `DB_FILE=./products.db` (add a Persistent Disk and use e.g. `/var/data/products.db` if you need data to survive redeploys; otherwise it reseeds on restart).
4. Your API links: `https://<your-app>.onrender.com/api/products` (and `/:id`), frontend at the root URL.

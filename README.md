# Movie Watchlist - Backend

Express + MongoDB API for the Fullstack Movie Watchlist exam.

## Live Link

- Backend: https://svexam-backend-production-b40e.up.railway.app

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/movies` | Get all movies |
| POST | `/movies` | Add a new movie |
| DELETE | `/movies/:id` | Delete a movie by id |
| GET | `/movies/search?name=` | Search movies by title |
| POST | `/movies/generate` | Generate description with Google Gemini (free) |

## Local Setup

```bash
npm install
cp .env.example .env
npm start
```

Required environment variables:

- `MONGO_URI` - MongoDB connection string
- `GEMINI_API_KEY` - Free key from https://aistudio.google.com/apikey
- `PORT` - optional, defaults to `3000`

## AI Usage

AI was used with Cursor to scaffold the Express routes, MongoDB schema, and the `/movies/generate` endpoint with Google Gemini free API.

## Frontend

- Frontend repo: https://github.com/rashacanada25-hue/svExam-frontend
- Frontend live: https://frontend-umber-psi-57.vercel.app

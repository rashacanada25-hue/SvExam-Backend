# Movie Watchlist - Backend

Express + MongoDB API for the Fullstack Movie Watchlist exam.

## Live Link

- Backend: _(add your deployed URL here, e.g. Render/Railway)_

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/movies` | Get all movies |
| POST | `/movies` | Add a new movie |
| DELETE | `/movies/:id` | Delete a movie by id |
| GET | `/movies/search?name=` | Search movies by title |
| POST | `/movies/generate` | Generate description with Vercel AI Gateway |

## Local Setup

```bash
npm install
cp .env.example .env
npm start
```

Required environment variables:

- `MONGO_URI` - MongoDB connection string
- `AI_GATEWAY_API_KEY` - Vercel AI Gateway key for `/movies/generate`
- `PORT` - optional, defaults to `3000`

## AI Usage

AI was used with Cursor to scaffold the Express routes, MongoDB schema, and the `/movies/generate` endpoint integration with Vercel AI Gateway.

## Frontend

- Frontend repo: _(add GitHub link)_
- Frontend live: _(add Vercel URL)_

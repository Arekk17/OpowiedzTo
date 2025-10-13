# OpowiedzTo – Share Your Story (Monorepo: API + Web)

OpowiedzTo is a storytelling platform where people can post short, anonymous or signed stories, react with likes, and discuss via comments. The project is split into two apps inside a single repository:

- opowiedzto-api: NestJS (Node) backend with PostgreSQL
- web: Next.js frontend (App Router)

## Features

- Create and browse stories with tags
- Like/unlike posts
- Comment on posts (with basic moderation support)
- Author profiles and avatars
- Cursor-based feed (infinite scroll friendly)
- Optimized performance for the main feed (denormalized counters, SSR, lazy loading)

## Tech Stack

- Backend: NestJS, TypeORM, PostgreSQL
- Frontend: Next.js (React), Tailwind CSS, React Query
- Tooling: Docker Compose (dev), ESLint, Prettier, Vitest (web)

## Repository Structure

```
/ (repo root)
├── opowiedzto-api/      # NestJS backend
├── web/                 # Next.js frontend
├── docker-compose.dev.yml
└── README.md
```

## Quick Start (Docker – recommended)

From the repository root:

```bash
docker compose -f ./docker-compose.dev.yml up -d --build
```

Services and ports:

- Frontend: http://localhost:3000
- API: http://localhost:3001
- pgAdmin: http://localhost:5050 (login: admin@admin.com, password: admin)

### Optional: Reseed the Database

Resets posts/likes/comments and repopulates with seed data:

```bash
docker exec opowiedzto-db-dev psql -U postgres -d opowiedzto -c "TRUNCATE TABLE post_likes, comments, post_tags, posts RESTART IDENTITY CASCADE;"
docker restart opowiedzto-api-dev
```

## Environment Configuration

- API reads env from `opowiedzto-api/.env`
- Frontend uses `NEXT_PUBLIC_API_URL` to call the API

Examples:

```
# opowiedzto-api/.env
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=opowiedzto
JWT_SECRET=changeme
```

```
# web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Local Development (without Docker)

Backend:

```bash
cd opowiedzto-api
npm install
npm run start:dev
```

Frontend:

```bash
cd web
npm install
npm run dev
```

## Architecture Highlights

- Denormalized counters on posts (`likesCount`, `commentsCount`)
  - Updated on like/unlike and comment create/delete
  - Eliminates N+1 queries on the feed; enables fast sort by popularity/comments
- Lean feed payload
  - Feed does not include `latestComments`
  - Latest 3 comments are fetched on demand: `GET /posts/:id/comments?limit=3`
  - Prefetch in UI on hover/focus to hide latency (React Query)
- Frontend performance
  - SSR for the main feed, short revalidate for public data
  - Image optimization via Next Image (where applicable)
- API performance
  - Gzip/Brotli compression recommended (compression middleware)
  - Short cache headers for public listing endpoints

## Key API Endpoints

- `GET /posts` – cursor-based list (sort: newest/popular/most_commented)
- `GET /posts/:id` – post details
- `POST /posts/:id/like` / `DELETE /posts/:id/unlike`
- `GET /posts/:id/comments?limit=3` – latest comments (preview)
- `GET /posts/:id/comments` – full comment list

## Testing

- Frontend: Vitest + Testing Library
- Backend: add unit/e2e tests as needed (recommended for services/repositories)

## Troubleshooting

- Container name conflicts:
  ```bash
  docker compose -f ./docker-compose.dev.yml down
  docker compose -f ./docker-compose.dev.yml up -d --build
  ```
- No data after start:
  - Check API logs: `docker logs -n 200 opowiedzto-api-dev`
  - Run the reseed steps above
- Frontend cannot reach the API:
  - Verify `NEXT_PUBLIC_API_URL` (should point to `http://localhost:3001` in dev)

## License

Internal project – all rights reserved.

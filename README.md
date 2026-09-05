# MediXa Chat — Standalone React Frontend

Production-oriented extraction of the MediXa authentication + AI Chat/RAG UI.

## Scope

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Session bootstrap: `GET /api/auth/me`
- Conversations: `/api/Chatting/conversations`
- WebSocket namespace: `/chatting`
- Socket events: `chat.connection.ready`, `chat:request.succeeded`, `chat:request.failed`
- React + TypeScript + MUI + TanStack Query + Axios + Socket.IO

Everything unrelated to Auth and Chat/RAG from the original MediXa frontend has been removed.

## Local production-backend test

Run the provided Nest backend on port `4000`, then:

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` and `/socket.io` to `http://localhost:4000`, so the browser uses the same origin and WebSocket behavior is close to production.

To point dev at another backend:

```env
VITE_DEV_BACKEND_URL=http://192.168.1.10:4000
```

## Production build

Default production configuration expects one public origin with Nginx routing `/api/` and `/socket.io/` to Nest:

```bash
npm ci
npm run typecheck
npm run build
```

Output: `dist/`

If frontend and API are on different public origins, build with:

```env
VITE_API_BASE_URL=https://api.example.com/api
VITE_SOCKET_BASE_URL=https://api.example.com
```

The Nest backend already enables CORS, but in production you should restrict its `origin` rather than leaving `origin: true`.

## Reproducible Node/npm versions

The Docker build is pinned to `node:22.16.0-alpine` (npm `10.9.2`) instead of the floating `node:22-alpine` tag. This avoids npm lockfile validation differences across newer Node image revisions and keeps `npm ci` deterministic.

If you install locally, use Node `22.16.x` with npm `10.9.x` (the project declares these in `package.json`).

## Docker

For the easiest production-like test, keep the Nest backend running on host port `4000`, then run:

```bash
docker compose -f docker-compose.prod-test.yml up --build
```

Open `http://localhost:8080`. The Nginx container serves the compiled SPA and proxies both `/api/` and `/socket.io/` to the backend, which tests the same-origin production topology instead of Vite dev behavior.

For a normal container build:

```bash
docker build -t medixa-chat-web .
docker run --rm -p 8080:80 --add-host=host.docker.internal:host-gateway \
  -e BACKEND_UPSTREAM=http://host.docker.internal:4000 medixa-chat-web
```

For deployment, set `BACKEND_UPSTREAM` to the backend address reachable from the frontend container. `deploy/reverse-proxy.example.conf` is also included if you prefer routing at an outer Nginx layer.

## Auth design note

The supplied standalone backend issues only an access token and has no refresh-token or cookie session endpoint. This frontend therefore stores the access token in `localStorage`, sends it as `Authorization: Bearer ...`, validates it with `/auth/me` on startup, and clears it on HTTP 401. If the backend later adds HttpOnly secure cookies/refresh tokens, migrating auth storage to that mechanism is recommended.

## Chat reliability

The UI uses WebSocket for immediate completion events. It does **not** make message sending depend on the socket connection: while a request is `PROCESSING`, TanStack Query polls the conversation every 2.5s as a fallback. This prevents a temporary WebSocket outage from leaving the UI permanently stuck.

## Quality gates

```bash
npm run typecheck
npm run lint
npm run build
```


## Docker / npm note

The production-test Docker image intentionally uses `npm install --include=optional` instead of `npm ci`. Vite 8 uses Rolldown native/optional platform bindings, and a lock file generated on Windows or a different libc platform can omit WASI/EMNAPI optional entries that `npm ci` validates on Alpine. Running the install inside the Alpine build stage resolves the correct platform bindings while still using the committed lock file for compatible versions.

## Chat rendering behavior

Sending a question does not refetch/reset the full messages or conversations lists. The UI appends only the new local PROCESSING turn, patches that same turn when the Socket.IO result arrives, and uses `GET /api/Chatting/requests/:ragRequestId` only as a single-request fallback. This avoids full-list flicker/reload while waiting for RAG responses.

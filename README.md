# Changelog & Product Updates Widget

A full-stack MERN application for publishing and consuming product updates — similar in concept to Headway or Beamer. Built as a technical assessment project.

## Overview

Admins write release notes in Markdown from a split-screen editor with live preview. Once published, releases appear on a public timeline, are searchable, filterable by category, exposed through a public JSON feed, and surface to logged-in users via an in-app "What's New" bell with a live unread count.

## Features

- Admin Markdown publishing studio (split-screen editor + live preview)
- Public changelog/release timeline, newest first
- In-app "What's New" notification drawer with unread badge
- Emoji reactions (❤️ 🎉 🚀), one per user per changelog, changeable
- Category filter (New / Improved / Fixed) and debounced search
- Public JSON feed (`/api/v1/changelog/feed`)
- Secure JWT auth: short-lived access token + rotating refresh token, both in httpOnly cookies
- Admin authorization enforced server-side, never trusted from the client

## Technology Stack

**Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS, react-markdown + remark-gfm (GitHub-flavored Markdown), DOMPurify, Lucide icons.
Chosen for a fast dev loop (Vite), predictable client-side routing, and because react-markdown renders to React elements rather than raw HTML strings — avoiding `dangerouslySetInnerHTML` entirely.

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, cors, multer, express-validator, helmet, express-rate-limit, express-mongo-sanitize.
Express keeps the assessment's architecture easy to explain (routes → controllers → services → models). Mongoose gives schema validation and indexing without hand-rolled query building.

## Architecture

```
client (React SPA)  <-- axios, httpOnly cookies -->  server (Express REST API)  <--Mongoose-->  MongoDB
```

Backend layering: **routes** (wiring + validation) → **controllers** (HTTP concerns) → **services** (business logic: tokens, notifications, email) → **models** (schema/persistence). No business logic lives inside route files.

## Project Structure

```
client/   React frontend (components, pages, layouts, hooks, context, services)
server/   Express backend (controllers, services, models, routes, middleware, validators)
postman/  Postman collection
```

See the full tree in the repository — it mirrors the spec's Section 2 layout exactly.

## Database Schema

- **User** — name, email, password (bcrypt hash), role (`user`/`admin`), isEmailVerified, lastViewedChangelogDate
- **RefreshToken** — userId, tokenHash (SHA-256, never raw), expiresAt (TTL-indexed), revoked
- **Changelog** — title, slug (unique), contentMarkdown, category, coverImage, status, publishedAt, createdBy. Indexes: `slug` unique, `{status,publishedAt}`, `category`, text index on `title`+`contentMarkdown`.
- **Reaction** — userId, changelogId, type. Unique compound index on `{userId, changelogId}` — see Design Decisions.
- **PasswordResetToken** / **EmailVerificationToken** — userId, tokenHash, expiresAt (TTL), used.

## Authentication

- Access token: JWT, 15 min, httpOnly cookie, path `/`.
- Refresh token: random 32-byte token, 7 days, httpOnly cookie scoped to `/api/v1/auth`. Only its SHA-256 hash is stored in MongoDB.
- **Rotation:** every `/auth/refresh` call revokes the old refresh token and issues a new one. A reused/revoked token is rejected, forcing re-login — this limits the blast radius of a stolen refresh cookie.
- Frontend axios interceptor: on a 401 it calls `/auth/refresh` once, retries the original request, and only logs the user out if the refresh itself fails (no infinite loop).
- Email verification and password reset are **simulated** — no real email is sent. In development, the API response includes a `devVerificationUrl` / `devResetUrl` field, and the action is also logged to the server console.

## API Documentation

Full endpoint list is in Section 28 of the original spec and mirrored 1:1 in `postman/Changelog-API.postman_collection.json`. Summary:

| Area | Base path |
|---|---|
| Auth | `/api/v1/auth` |
| Public changelog | `/api/v1/changelog` |
| Admin changelog | `/api/v1/admin/changelogs` |
| Notifications | `/api/v1/notifications` |
| Uploads | `/api/v1/uploads` |

All responses use `{ success, data, message }` (success) or `{ success: false, message, errors }` (error).

## Environment Variables

See `server/.env.example`. Copy it to `server/.env` and fill in real secrets before running in anything other than local dev.

## Installation

```bash
# backend
cd server
npm install
cp .env.example .env   # edit values as needed

# frontend
cd ../client
npm install
```

## Running Locally

Requires a local or Atlas MongoDB instance.

```bash
# terminal 1
cd server
npm run dev        # http://localhost:5000

# terminal 2
cd client
npm run dev         # http://localhost:5173
```

## Seed Database

```bash
cd server
npm run seed
```

Creates 1 admin, 2 users, and 9 changelogs (7 published across different dates, 2 drafts), plus a few sample reactions.

- Admin: `admin@example.com` / `Admin@12345`
- User: `alice@example.com` / `User@12345`
- User: `bob@example.com` / `User@12345` (has `lastViewedChangelogDate` pre-set, so their unread badge starts non-zero)

## Postman Collection

Import `postman/Changelog-API.postman_collection.json`. Set the `baseUrl` variable if not running on the default port. Since auth uses httpOnly cookies, Postman's cookie jar handles the session automatically after `Login`.

## Security

- httpOnly + `secure` (in production) + `sameSite` cookies for both tokens
- bcrypt password hashing (cost factor 12)
- Refresh-token rotation and revocation, TTL-indexed so expired tokens self-clean
- Centralized input validation (express-validator) on every mutating route
- `authenticateUser` + `requireAdmin` middleware — role is always read from the DB via the token, never trusted from the request body
- Helmet, CORS locked to `CLIENT_URL`, rate limiting on auth endpoints
- `express-mongo-sanitize` strips `$`/`.` keys against NoSQL injection
- Markdown is rendered via `react-markdown` (no raw HTML injection) with DOMPurify as defense in depth
- Multer validates file type (jpg/jpeg/png/webp) and size (5MB) before saving to disk; only the file path is stored in MongoDB

## Design Decisions

1. **Reaction model:** one reaction per user per changelog (`{userId, changelogId}` unique index), changeable rather than additive. This matches the assessment's example response shape (`"userReaction": "heart"` — singular) more naturally than letting one user stack all three reactions.
2. **Unread algorithm default:** a user with `lastViewedChangelogDate = null` (brand new account) sees **all currently published releases as unread**, rather than starting at zero. This is simpler to reason about and matches how Headway/Beamer-style widgets greet first-time visitors.
3. **Search strategy:** MongoDB text index on `title` + `contentMarkdown`. At assessment scale this is simpler than regex scanning and gives relevance-ranked results for free; a production system with heavier text-search needs might move to Atlas Search or Elasticsearch.
4. **Image storage:** local disk via multer for this assessment, but the controller only ever returns/stores a path string — swapping in Cloudinary/S3 later only touches `upload.routes.js` + `upload.controller.js`.

## Assumptions

- A single admin role is sufficient (no super-admin/editor distinction).
- "Recent" in the notification drawer means the 10 most-recently-published releases, not literally "unread only."
- Cover images are optional.

## Limitations

- Email delivery is simulated, not real (by design, per the assessment brief).
- No image resizing/CDN — local disk storage only.
- No real-time push for the unread badge (it's fetched on load/mark-read, not via WebSocket).

## Future Improvements

- WebSocket/SSE push for live unread-count updates across tabs
- Cloudinary/S3 image storage
- Role-based team management (multiple admins/editors)
- Rich-text editor toolbar on top of the raw Markdown textarea

## Screenshots

_Add screenshots here after running the app locally (public timeline, admin dashboard, markdown editor, notification drawer)._

## Deployment

- **Backend:** any Node host (Render/Railway/EC2). Set all `server/.env.example` variables, especially strong `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET`, `NODE_ENV=production`, and a real `MONGO_URI` (e.g. Atlas).
- **Frontend:** `npm run build` in `client/`, deploy the `dist/` folder to any static host (Vercel/Netlify), pointing `CLIENT_URL`/API base at the deployed backend and enabling CORS for that origin.

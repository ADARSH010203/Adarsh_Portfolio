Next.js + Tailwind + shadcn (TypeScript)

This repository is a full-stack Next.js (App Router) project built with TypeScript, Tailwind CSS, and shadcn-style UI components. It includes a small Prisma schema (SQLite by default), authentication-ready patterns (next-auth mentioned in dependencies), and a component-driven frontend structure.

This README documents the project purpose, repository layout, development and production setup, database steps, and contribution guidance so you can run, develop, and deploy the project.

---

## Table of contents

- Project overview
- Features and tech stack
- Repository structure
- Requirements
- Setup (local development)
- Environment variables
- Database / Prisma
- Development scripts
- Build & production
- Deployment notes (Vercel / Docker / bun)
- Testing
- Useful files and locations
- Contributing
- License

---

## Project overview

This project is a starter application combining:

- Next.js (App Router) for file-system routed pages and server components
- Tailwind CSS for utility-first styling (configured via tailwind.config.ts)
- shadcn-style component patterns using Radix UI primitives and Tailwind
- Prisma ORM for database access (schema in `prisma/schema.prisma` — models: User, Post, ContactMessage)
- NextAuth (dependency present) to support authentication flows if configured

The app is structured for rapid development and component-driven UI composition. It targets modern Node / Next environments and is configured to produce a standalone build for production.

---

## Features and tech stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS (v4) and tailwind-merge utilities
- shadcn-like component structure (Radix + Tailwind)
- Prisma ORM (SQLite by default)
- next-auth (auth patterns available)
- Optional bun usage for running the standalone production server
- Dev tooling: ESLint

---

## Repository structure (important files & folders)

- [src/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/src) — application source
  - [src/app/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/src/app) — Next.js App Router entry, layout and pages
  - [src/components/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/src/components) — UI components
  - [src/hooks/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/src/hooks) — custom hooks
  - [src/lib/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/src/lib) — helpers and libraries
- [prisma/schema.prisma](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/prisma/schema.prisma) — Prisma schema (models: ContactMessage, User, Post)
- [package.json](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/package.json) — scripts & dependencies
- [next.config.ts](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/next.config.ts) — Next.js configuration
- [public/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/public) — static assets
- [.env] — (not committed) environment variables for local and production
- [tests/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/tests) — test files (if present)

---

## Requirements

- Node.js (use a recent LTS that is compatible with Next 16 / React 19)
- npm (this repo contains package-lock.json)
- Optional: bun (used by the `start` script for production in package.json)
- SQLite (no separate server required) or other DB if you change `DATABASE_URL`

---

## Setup (local development)

1. Clone the repository and install dependencies:

   npm install

2. Create a `.env` file in the project root. See the Environment variables section below for recommended values.

3. Prisma: generate client and push schema (creates SQLite DB file when using file URL):

   npm run db:generate
   npm run db:push

4. Start development server:

   npm run dev

   The dev server listens at http://localhost:3000 by default.

---

## Environment variables

Create a `.env` file in the project root with at least the following variables for local development. Do not commit secrets to Git.

Example `.env` (development):

DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a_long_random_secret_here"

Additional environment variables may be required depending on the features you enable (OAuth provider keys, analytics keys, environment-specific flags, etc.).

---

## Database & Prisma

Prisma schema: [prisma/schema.prisma](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/prisma/schema.prisma)

Key commands (available via package.json scripts):

- npm run db:generate — Generate Prisma client (required after schema changes)
- npm run db:push — Push schema to the database (creates or updates tables; accepts data loss flag in script)
- npm run db:migrate — Run migrations (if you adopt migration workflow)
- npm run db:reset — Reset migrations (use with caution)

Default models in schema.prisma include:

- ContactMessage — fields: id, name, email, subject, message, read, createdAt
- User — fields: id, email, name, createdAt, updatedAt
- Post — fields: id, title, content, published, authorId, createdAt, updatedAt

If you change the datasource to PostgreSQL, MySQL, or another provider, set DATABASE_URL accordingly in `.env` and run the appropriate migration commands.

---

## Development scripts (quick reference)

Scripts defined in package.json:

- npm run dev — Start Next.js dev server (Next App Router)
- npm run build — Build production artifacts (also prepares a standalone folder)
- npm start — Run the standalone server (package.json uses `bun .next/standalone/server.js`)
- npm run lint — Run ESLint
- npm run db:generate — prisma generate
- npm run db:push — prisma db push --accept-data-loss
- npm run db:migrate — prisma migrate dev
- npm run db:reset — prisma migrate reset

Notes:
- Development uses the standard Next dev server. The `build` step creates a standalone production bundle (see `build` script). The `start` script prefers `bun` to run the bundled server; if bun is not installed, use `node` to run the standalone server as shown below.

---

## Build & production

1. Build the app:

   npm run build

2. Run the standalone server:

   npm start

If you do not have bun installed, run with node directly (example):

   NODE_ENV=production node .next/standalone/server.js

The standalone output includes static files and a small Node server to host the app.

---

## Deployment notes

Vercel
- Recommended and easiest for Next.js projects. Create a Vercel project and connect the repository. Set environment variables in Vercel dashboard (DATABASE_URL, NEXTAUTH_SECRET, etc.). Vercel supports App Router features.

Docker (example workflow)
- Build the app and run the standalone server inside a Node or bun-based image. Ensure env vars and database host/volume are configured for production.

bun
- package.json's `start` script uses bun to start the prepared standalone server. bun is optional; Node works as well.

Database
- For production use, consider switching from SQLite to PostgreSQL or MySQL. Update `DATABASE_URL` and migrate schema with Prisma.

---

## Testing

- Tests are located under `tests/` if present. There is no `test` script in package.json by default — configure your preferred test runner (Jest, Vitest, etc.) and add scripts for running tests.

---

## Useful files and where to look

- [src/app/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/src/app) — main application routes, layout, global CSS
- [src/components/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/src/components) — reusable UI components
- [prisma/schema.prisma](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/prisma/schema.prisma) — DB model definitions
- [next.config.ts](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/next.config.ts) — Next runtime configuration
- [tailwind.config.ts](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/tailwind.config.ts) — Tailwind configuration
- [public/](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/public) — static assets

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork and create a feature branch
2. Add or update code and tests
3. Run linting and local tests
4. Open a pull request describing the changes

If you want help documenting a specific area of the project (a complex component, API route, or Prisma usage), describe the area and an example will be added to the README or separate docs.

---

## License

If this project should be open-sourced, add a LICENSE file at the repository root describing the chosen license (MIT, Apache-2.0, etc.). Currently no license file is present in this repository.

---

If you'd like, I can also:
- Add a `README-DEV.md` with extended developer notes and examples for common tasks
- Add a `.env.example` file with recommended environment variables
- Generate a short `docs/` folder describing how to use each major component under `src/components/`

Tell me which additions you prefer and I will update the repository accordingly.

## Requirements

- Node.js (compatible with Next 16 / React 19)
- npm (repo includes package-lock.json)
- (Optional) bun — `start` script in package.json uses `bun` to run the standalone server. Development works with `npm`/`node`.

Recommended versions: use a recent LTS Node that supports the used Next.js version. If you prefer bun for production start, install bun separately.

---

## Setup (local)

1. Dependencies install:

   npm install

2. Environment variables:

   - Create a `.env` file in the project root. Minimal recommended variables:
     - DATABASE_URL — e.g. `file:./dev.db` (since prisma datasource in schema.prisma uses sqlite)
     - NEXTAUTH_URL — your app URL for next-auth if used (e.g. `http://localhost:3000`)
     - NEXTAUTH_SECRET — secret for next-auth (random string)

   Example (local development):

   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="change_this_to_a_secure_random_value"
   ```

   NOTE: Do not commit secrets to git.

3. Prisma setup (generate client + push migrations / create DB):

   - Generate Prisma client:

     npm run db:generate

   - Push schema to DB (for SQLite this creates the file specified by DATABASE_URL):

     npm run db:push

   - Optional: run migrations (if you manage migrations):

     npm run db:migrate

---

## Development

- Start development server (Next.js dev server):

  npm run dev

  Server runs at http://localhost:3000 by default.

- Linting:

  npm run lint

---

## Build & Production

- Build:

  npm run build

  This prepares a standalone production build (see package.json `build` script).

- Start production server:

  npm start

  Note: `npm start` in this project uses `bun` to execute the standalone server (see package.json). If bun is not available, you can run the standalone server with node directly (example path may vary):

  ```bash
  NODE_ENV=production node .next/standalone/server.js
  ```

---

## Database & Prisma

- Prisma schema: [prisma/schema.prisma](C:/Users/adars/Downloads/Adarsh Porfolio.worktrees/create-readme-for-file/prisma/schema.prisma)
- Commands:
  - `npm run db:generate` — generate Prisma client
  - `npm run db:push` — push schema to the database (accepts data loss flag in package.json)
  - `npm run db:migrate` — run migrations
  - `npm run db:reset` — reset migrations (use carefully)

The default datasource in `schema.prisma` is SQLite and expects `DATABASE_URL` to point to a file (e.g., `file:./dev.db`).

---

## Testing

- Tests directory exists at `tests/`. Run tests according to the testing tools configured locally (no test script defined in package.json — add or run directly with your test runner).

---

## Notes and Helpful Links

- Project uses Next.js App Router (see `src/app/`)
- UI components are organized under `src/components/`
- If you use next-auth or any OAuth provider, make sure to set provider credentials in the `.env` securely.

---

## Contributing

1. Fork the repository / create a branch
2. Make changes and add tests where appropriate
3. Run linting and tests
4. Open a PR describing changes

---

## License

Include a license file if needed. This repo currently has no explicit license file — add `LICENSE` if you want to make licensing explicit.

---


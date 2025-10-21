# Monorepo Starter: Web + API

This repository bootstraps a modern JavaScript/TypeScript monorepo for a Web client and an API server. It uses npm workspaces to manage dependencies and scripts across packages and sets up shared tooling and conventions.

## Tech Stack

- Node.js (LTS) and npm workspaces
- Web (planned): Next.js + React + TypeScript
- API (planned): Node.js + Express/Fastify + TypeScript
- Database: MongoDB
- Auth: JWT (access + refresh tokens)

You can swap frameworks as needed — the structure and scripts are framework-agnostic.

## Repository Structure

- /web — Frontend application (Next.js/React recommended)
- /api — Backend application (Express/Fastify recommended)
- /README.md — This documentation
- /.env.example — Shared environment variables for local development
- /.editorconfig — Editor defaults
- /.gitignore — Common ignore rules
- /.nvmrc — Node.js version used by the repo
- /CONTRIBUTING.md — Contribution guidelines
- /LICENSE — License placeholder
- /package.json — Root package.json with workspace and orchestration scripts

## Getting Started

Prerequisites:
- Node.js LTS (see .nvmrc) and npm 10+
- MongoDB (local or in Docker/Atlas)

1) Use the correct Node version

- With nvm: `nvm use`
- Or install the version in `.nvmrc`

2) Install dependencies

At the monorepo root:

- `npm install`

3) Configure environment variables

- Copy `.env.example` to `.env` at the repository root and adjust values.
- You may also create service-specific .env files inside `/api` and `/web` as your implementation evolves. The shared example covers the common variables both services typically need.

4) Run scripts

- Run all workspace dev scripts: `npm run dev`
- Run a single workspace script:
  - Web: `npm run dev -w web`
  - API: `npm run dev -w api`

Additional commands:
- Lint all workspaces: `npm run lint`
- Test all workspaces: `npm run test`
- Build all workspaces: `npm run build`

Note: The initial scripts are placeholders so you can wire in your chosen frameworks without breaking root commands.

## Adding Dependencies

- Add a dependency to the API workspace: `npm i -w api <pkg>`
- Add a dependency to the Web workspace: `npm i -w web <pkg>`
- Add a dev dependency to both: `npm i -D -w api -w web <pkg>`

## Environment Variables

See `.env.example` for shared variables used by both services (MongoDB URI, JWT secrets, URLs, etc.). Each service can read from the root `.env` or from their own per-service `.env` files.

## Database Models & Seeding (API)

This repo includes Mongoose models and a seed script in the API workspace to bootstrap sample data for local or staging environments.

Models:
- User (with roles: candidate, employer, admin)
- Profile (1:1 with User)
- EmployerOrg (organizations/employers)
- Job (belongs to EmployerOrg; created by a User)
- Application (User applies to Job)
- Message (between users, optionally linked to Job/Application/Org)

Indexes and relationships are defined in the schemas (email uniqueness, 2dsphere geolocation, region and skills indexes, etc.).

How to run the seed script:
1) Configure your MongoDB connection
- Copy `.env.example` to `.env` at the repo root and set `MONGODB_URI` (and optionally `MONGODB_DB_NAME`).

2) Install dependencies (from monorepo root)
- `npm install`

3) Run the seed script
- Locally: `npm run seed -w api`
- Staging: `npm run seed:staging -w api` (ensure your staging `MONGODB_URI` is available to the process)

The seed script will:
- Ensure indexes are in place
- Remove any previous seed data (documents labeled `isSeedData: true`)
- Insert sample users, profiles, organizations, jobs, applications, and messages (plus org testimonials)
- Run simple assertions to validate that counts and key indexes (e.g., User.email unique, Job.location 2dsphere) exist

Verification examples (automatically performed by the script):
- At least 5 users, 2 profiles, 2 orgs, 3 jobs, 2 applications, and 2 messages are seeded
- Unique index on `User.email`
- 2dsphere index on `Job.location`

Note: The seed script is idempotent with respect to seed data and will only remove/replace documents marked with `isSeedData: true`.

## Contributing

Please review `CONTRIBUTING.md` for branching, commit conventions, and development workflow.

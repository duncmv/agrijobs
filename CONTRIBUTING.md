# Contributing

Thanks for your interest in contributing!

This repository is a monorepo managed with npm workspaces containing two applications:
- `web` — frontend (Next.js/React recommended)
- `api` — backend (Express/Fastify recommended)

## Prerequisites
- Node.js LTS (see `.nvmrc`) and npm 10+
- MongoDB for local development (or a remote instance)

Use `nvm use` to switch to the correct Node version.

## Getting Started
1) Install dependencies at the repo root:

```
npm install
```

2) Set up environment variables by copying `.env.example` to `.env` and adjusting values. You can also create service-specific `.env` files inside `/api` and `/web` if needed.

3) Run the dev scripts:

- All workspaces: `npm run dev`
- Web only: `npm run dev -w web`
- API only: `npm run dev -w api`

## Common Scripts
- Lint all: `npm run lint`
- Test all: `npm run test`
- Build all: `npm run build`
- Clean artifacts: `npm run clean`

## Adding Dependencies
- API only: `npm i -w api <pkg>`
- Web only: `npm i -w web <pkg>`
- Both: `npm i -D -w api -w web <pkg>`

## Branching and PRs
- Create feature branches from the default branch (e.g., `feat/…`, `fix/…`, `chore/…`).
- Keep PRs small, focused, and with clear descriptions.
- Include screenshots or logs when helpful.

## Commit Messages
Use Conventional Commits to improve readability and automate changelogs:

- `feat: add user profile page`
- `fix(api): handle missing JWT`
- `chore(web): upgrade next to 14.x`
- `docs: update README with setup notes`

## Code Style
- Follow the project’s `.editorconfig`.
- Configure linters/formatters per workspace as they are introduced (ESLint, Prettier, etc.).

## Testing
- Add unit/integration tests per workspace and wire them to `npm test`.

## Releases
- Add your chosen release strategy and tooling (e.g., Changesets, semantic-release) when ready.

Thanks again for contributing!

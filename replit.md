# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **gdscript-quest** (web, root `/`) — Mobile-first, gamified GDScript (Godot Engine) learning app. Mimo-style learning path with 5 chapters, interactive slide deck (info, code, multiple choice, fill-in-the-blank, drag-and-drop, code practice), XP/coins counters, syntax-highlighted GDScript code blocks, localStorage progress persistence, and a UPI Support Me button. Frontend-only (no backend, no API). Curriculum lives in `src/data/curriculum.ts`. Game state hook: `src/hooks/useGameState.ts`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

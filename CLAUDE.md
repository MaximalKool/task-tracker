# CLAUDE.md

Guidance for working in this repository. Read this before making changes.

## Project Overview

**task-tracker** — a publicly shareable task-tracker web app prototype (DES Project).

- **v1 scope:** add tasks, remove tasks, mark complete, categorize tasks.
- **Stack:** React + Vite + TypeScript.
- **Persistence:** browser `localStorage` (per-device, no backend in v1).
- **Hosting:** GitHub Pages via GitHub Actions (permanent URL) + CodeSandbox import
  (live editing). Public URL: `https://maximalkool.github.io/task-tracker/`.

The architecture is intentionally decoupled so future features (nested tasks) and
future surfaces (Chrome extension, iOS/Android) are **additive, not a rewrite**.

## Architecture & Golden Rules

Three strict layers under `src/`. These boundaries are the whole point — do not blur them.

```
src/
  core/   Pure TypeScript. Domain model + business logic.
  data/   Storage abstraction: TaskRepository interface + implementations.
  ui/     React components, hooks, styles.
```

**Non-negotiable rules:**

1. **`core/` is pure** — no `react`, no DOM, no Vite, no storage imports, *ever*. Only
   platform API allowed is `crypto.randomUUID()`. This is what makes `core/` reusable by
   a Chrome extension or React Native app later.
2. **`ui/` never touches storage directly** — no `localStorage` in components/hooks
   except inside a `TaskRepository` implementation. UI talks to data only via the
   `useTasks` hook.
3. **`TaskRepository` methods are `async`** (return `Promise`) even though localStorage
   is synchronous. This keeps call sites unchanged when a network/DB backend is added.
4. **Composition root is `src/ui/main.tsx`** — the *only* place a concrete repository is
   instantiated/chosen. Swapping backends = change one line here.
5. **Data model is forward-compatible** — `Task` carries `parentId`, `order`,
   `createdAt`, `updatedAt`; persisted state carries `schemaVersion`. Do not remove
   these. Any change to the persisted shape requires a new entry in
   `src/core/migrations.ts`.
6. **Storage is a flat array** keyed on `parentId`; trees are built at render time via
   `buildTree()` in `core/`. Never store nesting structurally.

## Directory Map

| Path | Contents |
|---|---|
| `src/core/types.ts` | `Task`, `PersistedState` types |
| `src/core/tasks.ts` | Pure functions: create/toggle/remove/setCategory/buildTree, selectors |
| `src/core/migrations.ts` | `migrate(raw)` keyed on `schemaVersion` |
| `src/data/TaskRepository.ts` | Async repository interface |
| `src/data/LocalStorageTaskRepository.ts` | localStorage implementation (runs migrations on load) |
| `src/ui/main.tsx` | React root + composition root (picks repository) |
| `src/ui/App.tsx` | Layout + filter state |
| `src/ui/hooks/useTasks.ts` | Only bridge between UI and core/data |
| `src/ui/components/` | `TaskForm`, `TaskList`, `TaskItem`, `Filters` |
| `src/ui/styles.css` | Stylesheet (no UI framework) |
| `.github/workflows/deploy.yml` | Typecheck + build + deploy to GitHub Pages |

## Commands

```
npm install        # install deps
npm run dev        # local dev server
npm run build      # typecheck + production build
npm run preview    # serve the production build locally
npm run typecheck  # type-check only
```

## Conventions

- **Minimal comments** — explain WHY only when non-obvious; identifiers explain WHAT.
- **No speculative abstractions** — build for v1 scope; the layering above already
  handles future needs without premature generalization.
- **Keep v1 tight** — see Roadmap; don't pull deferred features forward unprompted.
- **Components stay presentational** — derived/filtered data is computed in `useTasks`.
- **Categories are derived** from existing tasks, not stored separately (avoids orphans).

## Deployment

- `vite.config.ts` sets `base: '/task-tracker/'` so Pages asset paths resolve.
- `.github/workflows/deploy.yml`: the `build` job runs on push to the working branch and
  `main` (validation); the `deploy` job runs **only on `main`** because the
  auto-created `github-pages` environment rejects deploys from non-default branches.
  Uses `pages: write` + `id-token: write`. **The site publishes when changes land on
  `main` (i.e. when the PR is merged).**
- **One-time manual step (repo owner):** GitHub → Settings → Pages → Build and
  deployment → Source = **GitHub Actions**. First run may fail until this is set.
- Live-edit alternative: `https://codesandbox.io/s/github/maximalkool/task-tracker`.

## Git / Working Branch

- Develop and push only to **`claude/plan-task-tracker-app-m258k`**.
- Never push to another branch without explicit permission.
- Create NEW commits (do not amend published commits). Push with
  `git push -u origin claude/plan-task-tracker-app-m258k`.

## Roadmap (Intentionally Deferred — Not v1)

Nested-task UI, backend + multi-user sync, accounts/auth, due dates & reminders,
recurring tasks, drag-to-reorder, search, export/import, dark mode.

The data model and layering already accommodate these — they are deferred for scope,
not blocked by architecture.

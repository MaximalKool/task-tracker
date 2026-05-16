# task-tracker

Basic Task Tracker App — DES Project.

A small, publicly shareable task tracker prototype. v1 lets you add, remove,
complete, and categorize tasks, with everything saved to your browser
(`localStorage`).

## Live

- **GitHub Pages:** https://maximalkool.github.io/task-tracker/
- **Live edit (CodeSandbox):** https://codesandbox.io/s/github/maximalkool/task-tracker

> First Pages deploy requires the repo owner to set **Settings → Pages → Build
> and deployment → Source = GitHub Actions** once.

## Local development

```bash
npm install
npm run dev        # start dev server
npm run build      # typecheck + production build
npm run preview    # serve the production build
npm run typecheck  # type-check only
```

## Architecture

Three decoupled layers under `src/` so future features (nested tasks) and
surfaces (extension, mobile) are additive, not a rewrite. See `CLAUDE.md` for
the full guardrails.

- `src/core/` — pure TypeScript domain model + logic (no React/DOM).
- `src/data/` — `TaskRepository` abstraction; localStorage implementation.
- `src/ui/` — React components and the `useTasks` hook.

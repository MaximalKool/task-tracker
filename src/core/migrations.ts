import { CURRENT_SCHEMA_VERSION, type PersistedState } from './types';

const EMPTY: PersistedState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  tasks: [],
};

// Normalize whatever is in storage into the current PersistedState shape.
// Add a `case` per old version as the schema evolves; never lose data silently.
export function migrate(raw: unknown): PersistedState {
  if (!raw || typeof raw !== 'object') return EMPTY;

  const state = raw as Partial<PersistedState>;
  const version = typeof state.schemaVersion === 'number' ? state.schemaVersion : 0;

  const tasks = Array.isArray(state.tasks) ? state.tasks : [];

  // v1 introduced `dueDate`, v3 introduced `completedAt`. Both are optional
  // and default to null, so older versions normalize forward losslessly.
  const normalize = () =>
    tasks.map((t) => ({
      ...t,
      dueDate: t.dueDate ?? null,
      completedAt: t.completedAt ?? null,
    }));

  switch (version) {
    case CURRENT_SCHEMA_VERSION:
      return { schemaVersion: CURRENT_SCHEMA_VERSION, tasks };
    case 1:
    case 2:
      return { schemaVersion: CURRENT_SCHEMA_VERSION, tasks: normalize() };
    // case 0: ... (no released v0 format yet)
    default:
      return EMPTY;
  }
}

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

  switch (version) {
    case CURRENT_SCHEMA_VERSION:
      return { schemaVersion: CURRENT_SCHEMA_VERSION, tasks };
    case 1:
      // v1 → v2: introduce the optional `dueDate` field.
      return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        tasks: tasks.map((t) => ({ ...t, dueDate: t.dueDate ?? null })),
      };
    // case 0: ... (no released v0 format yet)
    default:
      return EMPTY;
  }
}

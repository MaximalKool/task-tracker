export type Task = {
  id: string;
  title: string;
  category: string; // "" = uncategorized
  completed: boolean;
  parentId: string | null; // null = top-level; enables nested tasks with no migration
  order: number; // stable sort slot; enables future drag-reorder
  dueDate: number | null; // local-midnight timestamp; null = no deadline
  completedAt: number | null; // timestamp when marked complete; null otherwise
  createdAt: number;
  updatedAt: number; // enables future sync / conflict resolution
};

export const CURRENT_SCHEMA_VERSION = 3;

export type DueStatus = 'overdue' | 'due' | 'none';

export type PersistedState = {
  schemaVersion: number;
  tasks: Task[]; // flat array; tree is built at render time, never stored as nesting
};

export type TaskNode = Task & { children: TaskNode[] };

export type StatusFilter = 'all' | 'active' | 'overdue' | 'completed';

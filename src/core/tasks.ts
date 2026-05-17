import type { DueStatus, StatusFilter, Task, TaskNode } from './types';

export function createTask(
  title: string,
  category: string,
  dueDate: number | null = null,
  parentId: string | null = null,
  order = Date.now(),
): Task {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    category: category.trim(),
    completed: false,
    parentId,
    order,
    dueDate,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function setCompletion(t: Task, completed: boolean): Task {
  if (t.completed === completed) return t;
  const now = Date.now();
  return { ...t, completed, completedAt: completed ? now : null, updatedAt: now };
}

// A parent's completion is derived from its subtasks: complete iff every
// subtask is complete. Childless tasks are returned untouched.
export function reconcileParents(tasks: Task[]): Task[] {
  return tasks.map((t) => {
    const children = tasks.filter((c) => c.parentId === t.id);
    if (children.length === 0) return t;
    return setCompletion(t, children.every((c) => c.completed));
  });
}

// Pure deadline classification. Overdue = the due day has fully passed;
// on the due day itself the task is still just "due".
export function dueStatus(task: Task, now: number = Date.now()): DueStatus {
  if (task.dueDate == null || task.completed) return 'none';
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  return task.dueDate < startOfToday.getTime() ? 'overdue' : 'due';
}

// Whole-day delta between today and the due day. Positive = days remaining,
// 0 = due today, negative = days overdue. null when there is no deadline.
export function daysUntilDue(task: Task, now: number = Date.now()): number | null {
  if (task.dueDate == null) return null;
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const dueDay = new Date(task.dueDate);
  dueDay.setHours(0, 0, 0, 0);
  return Math.round((dueDay.getTime() - startToday.getTime()) / 86_400_000);
}

export type TaskPatch = {
  title?: string;
  category?: string;
  dueDate?: number | null;
};

export function updateTask(tasks: Task[], id: string, patch: TaskPatch): Task[] {
  const now = Date.now();
  return tasks.map((t) => {
    if (t.id === id) {
      return {
        ...t,
        ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
        ...(patch.category !== undefined ? { category: patch.category.trim() } : {}),
        ...(patch.dueDate !== undefined ? { dueDate: patch.dueDate } : {}),
        updatedAt: now,
      };
    }
    // Subtasks inherit the master task's category.
    if (patch.category !== undefined && t.parentId === id) {
      return { ...t, category: patch.category.trim(), updatedAt: now };
    }
    return t;
  });
}

export function addTask(tasks: Task[], task: Task): Task[] {
  return [...tasks, task];
}

export function removeTask(tasks: Task[], id: string): Task[] {
  // Drop the task and any of its descendants so no orphans remain.
  const removed = new Set<string>([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const t of tasks) {
      if (t.parentId && removed.has(t.parentId) && !removed.has(t.id)) {
        removed.add(t.id);
        changed = true;
      }
    }
  }
  return reconcileParents(tasks.filter((t) => !removed.has(t.id)));
}

export function toggleComplete(tasks: Task[], id: string): Task[] {
  // A parent with subtasks is driven by its subtasks, not toggled directly.
  if (tasks.some((c) => c.parentId === id)) return tasks;
  const next = tasks.map((t) =>
    t.id === id ? setCompletion(t, !t.completed) : t,
  );
  return reconcileParents(next);
}

export function clearCompleted(tasks: Task[]): Task[] {
  const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
  return completedIds.reduce((acc, id) => removeTask(acc, id), tasks);
}

export function listCategories(tasks: Task[]): string[] {
  const set = new Set<string>();
  for (const t of tasks) if (t.category) set.add(t.category);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function filterTasks(
  tasks: Task[],
  status: StatusFilter,
  category: string | null,
): Task[] {
  return tasks.filter((t) => {
    if (status === 'active' && t.completed) return false;
    if (status === 'completed' && !t.completed) return false;
    if (status === 'overdue' && dueStatus(t) !== 'overdue') return false;
    if (category !== null && t.category !== category) return false;
    return true;
  });
}

// Active tasks first, ordered by urgency (most overdue → soonest due →
// no deadline); completed tasks sink to the bottom.
export function sortTasks(tasks: Task[], now: number = Date.now()): Task[] {
  const dueKey = (t: Task) => {
    const d = daysUntilDue(t, now);
    return d === null ? Infinity : d;
  };
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.completed && b.completed) return 0;
    return dueKey(a) - dueKey(b);
  });
}

// Build a tree from the flat list. v1 renders top-level only; this is ready
// for nested-task UI with no model or storage change.
export function buildTree(tasks: Task[]): TaskNode[] {
  const byParent = new Map<string | null, Task[]>();
  for (const t of tasks) {
    const key = t.parentId;
    const arr = byParent.get(key);
    if (arr) arr.push(t);
    else byParent.set(key, [t]);
  }

  const build = (parentId: string | null): TaskNode[] =>
    (byParent.get(parentId) ?? [])
      .slice()
      .sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
      .map((t) => ({ ...t, children: build(t.id) }));

  return build(null);
}

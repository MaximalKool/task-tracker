import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  addTask,
  buildTree,
  clearCompleted,
  createTask,
  filterTasks,
  listCategories,
  reconcileParents,
  removeTask,
  sortTasks,
  toggleComplete,
  updateTask,
  type TaskPatch,
} from '../../core/tasks';
import type { StatusFilter, Task, TaskNode } from '../../core/types';
import type { TaskRepository } from '../../data/TaskRepository';

// The single bridge between the UI and core/data. Components never touch
// storage or core internals directly.
export function useTasks(repo: TaskRepository) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setActiveCategory] = useState<string | null>(null);

  // Skip the first save (right after the initial load) to avoid clobbering.
  const skipNextSave = useRef(true);

  useEffect(() => {
    repo.load().then((loadedTasks) => {
      setTasks(loadedTasks);
      setLoaded(true);
    });
  }, [repo]);

  useEffect(() => {
    if (!loaded) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    void repo.save(tasks);
  }, [tasks, loaded, repo]);

  const add = useCallback(
    (title: string, cat: string, dueDate: number | null) => {
      if (!title.trim()) return;
      setTasks((prev) => addTask(prev, createTask(title, cat, dueDate)));
    },
    [],
  );

  const addSub = useCallback(
    (parentId: string, title: string, dueDate: number | null) => {
      if (!title.trim()) return;
      setTasks((prev) => {
        const parent = prev.find((t) => t.id === parentId);
        if (!parent || parent.parentId !== null) return prev; // 1 level only
        const sub = createTask(title, parent.category, dueDate, parentId);
        return reconcileParents(addTask(prev, sub));
      });
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setTasks((prev) => removeTask(prev, id));
  }, []);

  const toggle = useCallback((id: string) => {
    setTasks((prev) => toggleComplete(prev, id));
  }, []);

  const edit = useCallback((id: string, patch: TaskPatch) => {
    setTasks((prev) => updateTask(prev, id, patch));
  }, []);

  const clearDone = useCallback(() => {
    setTasks((prev) => clearCompleted(prev));
  }, []);

  const categories = useMemo(() => listCategories(tasks), [tasks]);

  // Top-level tasks are filtered + urgency-sorted; their subtasks ride along
  // (subtasks aren't filtered independently) and are urgency-sorted too.
  const visibleTree = useMemo<TaskNode[]>(() => {
    const top = buildTree(tasks);
    const filtered = filterTasks(top, status, category) as TaskNode[];
    const sorted = sortTasks(filtered) as TaskNode[];
    return sorted.map((n) => ({
      ...n,
      children: sortTasks(n.children) as TaskNode[],
    }));
  }, [tasks, status, category]);

  return {
    loaded,
    tasks,
    visibleTree,
    categories,
    status,
    category,
    setStatus,
    setActiveCategory,
    add,
    addSub,
    remove,
    toggle,
    edit,
    clearDone,
  };
}

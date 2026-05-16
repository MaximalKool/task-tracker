import { migrate } from '../core/migrations';
import { CURRENT_SCHEMA_VERSION, type Task } from '../core/types';
import type { TaskRepository } from './TaskRepository';

const STORAGE_KEY = 'task-tracker:state';

export class LocalStorageTaskRepository implements TaskRepository {
  async load(): Promise<Task[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return migrate(JSON.parse(raw)).tasks;
    } catch {
      return [];
    }
  }

  async save(tasks: Task[]): Promise<void> {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION, tasks }),
    );
  }
}

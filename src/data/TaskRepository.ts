import type { Task } from '../core/types';

// Async by design even for synchronous backends, so swapping in a network/DB
// implementation later does not change a single call site.
export interface TaskRepository {
  load(): Promise<Task[]>;
  save(tasks: Task[]): Promise<void>;
}

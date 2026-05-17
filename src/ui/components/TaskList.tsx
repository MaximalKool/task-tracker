import type { TaskPatch } from '../../core/tasks';
import type { Task } from '../../core/types';
import { TaskItem } from './TaskItem';

type Props = {
  tasks: Task[];
  loaded: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, patch: TaskPatch) => void;
};

export function TaskList({ tasks, loaded, onToggle, onRemove, onEdit }: Props) {
  if (!loaded) return null;

  if (tasks.length === 0) {
    return <p className="task-list__empty">Nothing here yet. Add your first task above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

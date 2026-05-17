import { dueStatus } from '../../core/tasks';
import type { Task } from '../../core/types';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

function statusClass(task: Task): string {
  if (task.completed) return ' task--done';
  const due = dueStatus(task);
  if (due === 'overdue') return ' task--overdue';
  if (due === 'due') return ' task--due';
  return '';
}

export function TaskItem({ task, onToggle, onRemove }: Props) {
  return (
    <li className={`task${statusClass(task)}`}>
      <label className="task__main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="task__title">{task.title}</span>
      </label>
      {task.dueDate != null && (
        <span className="task__due">
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
      {task.category && <span className="task__category">{task.category}</span>}
      <button
        className="task__remove"
        onClick={() => onRemove(task.id)}
        aria-label={`Delete "${task.title}"`}
      >
        ×
      </button>
    </li>
  );
}

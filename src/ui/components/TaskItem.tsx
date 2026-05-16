import type { Task } from '../../core/types';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function TaskItem({ task, onToggle, onRemove }: Props) {
  return (
    <li className={`task${task.completed ? ' task--done' : ''}`}>
      <label className="task__main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="task__title">{task.title}</span>
      </label>
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

import { useState, type FormEvent } from 'react';
import { daysUntilDue, dueStatus, type TaskPatch } from '../../core/tasks';
import type { Task } from '../../core/types';
import { parseDateInput, toDateInputValue } from '../dateInput';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, patch: TaskPatch) => void;
};

function statusClass(task: Task): string {
  if (task.completed) return ' task--done';
  const due = dueStatus(task);
  if (due === 'overdue') return ' task--overdue';
  if (due === 'due') return ' task--due';
  return '';
}

function dueLabel(task: Task): string | null {
  const days = daysUntilDue(task);
  if (days === null) return null;
  if (days === 0) return 'Due today';
  const n = Math.abs(days);
  const unit = n === 1 ? 'day' : 'days';
  return days > 0 ? `${n} ${unit} till deadline` : `${n} ${unit} past due`;
}

export function TaskItem({ task, onToggle, onRemove, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category);
  const [due, setDue] = useState(toDateInputValue(task.dueDate));

  function startEdit() {
    setTitle(task.title);
    setCategory(task.category);
    setDue(toDateInputValue(task.dueDate));
    setEditing(true);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onEdit(task.id, {
      title,
      category,
      dueDate: parseDateInput(due),
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="task task--editing">
        <form className="task__edit" onSubmit={handleSave}>
          <input
            className="task__edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            aria-label="Edit task title"
          />
          <input
            className="task__edit-category"
            type="text"
            value={category}
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Edit task category"
          />
          <input
            className="task__edit-due"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            aria-label="Edit due date"
          />
          <div className="task__edit-actions">
            <button type="submit" className="task__btn task__btn--primary">
              Save
            </button>
            <button
              type="button"
              className="task__btn"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  const label = dueLabel(task);

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
      {label && <span className="task__due">{label}</span>}
      {task.category && <span className="task__category">{task.category}</span>}
      <button
        className="task__btn"
        onClick={startEdit}
        aria-label={`Edit "${task.title}"`}
      >
        Edit
      </button>
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

import { useState, type FormEvent } from 'react';
import {
  daysUntilDue,
  dueStatus,
  soonestSubtaskDays,
  type TaskPatch,
} from '../../core/tasks';
import type { Task } from '../../core/types';
import { formatShortDate, parseDateInput, toDateInputValue } from '../dateInput';

type Props = {
  task: Task;
  isSubtask: boolean;
  subtasks: Task[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, patch: TaskPatch) => void;
  onAddSub: (parentId: string, title: string, dueDate: number | null) => void;
};

function statusClass(task: Task): string {
  if (task.completed) return ' task--done';
  const due = dueStatus(task);
  if (due === 'overdue') return ' task--overdue';
  if (due === 'due') return ' task--due';
  return '';
}

function formatDays(days: number, prefix: string): string {
  const lead = prefix ? `${prefix} ` : '';
  if (days === 0) return `${lead}due today`;
  const n = Math.abs(days);
  const unit = n === 1 ? 'day' : 'days';
  if (days > 0) return `${lead}due in ${n} ${unit}`;
  return `${lead}${n} ${unit} past due`;
}

// Leaf/subtask: its own deadline. Master with subtasks: soonest subtask
// deadline ("Subtask ..."), falling back to the master's own deadline when
// no subtask has one. Nothing once complete.
function dueLabel(task: Task, subtasks: Task[]): string | null {
  if (task.completed) return null;
  if (subtasks.length > 0) {
    const sub = soonestSubtaskDays(subtasks);
    if (sub !== null) return formatDays(sub, 'Subtask');
  }
  const days = daysUntilDue(task);
  return days === null ? null : formatDays(days, '');
}

export function TaskItem({
  task,
  isSubtask,
  subtasks,
  onToggle,
  onRemove,
  onEdit,
  onAddSub,
}: Props) {
  const hasChildren = subtasks.length > 0;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category);
  const [due, setDue] = useState(toDateInputValue(task.dueDate));

  const [addingSub, setAddingSub] = useState(false);
  const [subTitle, setSubTitle] = useState('');
  const [subDue, setSubDue] = useState('');

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
      ...(isSubtask ? {} : { category }),
      dueDate: parseDateInput(due),
    });
    setEditing(false);
  }

  function handleAddSub(e: FormEvent) {
    e.preventDefault();
    if (!subTitle.trim()) return;
    onAddSub(task.id, subTitle, parseDateInput(subDue));
    setSubTitle('');
    setSubDue('');
    setAddingSub(false);
  }

  if (editing) {
    return (
      <div className="task task--editing">
        <form className="task__edit" onSubmit={handleSave}>
          <input
            className="task__edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            aria-label="Edit task title"
          />
          {!isSubtask && (
            <input
              className="task__edit-category"
              type="text"
              value={category}
              placeholder="Category"
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Edit task category"
            />
          )}
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
      </div>
    );
  }

  const label = dueLabel(task, subtasks);
  const completedOn =
    task.completed && task.completedAt != null
      ? formatShortDate(task.completedAt)
      : null;

  return (
    <>
      <div className={`task${statusClass(task)}`}>
        <label className="task__main">
          <input
            type="checkbox"
            checked={task.completed}
            disabled={hasChildren}
            onChange={() => onToggle(task.id)}
            title={
              hasChildren
                ? 'Completed automatically when all subtasks are done'
                : undefined
            }
            aria-label={`Mark "${task.title}" ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="task__text">
            <span className="task__title">{task.title}</span>
            {task.category && (
              <span className="task__category">{task.category}</span>
            )}
          </span>
        </label>
        {completedOn && (
          <span className="task__completed">Completed {completedOn}</span>
        )}
        {label && <span className="task__due">{label}</span>}
        <div className="task__actions">
          {!isSubtask && (
            <button
              className="task__btn"
              onClick={() => setAddingSub((v) => !v)}
              aria-label={`Add subtask to "${task.title}"`}
            >
              + Subtask
            </button>
          )}
          <button
            className="task__btn"
            onClick={startEdit}
            aria-label={`Edit "${task.title}"`}
          >
            Edit
          </button>
        </div>
        <button
          className="task__remove"
          onClick={() => onRemove(task.id)}
          aria-label={`Delete "${task.title}"`}
        >
          ×
        </button>
      </div>
      {addingSub && (
        <form className="subtask-form" onSubmit={handleAddSub}>
          <input
            className="subtask-form__title"
            type="text"
            placeholder="Subtask"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            autoFocus
            aria-label="Subtask title"
          />
          <input
            className="subtask-form__due"
            type="date"
            value={subDue}
            onChange={(e) => setSubDue(e.target.value)}
            aria-label="Subtask due date"
          />
          <button type="submit" className="task__btn task__btn--primary">
            Add
          </button>
          <button
            type="button"
            className="task__btn"
            onClick={() => setAddingSub(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </>
  );
}

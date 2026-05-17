import { useState, type FormEvent } from 'react';
import { parseDateInput } from '../dateInput';

type Props = {
  onAdd: (title: string, category: string, dueDate: number | null) => void;
  categories: string[];
};

export function TaskForm({ onAdd, categories }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [due, setDue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, category, parseDateInput(due));
    setTitle('');
    setCategory('');
    setDue('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="task-form__title"
        type="text"
        placeholder="Add a task and press Enter"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        aria-label="Task title"
      />
      <input
        className="task-form__category"
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        list="category-suggestions"
        aria-label="Task category"
      />
      <datalist id="category-suggestions">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <input
        className="task-form__due"
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        aria-label="Due date (optional)"
      />
      <button type="submit" className="task-form__add">
        Add
      </button>
    </form>
  );
}

import { useTasks } from './hooks/useTasks';
import type { TaskRepository } from '../data/TaskRepository';
import { TaskForm } from './components/TaskForm';
import { Filters } from './components/Filters';
import { TaskList } from './components/TaskList';

export function App({ repo }: { repo: TaskRepository }) {
  const t = useTasks(repo);

  const remaining = t.tasks.filter((task) => !task.completed).length;

  return (
    <main className="app">
      <header className="app__header">
        <h1>Task Tracker</h1>
        <p className="app__subtitle">
          {t.loaded ? `${remaining} task${remaining === 1 ? '' : 's'} left` : 'Loading…'}
        </p>
      </header>

      <TaskForm onAdd={t.add} categories={t.categories} />

      <Filters
        status={t.status}
        category={t.category}
        categories={t.categories}
        onStatusChange={t.setStatus}
        onCategoryChange={t.setActiveCategory}
        onClearCompleted={t.clearDone}
      />

      <TaskList
        tasks={t.visibleTasks}
        loaded={t.loaded}
        onToggle={t.toggle}
        onRemove={t.remove}
      />
    </main>
  );
}

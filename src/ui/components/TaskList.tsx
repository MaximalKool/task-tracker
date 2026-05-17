import type { TaskPatch } from '../../core/tasks';
import type { TaskNode } from '../../core/types';
import { TaskItem } from './TaskItem';

type Props = {
  nodes: TaskNode[];
  loaded: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, patch: TaskPatch) => void;
  onAddSub: (parentId: string, title: string, dueDate: number | null) => void;
};

export function TaskList({
  nodes,
  loaded,
  onToggle,
  onRemove,
  onEdit,
  onAddSub,
}: Props) {
  if (!loaded) return null;

  if (nodes.length === 0) {
    return (
      <p className="task-list__empty">Nothing here yet. Add your first task above.</p>
    );
  }

  return (
    <ul className="task-list">
      {nodes.map((node) => (
        <li key={node.id} className="task-node">
          <TaskItem
            task={node}
            isSubtask={false}
            subtasks={node.children}
            onToggle={onToggle}
            onRemove={onRemove}
            onEdit={onEdit}
            onAddSub={onAddSub}
          />
          {node.children.length > 0 && (
            <ul className="task-list task-list--nested">
              {node.children.map((child) => (
                <li key={child.id} className="task-node">
                  <TaskItem
                    task={child}
                    isSubtask
                    subtasks={[]}
                    onToggle={onToggle}
                    onRemove={onRemove}
                    onEdit={onEdit}
                    onAddSub={onAddSub}
                  />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

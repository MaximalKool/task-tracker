import type { StatusFilter } from '../../core/types';

type Props = {
  status: StatusFilter;
  category: string | null;
  categories: string[];
  onStatusChange: (s: StatusFilter) => void;
  onCategoryChange: (c: string | null) => void;
  onClearCompleted: () => void;
};

const STATUSES: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'active', label: 'active' },
  { value: 'overdue', label: 'past due' },
  { value: 'completed', label: 'completed' },
];

export function Filters({
  status,
  category,
  categories,
  onStatusChange,
  onCategoryChange,
  onClearCompleted,
}: Props) {
  return (
    <div className="filters">
      <div className="filters__group" role="group" aria-label="Status filter">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            className={`chip${status === value ? ' chip--active' : ''}`}
            onClick={() => onStatusChange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="filters__group" role="group" aria-label="Category filter">
          <button
            className={`chip${category === null ? ' chip--active' : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            all categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`chip${category === c ? ' chip--active' : ''}`}
              onClick={() => onCategoryChange(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <button className="filters__clear" onClick={onClearCompleted}>
        Clear completed
      </button>
    </div>
  );
}

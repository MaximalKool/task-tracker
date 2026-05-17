import type { StatusFilter } from '../../core/types';

type Props = {
  status: StatusFilter;
  category: string | null;
  categories: string[];
  onStatusChange: (s: StatusFilter) => void;
  onCategoryChange: (c: string | null) => void;
  onClearCompleted: () => void;
};

const STATUSES: StatusFilter[] = ['all', 'active', 'completed'];

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
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`chip${status === s ? ' chip--active' : ''}`}
            onClick={() => onStatusChange(s)}
          >
            {s}
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

// Helpers bridging <input type="date"> ("YYYY-MM-DD") and the local-midnight
// timestamps stored on tasks.

export function toDateInputValue(ts: number | null): string {
  if (ts == null) return '';
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseDateInput(value: string): number | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

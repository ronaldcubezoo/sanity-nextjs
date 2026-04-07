/** Layout metadata stored in each block's `props` (JSON in Sanity). */

export const BUILDER_GRID_COLUMNS = 12;
export const BUILDER_ROW_UNIT_PX = 96;

export function getGridColSpan(props: Record<string, unknown>): number {
  const n = Number(props.gridColSpan);
  if (Number.isFinite(n)) {
    const r = Math.round(n);
    return Math.min(12, Math.max(1, r));
  }
  return 12;
}

export function getGridRowSpan(props: Record<string, unknown>): number {
  const n = Number(props.gridRowSpan);
  if (Number.isFinite(n)) {
    const r = Math.round(n);
    return Math.min(8, Math.max(1, r));
  }
  return 1;
}

export function ensureLayoutProps(props: Record<string, unknown>): Record<string, unknown> {
  const next = { ...props };
  if (next.gridColSpan == null) next.gridColSpan = BUILDER_GRID_COLUMNS;
  if (next.gridRowSpan == null) next.gridRowSpan = 1;
  return next;
}

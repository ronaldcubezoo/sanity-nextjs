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

/** 1–12: start column for this block. Omit for automatic row-wise placement. */
export function getGridColumnStart(props: Record<string, unknown>): number | undefined {
  const n = Number(props.gridColumnStart);
  if (!Number.isFinite(n)) return undefined;
  const r = Math.round(n);
  return Math.min(12, Math.max(1, r));
}

/** 1+ : start row for this block. Omit for automatic placement. */
export function getGridRowStart(props: Record<string, unknown>): number | undefined {
  const n = Number(props.gridRowStart);
  if (!Number.isFinite(n)) return undefined;
  return Math.max(1, Math.round(n));
}

/** Largest valid `gridColumnStart` so a block of `colSpan` fits in 12 columns. */
export function maxGridColumnStart(colSpan: number): number {
  const w = Math.min(BUILDER_GRID_COLUMNS, Math.max(1, Math.round(colSpan)));
  return Math.max(1, BUILDER_GRID_COLUMNS - w + 1);
}

export type HorizontalAlign = "left" | "center" | "right";

/** Place a block of width `colSpan` at the left, center, or right of the 12-col grid. */
export function gridColumnStartForAlign(align: HorizontalAlign, colSpan: number): number {
  const maxS = maxGridColumnStart(colSpan);
  if (align === "left") return 1;
  if (align === "right") return maxS;
  const w = Math.min(BUILDER_GRID_COLUMNS, Math.max(1, Math.round(colSpan)));
  return Math.max(1, Math.floor((BUILDER_GRID_COLUMNS - w) / 2) + 1);
}

/** Clamp stored column start when width changes so the block still fits. */
export function clampGridColumnStart(colStart: number, colSpan: number): number {
  const maxS = maxGridColumnStart(colSpan);
  return Math.min(maxS, Math.max(1, Math.round(colStart)));
}

/**
 * CSS grid placement: row flow only (no dense packing). Optional start lines pin blocks
 * to a column/row; otherwise items follow document order without backfilling gaps.
 */
export function buildGridItemPlacement(props: Record<string, unknown>): {
  gridColumn: string;
  gridRow: string;
  minHeight: number;
} {
  const colSpan = getGridColSpan(props);
  const rowSpan = getGridRowSpan(props);
  let colStart = getGridColumnStart(props);
  const rowStart = getGridRowStart(props);

  if (colStart != null) {
    const end = colStart + colSpan - 1;
    if (end > BUILDER_GRID_COLUMNS) {
      colStart = Math.max(1, BUILDER_GRID_COLUMNS - colSpan + 1);
    }
  }

  const gridColumn =
    colStart != null ? `${colStart} / span ${colSpan}` : `span ${colSpan} / span ${colSpan}`;

  const gridRow =
    rowStart != null ? `${rowStart} / span ${rowSpan}` : `span ${rowSpan} / span ${rowSpan}`;

  return {
    gridColumn,
    gridRow,
    minHeight: rowSpan * BUILDER_ROW_UNIT_PX,
  };
}

export function ensureLayoutProps(props: Record<string, unknown>): Record<string, unknown> {
  const next = { ...props };
  if (next.gridColSpan == null) next.gridColSpan = BUILDER_GRID_COLUMNS;
  if (next.gridRowSpan == null) next.gridRowSpan = 1;
  return next;
}

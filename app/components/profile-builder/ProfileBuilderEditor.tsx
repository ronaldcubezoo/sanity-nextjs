"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Slider } from "@/app/components/ui/slider";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { cn } from "@/lib/utils";
import type { ComponentDefinitionOption, Profile, ProfileBuilderBlock } from "@/lib/profile";
import {
  defaultPropsForBlock,
  resolveBlockLabel,
} from "@/lib/profile-builder-registry";
import { buildProfileBuilderPalette, type BuilderPaletteEntry } from "@/lib/profile-builder-palette";
import { saveProfileBuilderBlocks, type BuilderBlockSaveInput } from "@/app/actions/profile-builder-actions";
import {
  BUILDER_GRID_COLUMNS,
  BUILDER_ROW_UNIT_PX,
  buildGridItemPlacement,
  clampGridColumnStart,
  ensureLayoutProps,
  getGridColSpan,
  getGridColumnStart,
  getGridRowSpan,
  getGridRowStart,
  gridColumnStartForAlign,
  maxGridColumnStart,
} from "@/lib/profile-builder-layout";
import { resolveProfileBuilderBlocks } from "@/lib/resolve-profile-builder-blocks";
import {
  MarqueAwardItemsEditor,
  MarqueBoardsDualEditor,
  MarqueGalleryItemsEditor,
  MarqueInterviewFeatureItemsEditor,
  MarqueNewsfeedItemsEditor,
  MarqueProfileMediaItemsEditor,
  MarquePublicationItemsEditor,
  MarqueTimelineItemsEditor,
  StringTagsEditor,
} from "@/app/components/profile-builder/marque-profile-item-editors";

type EditableBlock = {
  _key: string;
  blockKey: string;
  props: Record<string, unknown>;
  componentDefinitionRef?: string | null;
};

function newKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `k_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function toEditable(profile: Profile): EditableBlock[] {
  const raw = resolveProfileBuilderBlocks(profile);
  return raw.map((b: ProfileBuilderBlock) => {
    const defaults = defaultPropsForBlock(b.blockKey);
    return {
      _key: b._key || newKey(),
      blockKey: b.blockKey,
      props: ensureLayoutProps({ ...defaults, ...b.props }),
      componentDefinitionRef: b.componentDefinition?._id ?? null,
    };
  });
}

const CANVAS_ROOT_ID = "canvas-root";

const MAX_ROW_START_SLIDER = 24;

function LayoutSection({
  block,
  onChange,
}: {
  block: EditableBlock;
  onChange: (next: EditableBlock) => void;
}) {
  const col = getGridColSpan(block.props);
  const row = getGridRowSpan(block.props);
  const colStart = getGridColumnStart(block.props);
  const rowStart = getGridRowStart(block.props);
  const maxColStart = maxGridColumnStart(col);
  const manualH = colStart != null;
  const manualV = rowStart != null;

  const setLayout = (key: "gridColSpan" | "gridRowSpan", value: number) => {
    onChange({
      ...block,
      props: { ...block.props, [key]: value },
    });
  };

  const clearOptionalPlacement = (key: "gridColumnStart" | "gridRowStart") => {
    const next = { ...block.props };
    delete next[key];
    onChange({ ...block, props: next });
  };

  const setColSpan = (newCol: number) => {
    const cur = getGridColumnStart(block.props);
    const nextProps: Record<string, unknown> = { ...block.props, gridColSpan: newCol };
    if (cur != null) {
      nextProps.gridColumnStart = clampGridColumnStart(cur, newCol);
    }
    onChange({ ...block, props: nextProps });
  };

  const effectiveColStart = colStart ?? 1;
  const effectiveRowStart = rowStart ?? 1;

  return (
    <div className="space-y-3 pb-3 border-b border-surface-border mb-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg">Canvas grid</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="layout-cols">Width (cols 1–12)</Label>
          <Input
            id="layout-cols"
            type="number"
            min={1}
            max={12}
            value={col}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) setColSpan(Math.min(12, Math.max(1, Math.round(n))));
            }}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="layout-rows">Height (rows 1–8)</Label>
          <Input
            id="layout-rows"
            type="number"
            min={1}
            max={8}
            value={row}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) setLayout("gridRowSpan", Math.min(8, Math.max(1, Math.round(n))));
            }}
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-sm border border-surface-border bg-cream/40 p-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="text-[11px]">Horizontal position</Label>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={!manualH ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-[10px] px-2"
              onClick={() => clearOptionalPlacement("gridColumnStart")}
            >
              Auto
            </Button>
            <Button
              type="button"
              variant={manualH ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-[10px] px-2"
              onClick={() =>
                onChange({
                  ...block,
                  props: { ...block.props, gridColumnStart: colStart ?? 1 },
                })
              }
            >
              Manual
            </Button>
          </div>
        </div>
        {manualH ? (
          <div className="space-y-2 pt-1">
            <div className="flex gap-1 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px] flex-1 min-w-[4rem]"
                onClick={() =>
                  onChange({
                    ...block,
                    props: { ...block.props, gridColumnStart: gridColumnStartForAlign("left", col) },
                  })
                }
              >
                Left
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px] flex-1 min-w-[4rem]"
                onClick={() =>
                  onChange({
                    ...block,
                    props: { ...block.props, gridColumnStart: gridColumnStartForAlign("center", col) },
                  })
                }
              >
                Center
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px] flex-1 min-w-[4rem]"
                onClick={() =>
                  onChange({
                    ...block,
                    props: { ...block.props, gridColumnStart: gridColumnStartForAlign("right", col) },
                  })
                }
              >
                Right
              </Button>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-muted-fg mb-1">
                <span>
                  Slide along the row (start column {effectiveColStart}, max {maxColStart} for this width)
                </span>
              </div>
              <Slider
                value={[clampGridColumnStart(effectiveColStart, col)]}
                min={1}
                max={maxColStart}
                step={1}
                onValueChange={(v) => {
                  const n = v[0];
                  if (n != null) {
                    onChange({
                      ...block,
                      props: { ...block.props, gridColumnStart: n },
                    });
                  }
                }}
                className="py-2"
              />
            </div>
            <div>
              <Label htmlFor="layout-col-start" className="text-[10px]">
                Start column (1–{maxColStart})
              </Label>
              <Input
                id="layout-col-start"
                type="number"
                min={1}
                max={maxColStart}
                value={clampGridColumnStart(effectiveColStart, col)}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) {
                    onChange({
                      ...block,
                      props: {
                        ...block.props,
                        gridColumnStart: clampGridColumnStart(n, col),
                      },
                    });
                  }
                }}
                className="mt-1 h-8 text-sm"
              />
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-muted-fg leading-snug">
            Auto: block follows list order in the grid. Choose Manual to slide the block left/right in the
            free space (for your current width, up to column {maxColStart}).
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-sm border border-surface-border bg-cream/40 p-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="text-[11px]">Vertical position</Label>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={!manualV ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-[10px] px-2"
              onClick={() => clearOptionalPlacement("gridRowStart")}
            >
              Auto
            </Button>
            <Button
              type="button"
              variant={manualV ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-[10px] px-2"
              onClick={() =>
                onChange({
                  ...block,
                  props: { ...block.props, gridRowStart: rowStart ?? 1 },
                })
              }
            >
              Manual
            </Button>
          </div>
        </div>
        {manualV ? (
          <div className="space-y-2 pt-1">
            <div>
              <div className="text-[10px] text-muted-fg mb-1">Row start (1–{MAX_ROW_START_SLIDER})</div>
              <Slider
                value={[Math.min(MAX_ROW_START_SLIDER, effectiveRowStart)]}
                min={1}
                max={MAX_ROW_START_SLIDER}
                step={1}
                onValueChange={(v) => {
                  const n = v[0];
                  if (n != null) {
                    onChange({
                      ...block,
                      props: { ...block.props, gridRowStart: n },
                    });
                  }
                }}
                className="py-2"
              />
            </div>
            <div>
              <Label htmlFor="layout-row-start" className="text-[10px]">
                Row start (exact)
              </Label>
              <Input
                id="layout-row-start"
                type="number"
                min={1}
                max={99}
                value={effectiveRowStart}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) {
                    onChange({
                      ...block,
                      props: {
                        ...block.props,
                        gridRowStart: Math.max(1, Math.round(n)),
                      },
                    });
                  }
                }}
                className="mt-1 h-8 text-sm"
              />
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-muted-fg leading-snug">
            Auto: rows follow list order. Use Manual to pin this block to a specific row (e.g. align with
            another column).
          </p>
        )}
      </div>

      <p className="text-[10px] text-muted-fg leading-snug">
        Drag blocks in the canvas to reorder. Manual placement overrides auto flow for that axis only.
      </p>
    </div>
  );
}

function SortableCanvasBlock({
  id,
  layoutProps,
  gridRef,
  children,
  onResizeCol,
  onResizeRow,
}: {
  id: string;
  layoutProps: Record<string, unknown>;
  gridRef: RefObject<HTMLUListElement | null>;
  children: ReactNode;
  onResizeCol: (next: number) => void;
  onResizeRow: (next: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const colSpan = getGridColSpan(layoutProps);
  const rowSpan = getGridRowSpan(layoutProps);
  const placement = buildGridItemPlacement(layoutProps);
  const style = {
    gridColumn: placement.gridColumn,
    gridRow: placement.gridRow,
    minHeight: placement.minHeight,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragCol = useRef({ startX: 0, startSpan: 12 });
  const dragRow = useRef({ startY: 0, startSpan: 1 });

  const onRightPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ul = gridRef.current;
    if (!ul) return;
    const w = ul.getBoundingClientRect().width;
    const colW = w / BUILDER_GRID_COLUMNS;
    dragCol.current = { startX: e.clientX, startSpan: colSpan };
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - dragCol.current.startX;
      const delta = Math.round(dx / Math.max(colW, 1));
      onResizeCol(Math.min(12, Math.max(1, dragCol.current.startSpan + delta)));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onBottomPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRow.current = { startY: e.clientY, startSpan: rowSpan };
    const onMove = (ev: PointerEvent) => {
      const dy = ev.clientY - dragRow.current.startY;
      const delta = Math.round(dy / BUILDER_ROW_UNIT_PX);
      onResizeRow(Math.min(8, Math.max(1, dragRow.current.startSpan + delta)));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "page-builder-cell relative flex flex-col rounded-sm border border-surface-border bg-surface p-2 shadow-sm min-h-0 group/cell",
        isDragging && "opacity-70 z-30 ring-2 ring-copper/50"
      )}
    >
      <div className="flex gap-1.5 items-start flex-1 min-h-0 min-w-0">
        <button
          type="button"
          className="mt-0.5 shrink-0 text-graphite/40 hover:text-graphite cursor-grab active:cursor-grabbing touch-none p-0.5"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
        <div className="flex-1 min-w-0 min-h-0 overflow-auto">{children}</div>
      </div>
      <button
        type="button"
        aria-label="Resize width"
        className="absolute top-2 right-0 z-10 w-2.5 h-[calc(100%-1rem)] cursor-ew-resize hover:bg-copper/25 rounded-sm opacity-0 group-hover/cell:opacity-100 transition-opacity"
        onPointerDown={onRightPointerDown}
      />
      <button
        type="button"
        aria-label="Resize height"
        className="absolute bottom-0 left-2 right-2 z-10 h-2.5 cursor-ns-resize hover:bg-copper/25 rounded-sm opacity-0 group-hover/cell:opacity-100 transition-opacity"
        onPointerDown={onBottomPointerDown}
      />
    </li>
  );
}

function PaletteDraggable({
  id,
  entry,
  children,
}: {
  id: string;
  entry: BuilderPaletteEntry;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { type: "palette" as const, entry },
  });
  return (
    <div
      ref={setNodeRef}
      className={cn("w-full min-w-0 max-w-full rounded-sm touch-none", isDragging && "opacity-50")}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}

function CanvasDropZone({ children }: { children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_ROOT_ID });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[min(72vh,820px)] w-full min-w-0 rounded-sm border-2 border-dashed transition-colors",
        isOver ? "border-copper/50 bg-copper/[0.06]" : "border-surface-border bg-cream/35"
      )}
    >
      {children}
    </div>
  );
}

function PropsForm({
  block,
  onChange,
  componentDefinitions,
}: {
  block: EditableBlock;
  onChange: (next: EditableBlock) => void;
  componentDefinitions: ComponentDefinitionOption[];
}) {
  const setProp = (key: string, value: unknown) => {
    onChange({
      ...block,
      props: { ...block.props, [key]: value },
    });
  };

  const core = (() => {
  if (block.blockKey === "marqueProfileHeader") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {(["name", "roleLine1", "roleLine2", "location"] as const).map((key) => (
          <div key={key}>
            <Label htmlFor={`mph-${key}`}>{key}</Label>
            <Input
              id={`mph-${key}`}
              value={String(block.props[key] ?? "")}
              onChange={(e) => setProp(key, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
        <StringTagsEditor tags={block.props.tags} onChange={(next) => setProp("tags", next)} />
      </div>
    );
  }

  if (block.blockKey === "marqueProfileBiography") {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="mpbio-title">Section title</Label>
          <Input
            id="mpbio-title"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="mpbio-body">Body</Label>
          <Textarea
            id="mpbio-body"
            rows={12}
            value={String(block.props.body ?? "")}
            onChange={(e) => setProp("body", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    );
  }

  if (block.blockKey === "marqueProfileNewsfeed") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <Label htmlFor="mp-sec">Section title</Label>
          <Input
            id="mp-sec"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <MarqueNewsfeedItemsEditor
          items={block.props.items}
          onItemsChange={(next) => setProp("items", next)}
        />
      </div>
    );
  }

  if (block.blockKey === "marqueProfileBackground") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <Label htmlFor="mp-bg-title">Section title</Label>
          <Input
            id="mp-bg-title"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <MarqueTimelineItemsEditor
          items={block.props.items}
          onItemsChange={(next) => setProp("items", next)}
          addLabel="Add role"
        />
      </div>
    );
  }

  if (block.blockKey === "marqueProfileMedia") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <Label htmlFor="mp-media-sec">Section title</Label>
          <Input
            id="mp-media-sec"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <MarqueProfileMediaItemsEditor
          items={block.props.items}
          onItemsChange={(next) => setProp("items", next)}
        />
      </div>
    );
  }

  if (block.blockKey === "marqueProfileInterviews" || block.blockKey === "marqueProfileFeatures") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <Label htmlFor="mp-if-sec">Section title</Label>
          <Input
            id="mp-if-sec"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <MarqueInterviewFeatureItemsEditor
          items={block.props.items}
          onItemsChange={(next) => setProp("items", next)}
        />
      </div>
    );
  }

  if (block.blockKey === "marqueProfilePublications") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <Label htmlFor="mp-pa-title">Section title</Label>
          <Input
            id="mp-pa-title"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <MarquePublicationItemsEditor
          items={block.props.items}
          onItemsChange={(next) => setProp("items", next)}
        />
      </div>
    );
  }

  if (block.blockKey === "marqueProfileAwards") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <Label htmlFor="mp-aw-title">Section title</Label>
          <Input
            id="mp-aw-title"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <MarqueAwardItemsEditor
          items={block.props.items}
          onItemsChange={(next) => setProp("items", next)}
        />
      </div>
    );
  }

  if (block.blockKey === "marqueProfileGallery") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <Label htmlFor="mp-gal">Section title</Label>
          <Input
            id="mp-gal"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <MarqueGalleryItemsEditor
          items={block.props.items}
          onItemsChange={(next) => setProp("items", next)}
        />
      </div>
    );
  }

  if (block.blockKey === "marqueProfileBoards") {
    return <MarqueBoardsDualEditor props={block.props} setProp={setProp} />;
  }

  if (block.blockKey === "marqueProfileSpeaking") {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="mp-sp-title">Section title</Label>
          <Input
            id="mp-sp-title"
            value={String(block.props.sectionTitle ?? "")}
            onChange={(e) => setProp("sectionTitle", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="mp-sp-body">Body</Label>
          <Textarea
            id="mp-sp-body"
            rows={5}
            value={String(block.props.body ?? "")}
            onChange={(e) => setProp("body", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="mp-sp-loc">Location line</Label>
          <Input
            id="mp-sp-loc"
            value={String(block.props.locationLine ?? "")}
            onChange={(e) => setProp("locationLine", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    );
  }

  if (block.blockKey === "themarqueHero") {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {(
          [
            ["kicker", "Kicker"],
            ["line1", "Headline line 1"],
            ["lineHighlight", "Highlight line"],
            ["line3", "Headline line 3"],
          ] as const
        ).map(([id, lab]) => (
          <div key={id}>
            <Label htmlFor={id}>{lab}</Label>
            <Input
              id={id}
              value={String(block.props[id] ?? "")}
              onChange={(e) => setProp(id, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
        <div>
          <Label htmlFor="hero-body">Body</Label>
          <Textarea
            id="hero-body"
            rows={3}
            value={String(block.props.body ?? "")}
            onChange={(e) => setProp("body", e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="pcta-l">Primary CTA label</Label>
            <Input
              id="pcta-l"
              value={String(block.props.primaryCtaLabel ?? "")}
              onChange={(e) => setProp("primaryCtaLabel", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="pcta-h">Primary CTA href</Label>
            <Input
              id="pcta-h"
              value={String(block.props.primaryCtaHref ?? "")}
              onChange={(e) => setProp("primaryCtaHref", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="scta-l">Secondary CTA label</Label>
            <Input
              id="scta-l"
              value={String(block.props.secondaryCtaLabel ?? "")}
              onChange={(e) => setProp("secondaryCtaLabel", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="scta-h">Secondary CTA href</Label>
            <Input
              id="scta-h"
              value={String(block.props.secondaryCtaHref ?? "")}
              onChange={(e) => setProp("secondaryCtaHref", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="stats-json">Stats (JSON array)</Label>
          <Textarea
            id="stats-json"
            rows={4}
            className="mt-1 font-mono text-xs"
            value={JSON.stringify(block.props.stats ?? [], null, 2)}
            onChange={(e) => {
              try {
                const v = JSON.parse(e.target.value) as unknown;
                if (Array.isArray(v)) setProp("stats", v);
              } catch {
                /* skip */
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (block.blockKey === "themarqueValueProps") {
    return (
      <div>
        <Label htmlFor="vp-json">Pillars (JSON array of {`{title, desc, detail}`})</Label>
        <Textarea
          id="vp-json"
          rows={12}
          className="mt-1 font-mono text-xs"
          value={JSON.stringify(block.props.items ?? [], null, 2)}
          onChange={(e) => {
            try {
              const v = JSON.parse(e.target.value) as unknown;
              if (Array.isArray(v)) setProp("items", v);
            } catch {
              /* skip */
            }
          }}
        />
      </div>
    );
  }

  if (block.blockKey === "themarqueAbout") {
    return (
      <div className="space-y-3">
        {(
          [
            ["eyebrow", "Eyebrow"],
            ["heading", "Heading"],
            ["imageUrl", "Image URL"],
          ] as const
        ).map(([id, lab]) => (
          <div key={id}>
            <Label htmlFor={id}>{lab}</Label>
            <Input
              id={id}
              value={String(block.props[id] ?? "")}
              onChange={(e) => setProp(id, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
        <div>
          <Label htmlFor="about-body">Body</Label>
          <Textarea
            id="about-body"
            rows={5}
            value={String(block.props.body ?? "")}
            onChange={(e) => setProp("body", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    );
  }

  if (block.blockKey === "themarqueHowTo") {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="how-heading">Heading</Label>
          <Input
            id="how-heading"
            value={String(block.props.heading ?? "")}
            onChange={(e) => setProp("heading", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="how-body">Body</Label>
          <Textarea
            id="how-body"
            rows={6}
            value={String(block.props.body ?? "")}
            onChange={(e) => setProp("body", e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="how-cta-l">CTA label</Label>
            <Input
              id="how-cta-l"
              value={String(block.props.ctaLabel ?? "")}
              onChange={(e) => setProp("ctaLabel", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="how-cta-h">CTA href</Label>
            <Input
              id="how-cta-h"
              value={String(block.props.ctaHref ?? "")}
              onChange={(e) => setProp("ctaHref", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    );
  }

  if (block.blockKey === "themarqueFaq") {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="faq-eyebrow">Eyebrow</Label>
          <Input
            id="faq-eyebrow"
            value={String(block.props.eyebrow ?? "")}
            onChange={(e) => setProp("eyebrow", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="faq-heading">Heading</Label>
          <Input
            id="faq-heading"
            value={String(block.props.heading ?? "")}
            onChange={(e) => setProp("heading", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="faq-items">Items (JSON)</Label>
          <Textarea
            id="faq-items"
            rows={12}
            className="mt-1 font-mono text-xs"
            value={JSON.stringify(block.props.items ?? [], null, 2)}
            onChange={(e) => {
              try {
                const v = JSON.parse(e.target.value) as unknown;
                if (Array.isArray(v)) setProp("items", v);
              } catch {
                /* skip */
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (block.blockKey === "hero") {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="hero-headline">Headline</Label>
          <Input
            id="hero-headline"
            value={String(block.props.headline ?? "")}
            onChange={(e) => setProp("headline", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="hero-sub">Subheadline</Label>
          <Input
            id="hero-sub"
            value={String(block.props.subheadline ?? "")}
            onChange={(e) => setProp("subheadline", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Align</Label>
          <Select
            value={String(block.props.align ?? "left")}
            onValueChange={(v) => setProp("align", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (block.blockKey === "text") {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="text-heading">Heading</Label>
          <Input
            id="text-heading"
            value={String(block.props.heading ?? "")}
            onChange={(e) => setProp("heading", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="text-body">Body</Label>
          <Textarea
            id="text-body"
            rows={5}
            value={String(block.props.body ?? "")}
            onChange={(e) => setProp("body", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    );
  }

  if (block.blockKey === "cta") {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="cta-label">Button label</Label>
          <Input
            id="cta-label"
            value={String(block.props.label ?? "")}
            onChange={(e) => setProp("label", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cta-url">URL</Label>
          <Input
            id="cta-url"
            value={String(block.props.url ?? "")}
            onChange={(e) => setProp("url", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    );
  }

  if (block.blockKey === "custom") {
    return (
      <div className="space-y-3">
        <div>
          <Label>Component</Label>
          <Select
            value={block.componentDefinitionRef ?? ""}
            onValueChange={(v) => {
              const def = componentDefinitions.find((d) => d._id === v);
              let nextProps = { ...block.props };
              if (def?.defaultConfigJson) {
                try {
                  const parsed = JSON.parse(def.defaultConfigJson) as Record<string, unknown>;
                  nextProps = { ...parsed, ...nextProps };
                } catch {
                  /* keep */
                }
              }
              onChange({
                ...block,
                componentDefinitionRef: v,
                props: nextProps,
              });
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a component definition" />
            </SelectTrigger>
            <SelectContent>
              {componentDefinitions.map((d) => (
                <SelectItem key={d._id} value={d._id}>
                  {d.name || d.componentKey || d._id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="custom-json">Config JSON</Label>
          <Textarea
            id="custom-json"
            rows={6}
            className="mt-1 font-mono text-xs"
            value={JSON.stringify(block.props, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value) as Record<string, unknown>;
                onChange({ ...block, props: parsed });
              } catch {
                /* invalid JSON — skip */
              }
            }}
          />
          <p className="text-[11px] text-graphite/45 mt-1">Must be valid JSON. Edits merge when JSON parses.</p>
        </div>
      </div>
    );
  }

  return null;
  })();

  return (
    <>
      <LayoutSection block={block} onChange={onChange} />
      {core}
    </>
  );
}

function BlockPreview({ block }: { block: EditableBlock }) {
  if (block.blockKey === "marqueProfileHeader") {
    const tags = Array.isArray(block.props.tags) ? block.props.tags : [];
    return (
      <div className="space-y-1">
        <p className="text-base font-bold text-graphite leading-tight">{String(block.props.name || "Name")}</p>
        <p className="text-xs text-graphite/80">{String(block.props.roleLine1 || "")}</p>
        <p className="text-[11px] text-muted-fg">{String(block.props.roleLine2 || "")}</p>
        <p className="text-[10px] text-muted-fg">{String(block.props.location || "")}</p>
        {tags.length > 0 && (
          <p className="text-[10px] text-copper line-clamp-2">
            {tags.slice(0, 4).map(String).join(" · ")}
          </p>
        )}
      </div>
    );
  }
  if (block.blockKey === "marqueProfileBiography") {
    return (
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase text-copper">{String(block.props.sectionTitle || "Biography")}</p>
        <p className="text-xs text-graphite/70 line-clamp-3">{String(block.props.body || "")}</p>
      </div>
    );
  }
  if (
    block.blockKey === "marqueProfileNewsfeed" ||
    block.blockKey === "marqueProfileBackground" ||
    block.blockKey === "marqueProfileMedia" ||
    block.blockKey === "marqueProfileInterviews" ||
    block.blockKey === "marqueProfileFeatures" ||
    block.blockKey === "marqueProfilePublications" ||
    block.blockKey === "marqueProfileAwards"
  ) {
    const items = Array.isArray(block.props.items) ? block.props.items : [];
    return (
      <p className="text-xs text-muted-fg">
        {String(block.props.sectionTitle || "Section")} — {items.length} item{items.length === 1 ? "" : "s"}
      </p>
    );
  }
  if (block.blockKey === "marqueProfileGallery") {
    const galItems = Array.isArray(block.props.items) ? block.props.items : [];
    return (
      <p className="text-xs text-muted-fg">
        {String(block.props.sectionTitle || "Gallery")} — {galItems.length} media
      </p>
    );
  }
  if (block.blockKey === "marqueProfileBoards") {
    const cur = Array.isArray(block.props.current) ? block.props.current : [];
    const prev = Array.isArray(block.props.previous) ? block.props.previous : [];
    return (
      <p className="text-xs text-muted-fg">
        Boards — {cur.length} current, {prev.length} previous
      </p>
    );
  }
  if (block.blockKey === "marqueProfileSpeaking") {
    return (
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-graphite">{String(block.props.sectionTitle || "Speaking")}</p>
        <p className="text-[10px] text-muted-fg line-clamp-2">{String(block.props.body || "")}</p>
      </div>
    );
  }
  if (block.blockKey === "themarqueHero") {
    return (
      <div className="space-y-1">
        <p className="text-[10px] text-copper uppercase tracking-wider">{String(block.props.kicker || "Kicker")}</p>
        <p className="text-sm font-semibold text-graphite">
          {String(block.props.line1)} <span className="text-copper">{String(block.props.lineHighlight)}</span>{" "}
          {String(block.props.line3)}
        </p>
        <p className="text-xs text-graphite/55 line-clamp-2">{String(block.props.body || "")}</p>
      </div>
    );
  }
  if (block.blockKey === "themarqueValueProps") {
    const items = Array.isArray(block.props.items) ? block.props.items : [];
    return (
      <p className="text-xs text-graphite/70">
        {items.length} pillar{items.length === 1 ? "" : "s"} —{" "}
        {items
          .slice(0, 3)
          .map((it: unknown) => (it && typeof it === "object" && "title" in it ? String((it as { title?: string }).title) : "") )
          .filter(Boolean)
          .join(" · ") || "…"}
      </p>
    );
  }
  if (block.blockKey === "themarqueAbout") {
    return (
      <div className="space-y-1">
        <p className="text-[10px] text-copper uppercase">{String(block.props.eyebrow || "")}</p>
        <p className="text-sm font-medium text-graphite">{String(block.props.heading || "Heading")}</p>
      </div>
    );
  }
  if (block.blockKey === "themarqueHowTo") {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-graphite">{String(block.props.heading || "How to")}</p>
        <p className="text-xs text-graphite/55 line-clamp-2">{String(block.props.body || "")}</p>
      </div>
    );
  }
  if (block.blockKey === "themarqueFaq") {
    const items = Array.isArray(block.props.items) ? block.props.items : [];
    return (
      <p className="text-xs text-graphite/70">
        FAQ — {items.length} question{items.length === 1 ? "" : "s"}
      </p>
    );
  }
  if (block.blockKey === "hero") {
    const align = block.props.align === "center" ? "text-center" : "text-left";
    return (
      <div className={cn("space-y-1", align)}>
        <p className="text-lg font-semibold text-graphite">{String(block.props.headline || "Headline")}</p>
        <p className="text-sm text-graphite/60">{String(block.props.subheadline || "Subheadline")}</p>
      </div>
    );
  }
  if (block.blockKey === "text") {
    return (
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-copper">
          {String(block.props.heading || "Heading")}
        </p>
        <p className="text-sm text-graphite/80 whitespace-pre-wrap">{String(block.props.body || "…")}</p>
      </div>
    );
  }
  if (block.blockKey === "cta") {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-sm bg-copper/90 text-white text-xs font-semibold px-3 py-1.5">
          {String(block.props.label || "Button")}
        </span>
        <span className="text-xs text-graphite/45 truncate">{String(block.props.url || "")}</span>
      </div>
    );
  }
  if (block.blockKey === "custom") {
    return (
      <div className="text-xs text-graphite/55 font-mono truncate">
        {block.componentDefinitionRef
          ? `Ref: ${block.componentDefinitionRef.slice(0, 8)}…`
          : "Select a component"}
      </div>
    );
  }
  return null;
}

export default function ProfileBuilderEditor({
  profile,
  componentDefinitions,
  profileSlug,
}: {
  profile: Profile;
  componentDefinitions: ComponentDefinitionOption[];
  profileSlug: string;
}) {
  const [blocks, setBlocks] = useState<EditableBlock[]>(() => toEditable(profile));
  const [selectedKey, setSelectedKey] = useState<string | null>(() => blocks[0]?._key ?? null);
  const [saving, setSaving] = useState(false);
  const [activePaletteEntry, setActivePaletteEntry] = useState<BuilderPaletteEntry | null>(null);
  const canvasGridRef = useRef<HTMLUListElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selected = useMemo(
    () => blocks.find((b) => b._key === selectedKey) ?? null,
    [blocks, selectedKey]
  );

  const palette = useMemo(
    () => buildProfileBuilderPalette(componentDefinitions),
    [componentDefinitions]
  );

  const paletteGroups = useMemo(() => {
    const order: { key: BuilderPaletteEntry["category"]; title: string }[] = [
      { key: "themarque", title: "Marque profile page" },
      { key: "basic", title: "Simple blocks" },
      { key: "sanity", title: "Sanity components" },
    ];
    return order.map(({ key, title }) => ({
      title,
      items: palette.filter((p) => p.category === key),
    })).filter((g) => g.items.length > 0);
  }, [palette]);

  const createBlockFromEntry = useCallback((entry: BuilderPaletteEntry): EditableBlock => {
    const basePropsRaw =
      entry.blockKey === "custom" && entry.sanityComponentDefinitionId
        ? { ...entry.defaultProps }
        : { ...defaultPropsForBlock(entry.blockKey), ...entry.defaultProps };
    const k = newKey();
    return {
      _key: k,
      blockKey: entry.blockKey,
      props: ensureLayoutProps(basePropsRaw),
      componentDefinitionRef:
        entry.blockKey === "custom" ? entry.sanityComponentDefinitionId ?? null : null,
    };
  }, []);

  const onDragStart = useCallback((event: DragStartEvent) => {
    const entry = event.active.data.current?.entry as BuilderPaletteEntry | undefined;
    if (event.active.data.current?.type === "palette" && entry) {
      setActivePaletteEntry(entry);
    }
  }, []);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActivePaletteEntry(null);

      if (!over) return;

      if (active.data.current?.type === "palette") {
        const entry = active.data.current.entry as BuilderPaletteEntry;
        const overId = String(over.id);

        if (overId === CANVAS_ROOT_ID) {
          const row = createBlockFromEntry(entry);
          setBlocks((prev) => [...prev, row]);
          setSelectedKey(row._key);
          return;
        }

        const insertRow = createBlockFromEntry(entry);
        setBlocks((prev) => {
          const insertAt = prev.findIndex((b) => b._key === overId);
          if (insertAt < 0) return prev;
          return [...prev.slice(0, insertAt), insertRow, ...prev.slice(insertAt)];
        });
        setSelectedKey(insertRow._key);
        return;
      }

      if (active.id === over.id) return;

      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i._key === active.id);
        const newIndex = items.findIndex((i) => i._key === over.id);
        if (oldIndex < 0 || newIndex < 0) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    },
    [createBlockFromEntry]
  );

  const addBlockFromPalette = (entry: BuilderPaletteEntry) => {
    const row = createBlockFromEntry(entry);
    setBlocks((prev) => [...prev, row]);
    setSelectedKey(row._key);
  };

  const removeBlock = (key: string) => {
    setBlocks((prev) => prev.filter((b) => b._key !== key));
    setSelectedKey((k) => (k === key ? null : k));
  };

  const updateBlock = (next: EditableBlock) => {
    setBlocks((prev) => prev.map((b) => (b._key === next._key ? next : b)));
  };

  const handleSave = async () => {
    for (const b of blocks) {
      if (b.blockKey === "custom" && !b.componentDefinitionRef) {
        toast.error("Each custom block needs a component selected.");
        return;
      }
    }
    setSaving(true);
    const payload: BuilderBlockSaveInput[] = blocks.map((b) => ({
      _key: b._key,
      blockKey: b.blockKey,
      propsJson: JSON.stringify(b.props),
      componentDefinitionRef:
        b.blockKey === "custom" ? b.componentDefinitionRef : null,
    }));
    const res = await saveProfileBuilderBlocks(profile._id, payload);
    setSaving(false);
    if (res.ok) {
      toast.success("Profile page saved");
    } else {
      toast.error(res.error);
    }
  };

  const viewHref = `/profiles/${encodeURIComponent(profileSlug)}`;

  return (
    <main className="w-full min-h-screen bg-cream pt-28 pb-1 px-1">
      <div className="w-full max-w-[100vw]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1 px-1">
          <div className="min-w-0">
            <Link
              href={viewHref}
              className="inline-flex items-center gap-2 text-muted-fg hover:text-copper text-sm mb-1"
            >
              <ArrowLeft size={16} /> Back to profile
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-graphite tracking-tight">Page builder</h1>
            <p className="text-muted-fg text-xs mt-0.5">
              Blocks mirror{" "}
              <Link href="https://www.themarque.com/profile/peter-arnell" className="text-copper hover:underline">
                themarque.com
              </Link>{" "}
              profile sections. 12-column grid — drag, resize, save.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2 shrink-0" size="sm">
            <Save size={16} />
            {saving ? "Saving…" : "Save to Sanity"}
          </Button>
        </div>

        <DndContext
          id="profile-page-builder-dnd"
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="grid w-full min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,18rem)] gap-1 items-start">
            <aside className="min-w-0 w-full max-w-full border border-surface-border bg-surface p-2 space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden rounded-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg px-0.5">
                Palette — drag or click
              </p>
              {paletteGroups.map((group, gi) => (
                <div key={group.title} className="space-y-1.5 min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-fg px-0.5">
                    {group.title}
                  </p>
                  {group.items.map((entry, idx) => (
                    <PaletteDraggable
                      key={`${entry.blockKey}-${entry.sanityComponentDefinitionId ?? "base"}-${gi}-${idx}`}
                      id={`palette-${gi}-${idx}-${entry.blockKey}-${entry.sanityComponentDefinitionId ?? "x"}`}
                      entry={entry}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full min-w-0 max-w-full justify-start h-auto py-2 px-2 min-h-0 overflow-hidden border-surface-border bg-background text-foreground hover:bg-cream/80"
                        onClick={() => addBlockFromPalette(entry)}
                      >
                        <span className="flex w-full min-w-0 items-start gap-2 text-left">
                          <Plus size={14} className="shrink-0 mt-0.5 text-copper" aria-hidden />
                          <span className="min-w-0 flex-1 flex flex-col gap-1">
                            <span className="text-xs font-medium text-graphite leading-snug break-words [overflow-wrap:anywhere]">
                              {entry.label}
                            </span>
                            {entry.description ? (
                              <span className="text-[10px] font-normal leading-snug text-muted-fg break-words [overflow-wrap:anywhere]">
                                {entry.description}
                              </span>
                            ) : null}
                          </span>
                        </span>
                      </Button>
                    </PaletteDraggable>
                  ))}
                </div>
              ))}
            </aside>

            <section className="min-w-0 w-full max-w-full">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg mb-1 px-0.5">
                Canvas (grid)
              </p>
              <CanvasDropZone>
                {blocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
                    <p className="text-sm text-muted-fg">Drag components here from the palette</p>
                    <p className="text-xs text-muted-fg opacity-90">or click a block in the palette to add.</p>
                  </div>
                ) : (
                  <SortableContext
                    items={blocks.map((b) => b._key)}
                    strategy={rectSortingStrategy}
                  >
                    <ul
                      ref={canvasGridRef}
                      className="page-builder-grid grid w-full min-w-0 grid-flow-row grid-cols-12 gap-1 p-1 auto-rows-min"
                    >
                      {blocks.map((b) => {
                        const col = getGridColSpan(b.props);
                        const row = getGridRowSpan(b.props);
                        return (
                          <SortableCanvasBlock
                            key={b._key}
                            id={b._key}
                            layoutProps={b.props}
                            gridRef={canvasGridRef}
                            onResizeCol={(next) => {
                              setBlocks((prev) =>
                                prev.map((bl) =>
                                  bl._key === b._key
                                    ? { ...bl, props: { ...bl.props, gridColSpan: next } }
                                    : bl
                                )
                              );
                            }}
                            onResizeRow={(next) => {
                              setBlocks((prev) =>
                                prev.map((bl) =>
                                  bl._key === b._key
                                    ? { ...bl, props: { ...bl.props, gridRowSpan: next } }
                                    : bl
                                )
                              );
                            }}
                          >
                            <div className="flex flex-col gap-1 h-full min-h-0">
                              <span className="text-[9px] text-muted-fg font-mono shrink-0">
                                {col}/{BUILDER_GRID_COLUMNS} cols · {row} row{row > 1 ? "s" : ""}
                              </span>
                              <button
                                type="button"
                                className={cn(
                                  "w-full text-left rounded-sm p-1.5 transition-colors flex-1 min-h-0",
                                  selectedKey === b._key
                                    ? "bg-copper/10 ring-1 ring-copper/30"
                                    : "hover:bg-graphite/5"
                                )}
                                onClick={() => setSelectedKey(b._key)}
                              >
                                <p className="text-[9px] uppercase tracking-wider text-muted-fg mb-0.5">
                                  {resolveBlockLabel(b, componentDefinitions)}
                                </p>
                                <BlockPreview block={b} />
                              </button>
                              <div className="flex justify-end shrink-0">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive h-7 text-xs"
                                  onClick={() => removeBlock(b._key)}
                                >
                                  <Trash2 size={12} />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </SortableCanvasBlock>
                        );
                      })}
                    </ul>
                  </SortableContext>
                )}
              </CanvasDropZone>
            </section>

            <aside className="min-w-0 w-full max-w-full border border-surface-border bg-surface p-2 rounded-sm max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg mb-2">Inspector</p>
              {!selected ? (
                <p className="text-xs text-muted-fg">Select a block on the canvas.</p>
              ) : (
                <PropsForm
                  block={selected}
                  onChange={updateBlock}
                  componentDefinitions={componentDefinitions}
                />
              )}
            </aside>
          </div>

          <DragOverlay dropAnimation={null}>
            {activePaletteEntry ? (
              <div className="rounded-md border border-copper/40 bg-surface px-3 py-2 shadow-lg text-xs font-medium text-graphite max-w-[min(100vw-2rem,280px)] break-words">
                {activePaletteEntry.label}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}

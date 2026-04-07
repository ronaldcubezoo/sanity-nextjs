"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  MARQUE_PROFILE_MEDIA_KINDS,
  labelForMarqueProfileMediaKind,
  normalizeMarqueProfileMediaKind,
  type MarqueProfileMediaKind,
} from "@/lib/marque-profile-media-kinds";
import { cn } from "@/lib/utils";

function recordsFromUnknown(arr: unknown): Record<string, unknown>[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) =>
    x && typeof x === "object" && !Array.isArray(x) ? { ...(x as Record<string, unknown>) } : {}
  );
}

function moveIndex<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function MediaKindSelect({
  value,
  onValueChange,
  id,
}: {
  value: unknown;
  onValueChange: (next: MarqueProfileMediaKind) => void;
  id?: string;
}) {
  const k = normalizeMarqueProfileMediaKind(value);
  return (
    <Select value={k} onValueChange={(v) => onValueChange(normalizeMarqueProfileMediaKind(v))}>
      <SelectTrigger id={id} className="h-8 text-sm mt-0.5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MARQUE_PROFILE_MEDIA_KINDS.map((kind) => (
          <SelectItem key={kind} value={kind}>
            {labelForMarqueProfileMediaKind(kind)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ItemCard({
  title,
  children,
  onRemove,
  onMoveUp,
  onMoveDown,
  canUp,
  canDown,
}: {
  title: string;
  children: ReactNode;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  return (
    <div className="rounded-sm border border-surface-border bg-cream/40 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-graphite">{title}</p>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!canUp}
            onClick={onMoveUp}
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!canDown}
            onClick={onMoveDown}
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={onRemove}
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}

export function StringTagsEditor({
  tags,
  onChange,
  className,
}: {
  tags: unknown;
  onChange: (next: string[]) => void;
  className?: string;
}) {
  const list = Array.isArray(tags) ? tags.map((t) => String(t)) : [];
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label>Tags</Label>
        <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => onChange([...list, ""])}>
          <Plus className="h-3.5 w-3.5" />
          Add tag
        </Button>
      </div>
      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
        {list.length === 0 ? (
          <p className="text-[11px] text-muted-fg">No tags yet. Add one or leave empty.</p>
        ) : (
          list.map((tag, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                value={tag}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                className="text-sm flex-1"
                placeholder="Tag text"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-destructive"
                onClick={() => onChange(list.filter((_, j) => j !== i))}
                aria-label="Remove tag"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

type SetItems = (next: Record<string, unknown>[]) => void;

export function MarqueNewsfeedItemsEditor({ items, onItemsChange }: { items: unknown; onItemsChange: SetItems }) {
  const list = recordsFromUnknown(items);
  const patch = (i: number, patchObj: Record<string, unknown>) => {
    onItemsChange(list.map((row, j) => (j === i ? { ...row, ...patchObj } : row)));
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => onItemsChange([...list, { source: "", headline: "", href: "" }])}
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((row, i) => (
          <ItemCard
            key={i}
            title={`News item ${i + 1}`}
            canUp={i > 0}
            canDown={i < list.length - 1}
            onRemove={() => onItemsChange(list.filter((_, j) => j !== i))}
            onMoveUp={() => onItemsChange(moveIndex(list, i, i - 1))}
            onMoveDown={() => onItemsChange(moveIndex(list, i, i + 1))}
          >
            <div className="space-y-2">
              <div>
                <Label className="text-[11px]">Source</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.source ?? "")}
                  onChange={(e) => patch(i, { source: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px]">Headline</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.headline ?? "")}
                  onChange={(e) => patch(i, { headline: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px]">Link URL</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.href ?? "")}
                  onChange={(e) => patch(i, { href: e.target.value })}
                  placeholder="https://…"
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}

export function MarqueGalleryItemsEditor({ items, onItemsChange }: { items: unknown; onItemsChange: SetItems }) {
  const list = recordsFromUnknown(items);
  const patch = (i: number, patchObj: Record<string, unknown>) => {
    onItemsChange(list.map((row, j) => (j === i ? { ...row, ...patchObj } : row)));
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Media items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => onItemsChange([...list, { title: "", url: "", mediaType: "image" }])}
        >
          <Plus className="h-3.5 w-3.5" />
          Add media
        </Button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((row, i) => (
          <ItemCard
            key={i}
            title={`${String(row.title || "Media").slice(0, 48) || `Item ${i + 1}`}`}
            canUp={i > 0}
            canDown={i < list.length - 1}
            onRemove={() => onItemsChange(list.filter((_, j) => j !== i))}
            onMoveUp={() => onItemsChange(moveIndex(list, i, i - 1))}
            onMoveDown={() => onItemsChange(moveIndex(list, i, i + 1))}
          >
            <div className="space-y-2">
              <div>
                <Label className="text-[11px]">Title (optional)</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.title ?? "")}
                  onChange={(e) => patch(i, { title: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px]">URL</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.url ?? "")}
                  onChange={(e) => patch(i, { url: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div>
                <Label className="text-[11px]" htmlFor={`gal-kind-${i}`}>
                  Media type
                </Label>
                <MediaKindSelect
                  id={`gal-kind-${i}`}
                  value={row.mediaType}
                  onValueChange={(v) => patch(i, { mediaType: v })}
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}

export function MarqueTimelineItemsEditor({
  items,
  onItemsChange,
  addLabel = "Add role",
}: {
  items: unknown;
  onItemsChange: SetItems;
  addLabel?: string;
}) {
  const list = recordsFromUnknown(items);
  const patch = (i: number, patchObj: Record<string, unknown>) => {
    onItemsChange(list.map((row, j) => (j === i ? { ...row, ...patchObj } : row)));
  };
  const empty = {
    org: "",
    role: "",
    dateRange: "",
    location: "",
    description: "",
    logoUrl: "",
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1 shrink-0"
          onClick={() => onItemsChange([...list, { ...empty }])}
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((row, i) => (
          <ItemCard
            key={i}
            title={`${String(row.org || "Organisation").slice(0, 48) || `Entry ${i + 1}`}`}
            canUp={i > 0}
            canDown={i < list.length - 1}
            onRemove={() => onItemsChange(list.filter((_, j) => j !== i))}
            onMoveUp={() => onItemsChange(moveIndex(list, i, i - 1))}
            onMoveDown={() => onItemsChange(moveIndex(list, i, i + 1))}
          >
            <div className="space-y-2">
              <div>
                <Label className="text-[11px]">Organisation</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.org ?? "")}
                  onChange={(e) => patch(i, { org: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px]">Role</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.role ?? "")}
                  onChange={(e) => patch(i, { role: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Dates</Label>
                  <Input
                    className="mt-0.5 h-8 text-sm"
                    value={String(row.dateRange ?? "")}
                    onChange={(e) => patch(i, { dateRange: e.target.value })}
                    placeholder="2011 - Present"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Location</Label>
                  <Input
                    className="mt-0.5 h-8 text-sm"
                    value={String(row.location ?? "")}
                    onChange={(e) => patch(i, { location: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-[11px]">Logo URL (optional)</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.logoUrl ?? "")}
                  onChange={(e) => patch(i, { logoUrl: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div>
                <Label className="text-[11px]">Description</Label>
                <Textarea
                  className="mt-0.5 text-sm min-h-[72px]"
                  value={String(row.description ?? "")}
                  onChange={(e) => patch(i, { description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}

/** Media section: URL + Image / Video / Audio, plus title, date, description. */
export function MarqueProfileMediaItemsEditor({ items, onItemsChange }: { items: unknown; onItemsChange: SetItems }) {
  const list = recordsFromUnknown(items);
  const patch = (i: number, patchObj: Record<string, unknown>) => {
    onItemsChange(list.map((row, j) => (j === i ? { ...row, ...patchObj } : row)));
  };
  const empty = { title: "", url: "", mediaType: "image", date: "", description: "" };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => onItemsChange([...list, { ...empty }])}
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((row, i) => (
          <ItemCard
            key={i}
            title={`${String(row.title || "Item").slice(0, 42) || `Item ${i + 1}`}`}
            canUp={i > 0}
            canDown={i < list.length - 1}
            onRemove={() => onItemsChange(list.filter((_, j) => j !== i))}
            onMoveUp={() => onItemsChange(moveIndex(list, i, i - 1))}
            onMoveDown={() => onItemsChange(moveIndex(list, i, i + 1))}
          >
            <div className="space-y-2">
              <div>
                <Label className="text-[11px]">Title</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.title ?? "")}
                  onChange={(e) => patch(i, { title: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px]">URL</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.url ?? "")}
                  onChange={(e) => patch(i, { url: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div>
                <Label className="text-[11px]" htmlFor={`media-kind-${i}`}>
                  Media type
                </Label>
                <MediaKindSelect
                  id={`media-kind-${i}`}
                  value={row.mediaType}
                  onValueChange={(v) => patch(i, { mediaType: v })}
                />
              </div>
              <div>
                <Label className="text-[11px]">Date</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.date ?? "")}
                  onChange={(e) => patch(i, { date: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px]">Description</Label>
                <Textarea
                  className="mt-0.5 text-sm min-h-[64px]"
                  value={String(row.description ?? "")}
                  onChange={(e) => patch(i, { description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}

/** Interviews & Features: free-text role/type label (not limited to image/video/audio). */
export function MarqueInterviewFeatureItemsEditor({ items, onItemsChange }: { items: unknown; onItemsChange: SetItems }) {
  const list = recordsFromUnknown(items);
  const patch = (i: number, patchObj: Record<string, unknown>) => {
    onItemsChange(list.map((row, j) => (j === i ? { ...row, ...patchObj } : row)));
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => onItemsChange([...list, { title: "", type: "", date: "", description: "" }])}
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((row, i) => (
          <ItemCard
            key={i}
            title={`${String(row.title || "Item").slice(0, 42) || `Item ${i + 1}`}`}
            canUp={i > 0}
            canDown={i < list.length - 1}
            onRemove={() => onItemsChange(list.filter((_, j) => j !== i))}
            onMoveUp={() => onItemsChange(moveIndex(list, i, i - 1))}
            onMoveDown={() => onItemsChange(moveIndex(list, i, i + 1))}
          >
            <div className="space-y-2">
              <div>
                <Label className="text-[11px]">Title</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.title ?? "")}
                  onChange={(e) => patch(i, { title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Type / role</Label>
                  <Input
                    className="mt-0.5 h-8 text-sm"
                    value={String(row.type ?? "")}
                    onChange={(e) => patch(i, { type: e.target.value })}
                    placeholder="Podcast, Video…"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Date</Label>
                  <Input
                    className="mt-0.5 h-8 text-sm"
                    value={String(row.date ?? "")}
                    onChange={(e) => patch(i, { date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-[11px]">Description</Label>
                <Textarea
                  className="mt-0.5 text-sm min-h-[64px]"
                  value={String(row.description ?? "")}
                  onChange={(e) => patch(i, { description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}

export function MarquePublicationItemsEditor({ items, onItemsChange }: { items: unknown; onItemsChange: SetItems }) {
  const list = recordsFromUnknown(items);
  const patch = (i: number, patchObj: Record<string, unknown>) => {
    onItemsChange(list.map((row, j) => (j === i ? { ...row, ...patchObj } : row)));
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() =>
            onItemsChange([...list, { title: "", role: "", date: "", location: "", description: "" }])
          }
        >
          <Plus className="h-3.5 w-3.5" />
          Add publication
        </Button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((row, i) => (
          <ItemCard
            key={i}
            title={`${String(row.title || "Publication").slice(0, 40) || `Item ${i + 1}`}`}
            canUp={i > 0}
            canDown={i < list.length - 1}
            onRemove={() => onItemsChange(list.filter((_, j) => j !== i))}
            onMoveUp={() => onItemsChange(moveIndex(list, i, i - 1))}
            onMoveDown={() => onItemsChange(moveIndex(list, i, i + 1))}
          >
            <div className="space-y-2">
              <div>
                <Label className="text-[11px]">Title</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.title ?? "")}
                  onChange={(e) => patch(i, { title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Role</Label>
                  <Input
                    className="mt-0.5 h-8 text-sm"
                    value={String(row.role ?? "")}
                    onChange={(e) => patch(i, { role: e.target.value })}
                    placeholder="Author, Editor…"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Date</Label>
                  <Input
                    className="mt-0.5 h-8 text-sm"
                    value={String(row.date ?? "")}
                    onChange={(e) => patch(i, { date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-[11px]">Location</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.location ?? "")}
                  onChange={(e) => patch(i, { location: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px]">Description</Label>
                <Textarea
                  className="mt-0.5 text-sm min-h-[64px]"
                  value={String(row.description ?? "")}
                  onChange={(e) => patch(i, { description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}

export function MarqueAwardItemsEditor({ items, onItemsChange }: { items: unknown; onItemsChange: SetItems }) {
  const list = recordsFromUnknown(items);
  const patch = (i: number, patchObj: Record<string, unknown>) => {
    onItemsChange(list.map((row, j) => (j === i ? { ...row, ...patchObj } : row)));
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() =>
            onItemsChange([...list, { org: "", award: "", year: "", location: "", description: "" }])
          }
        >
          <Plus className="h-3.5 w-3.5" />
          Add award
        </Button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((row, i) => (
          <ItemCard
            key={i}
            title={`${String(row.org || "Organisation").slice(0, 36) || `Award ${i + 1}`}`}
            canUp={i > 0}
            canDown={i < list.length - 1}
            onRemove={() => onItemsChange(list.filter((_, j) => j !== i))}
            onMoveUp={() => onItemsChange(moveIndex(list, i, i - 1))}
            onMoveDown={() => onItemsChange(moveIndex(list, i, i + 1))}
          >
            <div className="space-y-2">
              <div>
                <Label className="text-[11px]">Organisation</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.org ?? "")}
                  onChange={(e) => patch(i, { org: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-[11px]">Award / honour</Label>
                <Input
                  className="mt-0.5 h-8 text-sm"
                  value={String(row.award ?? "")}
                  onChange={(e) => patch(i, { award: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Year</Label>
                  <Input
                    className="mt-0.5 h-8 text-sm"
                    value={String(row.year ?? "")}
                    onChange={(e) => patch(i, { year: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Location</Label>
                  <Input
                    className="mt-0.5 h-8 text-sm"
                    value={String(row.location ?? "")}
                    onChange={(e) => patch(i, { location: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-[11px]">Description</Label>
                <Textarea
                  className="mt-0.5 text-sm min-h-[64px]"
                  value={String(row.description ?? "")}
                  onChange={(e) => patch(i, { description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}

export function MarqueBoardsDualEditor({
  props,
  setProp,
}: {
  props: Record<string, unknown>;
  setProp: (key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
      <div>
        <Label htmlFor="mp-b-cur-t">Current boards — section title</Label>
        <Input
          id="mp-b-cur-t"
          className="mt-1"
          value={String(props.sectionTitleCurrent ?? "")}
          onChange={(e) => setProp("sectionTitleCurrent", e.target.value)}
        />
      </div>
      <MarqueTimelineItemsEditor
        items={props.current}
        onItemsChange={(next) => setProp("current", next)}
        addLabel="Add board role"
      />
      <div>
        <Label htmlFor="mp-b-prev-t2">Previous boards — section title</Label>
        <Input
          id="mp-b-prev-t2"
          className="mt-1"
          value={String(props.sectionTitlePrevious ?? "")}
          onChange={(e) => setProp("sectionTitlePrevious", e.target.value)}
        />
      </div>
      <MarqueTimelineItemsEditor
        items={props.previous}
        onItemsChange={(next) => setProp("previous", next)}
        addLabel="Add previous role"
      />
    </div>
  );
}

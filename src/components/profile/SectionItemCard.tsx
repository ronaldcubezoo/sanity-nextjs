import type { SectionItem } from "@/src/lib/profile";

type SectionItemCardProps = {
  item: SectionItem;
};

export function SectionItemCard({ item }: SectionItemCardProps) {
  return (
    <li className="rounded-md border border-surface-border bg-surface p-4">
      <p className="font-semibold">{item.title ?? "Untitled item"}</p>
      <p className="marque-meta mt-1">
        {[item.type, item.role, item.date].filter(Boolean).join(" · ")}
      </p>
      {item.description ? (
        <p className="mt-2 text-sm leading-6">{item.description}</p>
      ) : null}
    </li>
  );
}

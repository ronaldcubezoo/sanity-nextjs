import type { ProfileSection } from "@/src/lib/profile";
import { SectionItemCard } from "./SectionItemCard";

type ProfileSectionBlockProps = {
  section: ProfileSection;
  maxColumns?: number;
};

export function ProfileSectionBlock({
  section,
  maxColumns = 4,
}: ProfileSectionBlockProps) {
  const cols = Math.min(Math.max(section.gridColumns ?? 1, 1), maxColumns);

  return (
    <section className="marque-card">
      <div className="marque-kicker" style={{ marginBottom: "0.75rem" }}>
        {section.title ?? "Untitled section"}
      </div>

      <ul
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {(section.items ?? []).map((item) => (
          <SectionItemCard key={item._key ?? item.title} item={item} />
        ))}
      </ul>
    </section>
  );
}

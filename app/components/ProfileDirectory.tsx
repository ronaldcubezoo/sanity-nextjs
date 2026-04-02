"use client";

import { useMemo, useState } from "react";
import type { Profile } from "@/lib/profile";
import { ProfileCard } from "@/src/app/components/profile/ProfileCard";

function profileSearchText(p: Profile): string {
  const parts: string[] = [
    p.name ?? "",
    p.headline ?? "",
    p.biography ?? "",
    p.slug?.current ?? "",
  ];
  for (const s of p.sections ?? []) {
    parts.push(s.title ?? "", s.type ?? "");
    for (const it of s.items ?? []) {
      parts.push(
        it.title ?? "",
        it.role ?? "",
        it.description ?? "",
        it.organization ?? "",
        it.location ?? ""
      );
    }
  }
  return parts.join(" ").toLowerCase();
}

type ProfileDirectoryProps = {
  profiles: Profile[];
};

export function ProfileDirectory({ profiles }: ProfileDirectoryProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) => profileSearchText(p).includes(q));
  }, [profiles, query]);

  return (
    <section>
      <div className="marque-kicker">Your profiles</div>
      <div className="mb-6">
        <label className="block text-sm text-[var(--muted)]" htmlFor="profile-search">
          Search
        </label>
        <input
          id="profile-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, headline, slug, sections, roles…"
          className="marque-search-input mt-1.5 w-full max-w-md rounded border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {filtered.length === 0 ? (
        <p className="marque-card">
          {query.trim()
            ? "No profiles match your search."
            : "No profiles to show."}
        </p>
      ) : (
        <div className="marque-grid">
          {filtered.map((profile) => (
            <ProfileCard key={profile._id} profile={profile} />
          ))}
        </div>
      )}
    </section>
  );
}

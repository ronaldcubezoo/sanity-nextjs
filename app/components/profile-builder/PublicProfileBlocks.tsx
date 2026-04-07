import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProfileBuilderBlock } from "@/lib/profile";
import { BUILDER_ROW_UNIT_PX, getGridColSpan, getGridRowSpan } from "@/lib/profile-builder-layout";
import {
  labelForMarqueProfileMediaKind,
  normalizeMarqueProfileMediaKind,
} from "@/lib/marque-profile-media-kinds";

function gridLayoutStyle(props: Record<string, unknown>): CSSProperties {
  const col = getGridColSpan(props);
  const row = getGridRowSpan(props);
  return {
    gridColumn: `span ${col} / span ${col}`,
    gridRow: `span ${row} / span ${row}`,
    minHeight: row * BUILDER_ROW_UNIT_PX,
  };
}

function alignClass(align: unknown): string {
  return align === "center" ? "text-center" : "text-left";
}

type Stat = { value?: string; label?: string };
type Pillar = { title?: string; desc?: string; detail?: string };
type FaqItem = { question?: string; answer?: string };

export default function PublicProfileBlocks({ blocks }: { blocks: ProfileBuilderBlock[] }) {
  if (!blocks.length) return null;

  return (
    <div className="profile-builder-grid grid grid-cols-12 gap-4 mt-10 w-full min-w-0">
      {blocks.map((block) => {
        const p = block.props;
        const gridStyle = gridLayoutStyle(p);
        const key = block._key ?? block.blockKey;

        if (block.blockKey === "marqueProfileHeader") {
          const tags = Array.isArray(p.tags) ? p.tags : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-graphite tracking-tight">
                {String(p.name ?? "")}
              </h1>
              <h2 className="text-lg md:text-xl text-graphite mt-3 font-medium">{String(p.roleLine1 ?? "")}</h2>
              <h2 className="text-base md:text-lg text-graphite/85 mt-2">{String(p.roleLine2 ?? "")}</h2>
              <p className="text-sm text-muted-fg mt-3">{String(p.location ?? "")}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs text-graphite/80 border border-surface-border rounded-sm px-2.5 py-1 bg-cream/50"
                    >
                      {String(t)}
                    </span>
                  ))}
                </div>
              )}
            </section>
          );
        }

        if (block.blockKey === "marqueProfileBiography") {
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-4 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Biography")}
              </h3>
              <div className="text-graphite/85 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {String(p.body ?? "")}
              </div>
            </section>
          );
        }

        if (block.blockKey === "marqueProfileNewsfeed") {
          const items = Array.isArray(p.items)
            ? (p.items as { source?: string; headline?: string; href?: string }[])
            : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-6 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Newsfeed")}
              </h3>
              <ul className="space-y-5">
                {items.map((it, i) => (
                  <li key={i} className="border-b border-surface-border pb-5 last:border-0 last:pb-0">
                    <p className="text-xs font-semibold text-graphite mb-1">{String(it.source ?? "")}</p>
                    <Link
                      href={String(it.href ?? "#")}
                      className="text-sm text-copper hover:underline font-medium leading-snug"
                    >
                      {String(it.headline ?? "")}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.blockKey === "marqueProfileBackground") {
          const items = Array.isArray(p.items)
            ? (p.items as {
                org?: string;
                role?: string;
                dateRange?: string;
                location?: string;
                description?: string;
              }[])
            : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-cream border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-4 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Background")}
              </h3>
              <ul className="space-y-8">
                {items.map((it, i) => (
                  <li key={i} className="border-b border-surface-border pb-8 last:border-0">
                    <p className="text-graphite font-semibold text-base">{String(it.org ?? "")}</p>
                    <p className="text-graphite/90 text-sm mt-1">{String(it.role ?? "")}</p>
                    <p className="text-muted-fg text-xs mt-1">
                      {[it.dateRange, it.location].filter(Boolean).join(" · ")}
                    </p>
                    {it.description ? (
                      <p className="text-graphite/75 text-sm mt-3 leading-relaxed">{String(it.description)}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.blockKey === "marqueProfileGallery") {
          const items = Array.isArray(p.items)
            ? (p.items as { title?: string; url?: string; mediaType?: string }[])
            : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-6 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Gallery")}
              </h3>
              {items.length === 0 ? (
                <p className="text-xs text-muted-fg">Add media items in the profile editor (URL and type).</p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((it, i) => {
                    const url = String(it.url ?? "").trim();
                    const kind = normalizeMarqueProfileMediaKind(it.mediaType);
                    const label = labelForMarqueProfileMediaKind(kind);
                    return (
                      <li
                        key={i}
                        className="rounded-sm border border-surface-border bg-cream/40 overflow-hidden flex flex-col"
                      >
                        <div className="aspect-[4/3] bg-graphite/5 flex items-center justify-center min-h-[120px]">
                          {kind === "image" && url ? (
                            // eslint-disable-next-line @next/next/no-img-element -- remote user URLs; no size optimization
                            <img src={url} alt="" className="w-full h-full object-cover max-h-56" />
                          ) : (
                            <span className="text-xs font-semibold text-graphite/60 tracking-wide">{label}</span>
                          )}
                        </div>
                        <div className="p-4 space-y-2 flex-1 flex flex-col">
                          {it.title ? (
                            <p className="text-sm font-medium text-graphite">{String(it.title)}</p>
                          ) : null}
                          <p className="text-[10px] uppercase tracking-wider text-copper">{label}</p>
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-copper hover:underline break-all mt-auto"
                            >
                              {url}
                            </a>
                          ) : (
                            <p className="text-[11px] text-muted-fg">No URL set</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        }

        if (block.blockKey === "marqueProfileBoards") {
          const current = Array.isArray(p.current)
            ? (p.current as {
                org?: string;
                role?: string;
                dateRange?: string;
                location?: string;
                description?: string;
              }[])
            : [];
          const previous = Array.isArray(p.previous)
            ? (p.previous as {
                org?: string;
                role?: string;
                dateRange?: string;
                location?: string;
                description?: string;
              }[])
            : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm space-y-10"
            >
              <div>
                <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-4 border-b border-surface-border pb-3">
                  {String(p.sectionTitleCurrent ?? "Board positions")}
                </h3>
                <ul className="space-y-6">
                  {current.map((it, i) => (
                    <li key={i}>
                      <p className="text-graphite font-semibold">{String(it.org ?? "")}</p>
                      <p className="text-sm text-graphite/85 mt-1">{String(it.role ?? "")}</p>
                      <p className="text-xs text-muted-fg mt-1">
                        {[it.dateRange, it.location].filter(Boolean).join(" · ")}
                      </p>
                      {it.description ? (
                        <p className="text-sm text-graphite/75 mt-2 leading-relaxed">{String(it.description)}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-4 border-b border-surface-border pb-3">
                  {String(p.sectionTitlePrevious ?? "Previous board positions")}
                </h3>
                <ul className="space-y-6">
                  {previous.map((it, i) => (
                    <li key={i}>
                      <p className="text-graphite font-semibold">{String(it.org ?? "")}</p>
                      <p className="text-sm text-graphite/85 mt-1">{String(it.role ?? "")}</p>
                      <p className="text-xs text-muted-fg mt-1">
                        {[it.dateRange, it.location].filter(Boolean).join(" · ")}
                      </p>
                      {it.description ? (
                        <p className="text-sm text-graphite/75 mt-2 leading-relaxed">{String(it.description)}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        }

        if (block.blockKey === "marqueProfileMedia") {
          const items = Array.isArray(p.items)
            ? (p.items as {
                title?: string;
                url?: string;
                mediaType?: string;
                type?: string;
                date?: string;
                description?: string;
              }[])
            : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-6 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Media")}
              </h3>
              <ul className="space-y-6">
                {items.map((it, i) => {
                  const url = String(it.url ?? "").trim();
                  const kind = normalizeMarqueProfileMediaKind(it.mediaType ?? it.type);
                  return (
                    <li key={i} className="border-b border-surface-border pb-6 last:border-0">
                      <p className="text-graphite font-medium text-sm md:text-base">{String(it.title ?? "")}</p>
                      <p className="text-xs text-muted-fg mt-1">
                        {[labelForMarqueProfileMediaKind(kind), it.date].filter(Boolean).join(" · ")}
                      </p>
                      {url ? (
                        <p className="mt-2">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-copper hover:underline break-all"
                          >
                            {url}
                          </a>
                        </p>
                      ) : null}
                      {it.description ? (
                        <p className="text-sm text-graphite/75 mt-2 leading-relaxed">{String(it.description)}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        }

        if (block.blockKey === "marqueProfileInterviews" || block.blockKey === "marqueProfileFeatures") {
          const items = Array.isArray(p.items)
            ? (p.items as { title?: string; type?: string; date?: string; description?: string }[])
            : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-6 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Section")}
              </h3>
              <ul className="space-y-6">
                {items.map((it, i) => (
                  <li key={i} className="border-b border-surface-border pb-6 last:border-0">
                    <p className="text-graphite font-medium text-sm md:text-base">{String(it.title ?? "")}</p>
                    <p className="text-xs text-muted-fg mt-1">
                      {[it.type, it.date].filter(Boolean).join(" · ")}
                    </p>
                    {it.description ? (
                      <p className="text-sm text-graphite/75 mt-2 leading-relaxed">{String(it.description)}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.blockKey === "marqueProfilePublications") {
          const items = Array.isArray(p.items)
            ? (p.items as {
                title?: string;
                role?: string;
                date?: string;
                location?: string;
                description?: string;
              }[])
            : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-cream border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-6 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Publications")}
              </h3>
              <ul className="space-y-6">
                {items.map((it, i) => (
                  <li key={i} className="border-b border-surface-border pb-6 last:border-0">
                    <p className="text-graphite font-semibold">{String(it.title ?? "")}</p>
                    <p className="text-xs text-muted-fg mt-1">
                      {[it.role, it.date, it.location].filter(Boolean).join(" · ")}
                    </p>
                    {it.description ? (
                      <p className="text-sm text-graphite/75 mt-2 leading-relaxed">{String(it.description)}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.blockKey === "marqueProfileAwards") {
          const items = Array.isArray(p.items)
            ? (p.items as {
                org?: string;
                award?: string;
                year?: string;
                location?: string;
                description?: string;
              }[])
            : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-6 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Awards")}
              </h3>
              <ul className="space-y-6">
                {items.map((it, i) => (
                  <li key={i} className="border-b border-surface-border pb-6 last:border-0">
                    <p className="text-graphite font-semibold">{String(it.org ?? "")}</p>
                    <p className="text-sm text-graphite/85 mt-1">{String(it.award ?? "")}</p>
                    <p className="text-xs text-muted-fg mt-1">
                      {[it.year, it.location].filter(Boolean).join(" · ")}
                    </p>
                    {it.description ? (
                      <p className="text-sm text-graphite/75 mt-2 leading-relaxed">{String(it.description)}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.blockKey === "marqueProfileSpeaking") {
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-cream border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-copper text-sm font-bold tracking-wide uppercase mb-4 border-b border-surface-border pb-3">
                {String(p.sectionTitle ?? "Speaking engagements")}
              </h3>
              <p className="text-graphite/85 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {String(p.body ?? "")}
              </p>
              {p.locationLine ? (
                <p className="text-xs text-muted-fg mt-4">{String(p.locationLine)}</p>
              ) : null}
            </section>
          );
        }

        if (block.blockKey === "themarqueHero") {
          const stats = Array.isArray(p.stats) ? (p.stats as Stat[]) : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section rounded-sm overflow-hidden border border-surface-border bg-brand text-white p-8 md:p-12 shadow-sm"
            >
              <p className="text-copper text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
                {String(p.kicker ?? "")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
                {String(p.line1 ?? "")}{" "}
                <span className="text-copper">{String(p.lineHighlight ?? "")}</span>
                <br />
                {String(p.line3 ?? "")}
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-xl mb-8">{String(p.body ?? "")}</p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href={String(p.primaryCtaHref ?? "/profiles")}
                  className="inline-flex items-center gap-2 bg-copper hover:bg-copper/90 text-white text-sm font-semibold px-6 py-3 rounded-sm transition-colors"
                >
                  {String(p.primaryCtaLabel ?? "View Our Profiles")}
                </Link>
                <Link
                  href={String(p.secondaryCtaHref ?? "#about")}
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/90 text-sm px-6 py-3 rounded-sm transition-colors"
                >
                  {String(p.secondaryCtaLabel ?? "Learn More")}
                </Link>
              </div>
              {stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
                  {stats.map((s, i) => (
                    <div key={i}>
                      <p className="text-copper text-2xl md:text-3xl font-bold">{String(s.value ?? "")}</p>
                      <p className="text-white/50 text-xs mt-1">{String(s.label ?? "")}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        }

        if (block.blockKey === "themarqueValueProps") {
          const items = Array.isArray(p.items) ? (p.items as Pillar[]) : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-cream border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <div className="grid md:grid-cols-3 gap-8">
                {items.map((it, i) => (
                  <div key={i} className="space-y-3">
                    <h3 className="text-graphite font-semibold text-lg">{String(it.title ?? "")}</h3>
                    <p className="text-graphite/75 text-sm leading-relaxed">{String(it.desc ?? "")}</p>
                    {it.detail ? (
                      <p className="text-graphite/45 text-xs leading-relaxed">{String(it.detail)}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (block.blockKey === "themarqueAbout") {
          const src = String(p.imageUrl ?? "");
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-cream border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {src ? (
                  <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-sm overflow-hidden border border-surface-border">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="224px"
                      unoptimized
                    />
                  </div>
                ) : null}
                <div>
                  <p className="text-copper text-xs tracking-[0.2em] uppercase mb-3">{String(p.eyebrow ?? "")}</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-graphite mb-4">{String(p.heading ?? "")}</h2>
                  <p className="text-graphite/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {String(p.body ?? "")}
                  </p>
                </div>
              </div>
            </section>
          );
        }

        if (block.blockKey === "themarqueHowTo") {
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-graphite mb-4">{String(p.heading ?? "")}</h2>
              <p className="text-graphite/80 text-sm md:text-base leading-relaxed max-w-2xl mb-8 whitespace-pre-wrap">
                {String(p.body ?? "")}
              </p>
              <Link
                href={String(p.ctaHref ?? "/contact")}
                className="inline-flex items-center rounded-sm bg-copper text-white text-sm font-semibold px-6 py-3 hover:bg-copper/90 transition-colors"
              >
                {String(p.ctaLabel ?? "Contact us")}
              </Link>
            </section>
          );
        }

        if (block.blockKey === "themarqueFaq") {
          const items = Array.isArray(p.items) ? (p.items as FaqItem[]) : [];
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-cream border border-surface-border rounded-sm p-8 md:p-10 shadow-sm"
            >
              <p className="text-copper text-xs tracking-[0.25em] uppercase mb-3">{String(p.eyebrow ?? "")}</p>
              <h2 className="text-graphite text-2xl md:text-3xl font-bold mb-8">{String(p.heading ?? "")}</h2>
              <ul className="space-y-6">
                {items.map((it, i) => (
                  <li key={i} className="border-b border-surface-border pb-6 last:border-0">
                    <p className="text-graphite font-medium text-sm md:text-base mb-2">{String(it.question ?? "")}</p>
                    <p className="text-graphite/70 text-sm leading-relaxed">{String(it.answer ?? "")}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.blockKey === "hero") {
          return (
            <section
              key={key}
              style={gridStyle}
              className={`profile-builder-section bg-surface border border-surface-border rounded-sm p-8 md:p-10 shadow-sm ${alignClass(p.align)}`}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-graphite tracking-tight">
                {String(p.headline ?? "")}
              </h2>
              {p.subheadline != null && String(p.subheadline).trim() !== "" && (
                <p className="text-graphite/65 mt-3 text-base md:text-lg">{String(p.subheadline)}</p>
              )}
            </section>
          );
        }

        if (block.blockKey === "text") {
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-surface-border rounded-sm p-8 shadow-sm"
            >
              {p.heading != null && String(p.heading).trim() !== "" && (
                <h2 className="text-copper font-bold text-xs tracking-widest uppercase mb-4 border-b border-surface-border pb-4">
                  {String(p.heading)}
                </h2>
              )}
              <div className="text-graphite/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {String(p.body ?? "")}
              </div>
            </section>
          );
        }

        if (block.blockKey === "cta") {
          const label = String(p.label ?? "Learn more");
          const url = String(p.url ?? "#");
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-graphite border border-surface-border rounded-sm p-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href={url}
                className="inline-flex items-center rounded-sm bg-copper text-white text-sm font-semibold px-6 py-3 hover:bg-copper/90 transition-colors"
              >
                {label}
              </Link>
            </section>
          );
        }

        if (block.blockKey === "custom") {
          const title =
            block.componentDefinition?.name ||
            block.componentDefinition?.componentKey ||
            "Custom block";
          return (
            <section
              key={key}
              style={gridStyle}
              className="profile-builder-section bg-surface border border-dashed border-surface-border rounded-sm p-6 shadow-sm"
            >
              <p className="text-[10px] uppercase tracking-widest text-muted-fg mb-2">{title}</p>
              <pre className="text-xs text-graphite/70 whitespace-pre-wrap font-mono overflow-x-auto">
                {JSON.stringify(p, null, 2)}
              </pre>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}

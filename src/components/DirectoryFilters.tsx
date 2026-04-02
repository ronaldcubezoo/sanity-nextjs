"use client";
import { useState, useRef, useEffect, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const industryFilters = [
  { label: "All", value: "All" },
  { label: "Finance & Investment", value: "Finance" },
  { label: "Hospitality & Real Estate", value: "Hospitality" },
  { label: "Sports Management", value: "Sport" },
  { label: "Technology & Innovation", value: "Tech" },
  { label: "Philanthropy & Boards", value: "Philanthropy" },
  { label: "Leadership", value: "Leadership" },
  { label: "Entrepreneurship", value: "Entrepreneurship" },
  { label: "Arts", value: "Arts" },
];

interface DirectoryFiltersProps {
  currentQuery: string;
  currentCategory: string;
  resultCount: number;
}

export default function DirectoryFilters({ currentQuery, currentCategory, resultCount }: DirectoryFiltersProps) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(currentQuery);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // Debounce search input to update URL without lagging the UI
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localQuery !== currentQuery) updateUrl(localQuery, currentCategory);
    }, 300);
    return () => clearTimeout(timeout);
  }, [localQuery, currentCategory, currentQuery]);

  const updateUrl = (newQuery: string, newCat: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newCat !== "All") params.set("category", newCat);

    startTransition(() => {
      router.push(`/profiles?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchIconClick = () => {
    setSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  return (
    <>
      <div className="bg-graphite border-b border-graphite-light/20 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Search Row */}
          <div className="flex items-center gap-3 pt-4 pb-3">
            {/* Desktop: always-visible search */}
            <div className="hidden md:flex flex-1 max-w-sm items-center gap-2.5 border border-cream/15 hover:border-copper/50 focus-within:border-copper rounded-sm px-4 py-2.5 bg-graphite-light/30 transition-colors duration-200 ease-in-out">
              {isPending ? (
                <Loader2 size={14} className="text-copper flex-shrink-0 animate-spin" />
              ) : (
                <Search size={14} className="text-cream/35 flex-shrink-0" />
              )}
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search profiles…"
                className="bg-transparent text-sm text-cream placeholder-cream/35 outline-none w-full"
              />
              {localQuery && (
                <button onClick={() => setLocalQuery("")} className="text-cream/40 hover:text-cream transition-colors">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Mobile: icon-only → expands on tap */}
            <div className="md:hidden flex items-center gap-2">
              {searchExpanded ? (
                <div className="flex items-center gap-2 border border-copper rounded-sm px-3 py-2.5 bg-graphite-light/30 transition-all duration-200">
                  {isPending ? (
                    <Loader2 size={14} className="text-copper flex-shrink-0 animate-spin" />
                  ) : (
                    <Search size={14} className="text-copper flex-shrink-0" />
                  )}
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search profiles…"
                    className="bg-transparent text-sm text-cream placeholder-cream/35 outline-none w-44"
                  />
                  <button
                    onClick={() => { setSearchExpanded(false); setLocalQuery(""); }}
                    className="text-cream/40 hover:text-cream transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSearchIconClick}
                  aria-label="Open search"
                  className="w-9 h-9 flex items-center justify-center border border-cream/15 rounded-sm text-cream/50 hover:border-copper/50 hover:text-copper transition-all duration-200 ease-in-out"
                >
                  <Search size={15} />
                </button>
              )}
            </div>

            {/* Result count (Desktop) */}
            <p className="text-cream/30 text-xs ml-auto hidden sm:block tracking-wide">
              {resultCount} result{resultCount !== 1 ? "s" : ""}
              {currentCategory !== "All" ? ` · ${industryFilters.find(f => f.value === currentCategory)?.label ?? currentCategory}` : ""}
            </p>
          </div>

          {/* Industry Filter Tags — horizontal scroll */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 -mx-1 px-1 hide-scrollbar">
            {industryFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => updateUrl(localQuery, filter.value)}
                className={`flex-shrink-0 text-xs px-3.5 py-2 rounded-sm border transition-all duration-200 ease-in-out tracking-wide whitespace-nowrap ${currentCategory === filter.value
                    ? "bg-copper border-copper text-cream font-semibold shadow-sm"
                    : "border-cream/15 text-cream/55 hover:border-copper/45 hover:text-cream/80"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile result count */}
      <div className="sm:hidden bg-graphite/5 border-b border-graphite/8 px-6 py-2">
        <p className="text-graphite/40 text-xs tracking-wide">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </p>
      </div>
    </>
  );
}
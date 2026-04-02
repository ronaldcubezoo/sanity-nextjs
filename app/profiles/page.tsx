import { getProfiles } from "@/lib/profile";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProfileCard from "@/app/components/ProfileCard";
import DirectoryFilters from "@/app/components/DirectoryFilters";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const resolvedParams = await searchParams;
    const searchQuery = resolvedParams.q?.toLowerCase() || "";
    const activeCategory = resolvedParams.category || "All";

    // 1. Fetch data using your coworker's backend
    let rawProfiles = [];
    try {
        rawProfiles = await getProfiles();
    } catch (error) {
        console.error("Failed to load Sanity profiles:", error);
    }

    // 2. Map their data shape to fit YOUR UI components
    const profiles = rawProfiles.map((p) => ({
        id: p.slug?.current || p._id,
        name: p.name || "Unknown Name",
        title: p.headline || "",
        category: ["Sanity Profile"], // Fallback until they add this to the CMS
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400", // Fallback
        verified: true,
        marqueApproved: true,
        bio: p.biography || ""
    }));

    // 3. Client-side filtering
    const filteredProfiles = profiles.filter((p) => {
        const matchesQuery =
            searchQuery === "" ||
            p.name.toLowerCase().includes(searchQuery) ||
            p.title.toLowerCase().includes(searchQuery);

        const matchesCategory =
            activeCategory === "All" || p.category.includes(activeCategory);

        return matchesQuery && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-cream">
            <Header />

            {/* Page Hero */}
            <div className="bg-graphite pt-32 pb-14 px-6 lg:px-10">
                <div className="max-w-7xl mx-auto">
                    <p className="text-copper text-xs tracking-[0.25em] uppercase mb-4">Directory</p>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-cream text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-3">
                                The Marque Profiles
                            </h1>
                            <p className="text-cream/50 text-sm max-w-md">
                                A curated directory of verified professional profiles.
                            </p>
                        </div>
                        <div className="text-cream/30 text-sm flex-shrink-0">
                            <span className="text-copper font-bold text-2xl">{profiles.length}</span> profiles loaded
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filtering Component */}
            <DirectoryFilters
                currentQuery={resolvedParams.q || ""}
                currentCategory={activeCategory}
                resultCount={filteredProfiles.length}
            />

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
                {filteredProfiles.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProfiles.map((profile: any, i: number) => (
                            <ProfileCard key={profile.id} profile={profile} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <p className="text-graphite/20 text-5xl mb-5 font-thin">—</p>
                        <p className="text-graphite/45 text-sm mb-2">No profiles match your search.</p>
                        <Link
                            href="/"
                            className="mt-2 inline-flex items-center gap-1 text-copper text-sm hover:gap-2 transition-all duration-200"
                        >
                            Clear filters <ChevronRight size={13} />
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
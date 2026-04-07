import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PublicProfileBlocks from "@/app/components/profile-builder/PublicProfileBlocks";
import { getProfileBySlug, resolveProfileBuilderBlocks } from "@/lib/profile";
import { getProfileImage } from "@/lib/profile-images";

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const rawProfile = await getProfileBySlug(slug);

  if (!rawProfile) {
    notFound();
  }

  const slugForUrl = rawProfile.slug?.current || rawProfile._id;
  const portraitSrc = rawProfile.portraitImageUrl || getProfileImage(String(slugForUrl));
  const displayName = rawProfile.name || "Profile";
  const builderBlocks = resolveProfileBuilderBlocks(rawProfile);

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-cream pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Link
            href="/profiles"
            className="inline-flex items-center gap-2 text-graphite/60 hover:text-copper transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Directory
          </Link>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            <Link
              href={`/profiles/${encodeURIComponent(String(slugForUrl))}/edit`}
              className="inline-flex items-center gap-2 text-graphite hover:text-copper transition-colors text-sm font-medium border border-graphite/20 px-4 py-2 rounded-sm hover:border-copper/50 bg-white"
            >
              Edit page layout
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-graphite hover:text-copper transition-colors text-sm font-medium border border-graphite/20 px-4 py-2 rounded-sm hover:border-copper/50 bg-white"
            >
              <Download size={16} /> Download Profile (PDF)
            </button>
          </div>
        </div>

        <article className="max-w-5xl mx-auto px-6 lg:px-10">
          {builderBlocks.length > 0 ? (
            <>
              {portraitSrc ? (
                <div className="flex justify-center mb-10">
                  <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-sm overflow-hidden border border-graphite/10 bg-graphite/5 shadow-sm">
                    <Image
                      src={portraitSrc}
                      alt={`Portrait of ${displayName}`}
                      fill
                      className="object-cover object-top"
                      priority
                      sizes="(max-width: 768px) 160px, 192px"
                      unoptimized
                    />
                  </div>
                </div>
              ) : null}
              <PublicProfileBlocks blocks={builderBlocks} />
            </>
          ) : (
            <div className="bg-white border border-graphite/10 rounded-sm p-12 shadow-sm text-center">
              <p className="text-graphite/85 mb-2 font-medium">{displayName}</p>
              <p className="text-sm text-graphite/55 mb-6">
                No page content yet. Open the editor to add sections and blocks.
              </p>
              <Link
                href={`/profiles/${encodeURIComponent(String(slugForUrl))}/edit`}
                className="inline-flex items-center gap-2 text-copper font-medium text-sm hover:underline"
              >
                Edit page layout
              </Link>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}

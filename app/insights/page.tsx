import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NewsletterCTA from "@/app/components/NewsletterCTA";
import InsightCard from "@/app/components/InsightCard";
import { Metadata } from "next";
import { insights, insightCategories } from "@/data/insights"; // <-- Bypassing Sanity for the demo!

export const metadata: Metadata = {
  title: "Insights | The Marque",
  description: "Expert perspectives on digital reputation.",
};

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || "All";

  // 1. Separate featured article and filter the rest using your LOCAL data
  const featured = insights.find((i) => i.featured) ?? insights[0];
  
  const rest = activeCategory === "All" 
    ? insights.filter((i) => i.id !== featured?.id)
    : insights.filter((i) => i.category === activeCategory && i.id !== featured?.id);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Featured Hero Article */}
      {featured && (
        <section className="relative h-[75vh] min-h-[540px] flex items-end overflow-hidden mt-16">
          <div className="absolute inset-0 bg-graphite">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              className="object-cover opacity-80"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite-dark via-graphite/70 to-graphite/20" />
          </div>

          <div className="relative z-10 container-wide pb-14">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-copper text-cream text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1">
                  {featured.category}
                </span>
                <span className="text-cream/50 text-xs flex items-center gap-1.5">
                  <Clock size={11} />
                  {featured.read_time}
                </span>
              </div>
              <h1 className="text-cream text-3xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
                {featured.title}
              </h1>
              <p className="text-cream/65 text-sm lg:text-base leading-relaxed mb-8 max-w-xl">
                {featured.summary}
              </p>
              <Link
                href={`/insights/${featured.id}`}
                className="inline-flex items-center gap-2 text-copper font-semibold text-sm tracking-wide group"
              >
                Read Article
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            {featured.date && (
              <p className="absolute bottom-14 right-10 text-cream/30 text-xs tracking-widest hidden lg:block">
                {featured.date}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Category Filter Bar */}
      <div className="bg-graphite border-b border-graphite-light/25 sticky top-16 z-30">
        <div className="container-wide">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-3 hide-scrollbar">
            <span className="text-cream/25 text-xs tracking-widest uppercase mr-3 flex-shrink-0">
              Filter
            </span>
            {insightCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={`/insights?category=${cat}`}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-sm border transition-all duration-200 ease-in-out tracking-wide whitespace-nowrap ${
                    isActive
                      ? "bg-copper border-copper text-cream font-semibold"
                      : "border-cream/15 text-cream/50 hover:border-copper/50 hover:text-cream"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container-wide py-14">
        {rest.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((article: any, i: number) => (
              <InsightCard key={article.id} article={article} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-graphite/30 text-sm">No articles in this category yet.</p>
            <Link href="/insights" className="mt-3 inline-block text-copper text-sm underline underline-offset-2">
              View all insights
            </Link>
          </div>
        )}
      </div>

      <NewsletterCTA />
      <Footer />
    </div>
  );
}
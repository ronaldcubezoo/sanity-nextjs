import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ArrowLeft, Download } from "lucide-react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { getProfileBySlug } from "@/src/lib/profile"; // <-- Coworker's backend function!

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Fetch data using the coworker's Sanity service
  const rawProfile = await getProfileBySlug(slug);

  if (!rawProfile) {
    notFound();
  }

  // 2. Map their data structure to your UI structure
  const profile = {
    id: rawProfile.slug?.current || rawProfile._id,
    name: rawProfile.name || "Unknown Name",
    title: rawProfile.headline || "",
    category: ["Sanity Profile"], // Fallback
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400", // Fallback until they add image fields
    bio: rawProfile.biography || "",
    verified: true, // Fallback
    marqueApproved: true, // Fallback
    sections: (rawProfile.sections || []).map((sec) => ({
      category: sec.title || sec.type || "Section",
      verified: true,
      items: (sec.items || []).map((item) => ({
        label: item.organization || item.title || "Organization",
        detail: item.role || item.description || "",
        year: item.date || item.location || "",
        source: "Sanity Data"
      }))
    }))
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-cream pt-28 pb-20">
        
        {/* Navigation & Action Bar */}
        <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Link href="/profiles" className="inline-flex items-center gap-2 text-graphite/60 hover:text-copper transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Directory
          </Link>
          
          <button className="inline-flex items-center gap-2 text-graphite hover:text-copper transition-colors text-sm font-medium border border-graphite/20 px-4 py-2 rounded-sm hover:border-copper/50 bg-white">
            <Download size={16} /> Download Profile (PDF)
          </button>
        </div>

        <article className="max-w-5xl mx-auto px-6 lg:px-10">
          
          {/* Hero Section */}
          <div className="bg-white border border-graphite/10 rounded-sm p-8 md:p-12 mb-8 shadow-sm flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-sm overflow-hidden border border-graphite/10 bg-graphite/5">
              <Image
                src={profile.image}
                alt={`Portrait of ${profile.name}`}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 160px, 224px"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-graphite tracking-tight">{profile.name}</h1>
                {profile.verified && <BadgeCheck size={24} className="fill-copper text-white flex-shrink-0" />}
              </div>
              <p className="text-lg md:text-xl text-copper font-medium mb-6">{profile.title}</p>
              <div className="text-graphite/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                <p>{profile.bio}</p>
              </div>
            </div>
          </div>

          {/* Modular Sections Grid (Powered by Coworker's Backend) */}
          {profile.sections && profile.sections.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {profile.sections.map((section: any, idx: number) => (
                <section key={idx} className="bg-white border border-graphite/10 rounded-sm p-8 shadow-sm">
                  <h2 className="text-copper font-bold text-xs tracking-widest uppercase mb-6 border-b border-graphite/10 pb-4">
                    {section.category}
                  </h2>
                  <ul className="space-y-6">
                    {section.items?.map((item: any, i: number) => (
                      <li key={i} className="flex flex-col">
                        <span className="text-graphite font-semibold text-base">{item.label}</span>
                        {item.detail && <span className="text-graphite/60 text-sm mt-1">{item.detail}</span>}
                        {item.year && <span className="text-copper/80 text-xs mt-1.5 font-medium">{item.year}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

        </article>
      </main>
      <Footer />
    </>
  );
}